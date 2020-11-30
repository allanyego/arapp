import React, { useState } from "react";
import { IonText, IonPage, IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonModal, useIonViewDidEnter, useIonViewWillLeave, IonSearchbar, IonGrid, IonRow, IonCol } from "@ionic/react";
import moment from "moment";
import { close, play, shareSocial } from "ionicons/icons";

import useToastManager from "../lib/toast-manager";
import { useAppContext } from "../lib/context-lib";
import useMounted from "../lib/mount-lib";
import LoaderFallback from "../components/LoaderFallback";
import { getUserIncidents, getVideoToken, shareVideoUrl } from "../http/incidents";
import { INCIDENT_TYPES } from "../http/constants";
import createVideoUrl from "../lib/create-video-url";
import Centered from "../components/Centered";
import { getPolice } from "../http/users";
import debounce from "../lib/debounce";
import "./Incidents.css";
import trimAndLower from "../lib/trim-and-lower";

const SearchResult: React.FC<{
  user: any,
  onTap: (arg: any) => any,
}> = ({ user, onTap }) => {
  const handleClick = () => onTap(user);

  return (
    <IonItem button onClick={handleClick}>
      <IonLabel>
        <h2 className="ion-text-capitalize">
          <strong>{user.fullName}</strong>
        </h2>
        <IonText color="medium">
          <small>@{user.username}</small>
        </IonText>
      </IonLabel>
    </IonItem>
  );
};

const ShareButton: React.FC<{
  incidentId: string,
}> = ({ incidentId }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [isSharing, setSharing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { onError, onSuccess } = useToastManager();
  const { currentUser } = useAppContext() as any;

  const toggleSearch = () => setShowSearch(!showSearch);

  const fetchPolice = async (opts?: any) => {
    setSearching(true);
    try {
      const { data } = await getPolice(currentUser.token, opts);
      setSearchResults(data);
      setSearching(false);
    } catch (error) {
      setSearching(false);
      onError(error.message);
    }
  };

  const onTap = async (user: any) => {
    toggleSearch();
    setSharing(true);
    try {
      await shareVideoUrl(incidentId, user._id, currentUser.token);
      onSuccess("Video url shared.");
      setSharing(false);
    } catch (error) {
      setSharing(false);
      onError(error.message);
    }
  };

  const handleSearch = async (e: any) => {
    const searchTerm = trimAndLower(e.target.value);
    if (!searchTerm) {
      return;
    }

    setSearching(true);

    try {
      await fetchPolice({
        username: searchTerm
      });
    } catch (error) {
      onError(error.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <Centered>
        <IonButton
          onClick={toggleSearch}
          disabled={isSharing}
          color="dark"
        >
          {isSharing ? "Sharing..." : "Share to a cop"} <IonIcon slot="end" icon={shareSocial} />
        </IonButton>
      </Centered>
      {showSearch && (
        <div className="share-results-container">
          <IonGrid>
            <IonRow>
              <IonCol className="ion-no-padding">
                <IonSearchbar
                  onIonChange={debounce(handleSearch, 1200)}
                  placeholder="enter username"
                />
              </IonCol>
              <IonCol className="ion-no-padding d-flex ion-align-items-center" size="2">
                <IonButton fill="clear" color="danger" onClick={toggleSearch} disabled={isSearching}>
                  <IonIcon slot="icon-only" icon={close} />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <hr />

          {isSearching ? (
            <LoaderFallback fullHeight />
          ) : (
              <IonList lines="full">
                {searchResults.map((user: any) => (
                  <SearchResult key={user._id} {...{ onTap, user }} />
                ))}
              </IonList>
            )}
        </div>
      )}
    </div>
  )
};

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
      isOpen && setUrl(createVideoUrl(incident.videoEvidence, data));
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
            {isVideo && (
              <ShareButton incidentId={incident._id} />
            )}
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
