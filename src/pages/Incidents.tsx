import React, { useState } from "react";
import { IonText, IonPage, IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonModal, IonTextarea, IonSpinner, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import moment from "moment";
import useToastManager from "../lib/toast-manager";
import { useAppContext } from "../lib/context-lib";
import useMounted from "../lib/mount-lib";
import LoaderFallback from "../components/LoaderFallback";
import { getUserIncidents, getVideoToken } from "../http/incidents";
import { INCIDENT_TYPES, SERVER_URL } from "../http/constants";
import { play } from "ionicons/icons";

const IncidentItem: React.FC<{
  incident: any,
  onSelect: any,
}> = ({ incident, onSelect }) => {
  const onTap = () => onSelect(incident);
  const isVideo = incident.type === INCIDENT_TYPES.VIDEO;

  return (
    <IonItem onClick={onTap} button key={incident._id}>
      <IonLabel>
        <h3 className="ion-text-capitalize">
          {isVideo ? (
            "Video capture"
          ) : (
              <>
                SMS to <strong>{incident.contact.displayName}</strong>
              </>
            )}
        </h3>
        <p>{isVideo ? incident.videoEvidence : incident.location.name}</p>
        <IonText color="medium">
          <small>{moment(incident.createdAt).format("MMM Do YY")}</small>
        </IonText>
      </IonLabel>
      {isVideo && (
        <IonIcon slot="end" color="danger" icon={play} />
      )}
    </IonItem>
  );
};

const IncidentContact: React.FC<{
  incident: any,
}> = ({ incident }) => {
  const { location, contact } = incident;

  return (
    <>
      <p>
        Location: <strong>
          {location.name}
        </strong>
        <br />
        <small>
          Coordinates: <strong>(
                  {`${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
                  )</strong>
        </small>
      </p>
      <p>
        Contact: <strong
          className="ion-text-capitalize"
        >{`${contact.displayName}, ${contact.phone}`}</strong>
      </p>
    </>
  );
};

interface IncidentModalProps {
  isOpen: boolean
  incident: any
  onClose: () => any
}

const createUrl = (filename: string, token: string) => {
  return `${SERVER_URL}/incidents/video/${filename}?token=${token}`;
};

const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  incident,
  onClose,
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const setUp = async () => {
    try {
      if (incident.type !== INCIDENT_TYPES.VIDEO) {
        return;
      }

      const { data } = await getVideoToken(currentUser.token);
      isOpen && setUrl(createUrl(incident.videoEvidence, data));
    } catch (error) {
      onError(error.message);
    }
  };
  const tearDown = () => setUrl(null);

  if (!incident) {
    return null;
  }

  const { _id, createdAt, type } = incident;
  const isVideo = type === INCIDENT_TYPES.VIDEO;

  return (
    <IonModal
      isOpen={isOpen}
      onDidPresent={setUp}
      onWillDismiss={tearDown}
    >
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={onClose}>Close</IonButton>
        </IonButtons>
        <IonTitle size="small" color="primary">Incident #{_id}</IonTitle>
      </IonToolbar>
      <IonContent fullscreen>
        <div className="h100">
          <div>
            {isVideo ? (
              url ? (
                <video id="videoPlayer"
                  controls
                  autoPlay={false}
                  style={{
                    width: "100%",
                  }}
                >
                  <source src={url} type="video/webm" />
                </video>
              ) : (
                  <LoaderFallback />
                )
            ) : (
                <div className="ion-padding" style={{
                  background: "var(--ion-color-light-shade)"
                }}>
                  <h5 className="ion-text-center">SMS Alert</h5>
                </div>
              )}
          </div>
          <div className="ion-padding-horizontal">
            {!isVideo && (
              <IncidentContact incident={incident} />
            )}
            <small>Date: {moment(createdAt).format("MMM Do YY")}</small>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<any[] | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const { onError } = useToastManager();
  const { currentUser } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();

  const closeModal = () => setSelectedIncident(null);
  const fetchIncidents = async () => {
    try {
      const { data } = await getUserIncidents(currentUser._id, currentUser.token);
      isMounted && setIncidents(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useIonViewDidEnter(fetchIncidents);
  useIonViewWillLeave(() => setMounted(false));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/profile" />
          </IonButtons>
          <IonTitle size="small">Your incident history</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!incidents ? (
          <LoaderFallback />
        ) : (
            <IonList lines="full">
              {incidents.map((incident: any) => (
                <IncidentItem
                  key={incident._id}
                  incident={incident}
                  onSelect={setSelectedIncident}
                />
              ))}
            </IonList>
          )}

        <IncidentModal
          isOpen={!!selectedIncident}
          onClose={closeModal}
          incident={selectedIncident}
        />
      </IonContent>
    </IonPage>
  );
};

export default Incidents;
