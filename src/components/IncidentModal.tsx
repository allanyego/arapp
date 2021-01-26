import { IonAlert, IonButton, IonButtons, IonContent, IonIcon, IonModal, IonText, IonTitle, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import { INCIDENT_TYPES } from "../http/constants";
import { getVideoToken } from "../http/incidents";
import moment from "moment";

import { useAppContext } from "../lib/context-lib";
import { deleteIncidentVideo } from "../http/incidents";
import createVideoUrl from "../lib/create-video-url";
import useToastManager from "../lib/toast-manager";
import IncidentContact from "./IncidentContact";
import LoaderFallback from "./LoaderFallback";
import ShareButton from "./ShareButton";
import Centered from "./Centered";
import { trash } from "ionicons/icons";

interface IncidentModalProps {
  isOpen: boolean
  incident: any
  onClose: () => any
}

const ModalPanel: React.FC = ({ children }) => (
  <div className="ion-padding" style={{
    background: "var(--ion-color-light-shade)"
  }}>
    <h5 className="ion-text-center">{children}</h5>
  </div>
);

const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  incident,
  onClose,
}) => {
  const [url, setUrl] = useState<string>("");
  const [isFetching, setFetching] = useState<boolean>(true);
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const [isDeleted, setDeleted] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { currentUser } = useAppContext() as any;
  const { onError, onInfo } = useToastManager();

  const setUp = async () => {
    try {
      if (incident.type !== INCIDENT_TYPES.VIDEO) {
        return;
      }

      if (!incident.videoEvidence) {
        setDeleted(true);
        return setFetching(false);
      }

      try {
        const { data } = await getVideoToken(currentUser.token);
        isOpen && setUrl(createVideoUrl(incident.videoEvidence, data));
        setFetching(false);
      } catch (error) {
        onError(error.message);
      }
    } catch (error) {
      onError(error.message);
    }
  };
  const tearDown = () => setUrl("");

  const toggleAlert = () => setShowAlert(!showAlert);

  const deleteVideo = async () => {
    toggleAlert();
    setDeleting(true);
    try {
      await deleteIncidentVideo(incident._id, currentUser.token);
      setDeleting(false);
      setDeleted(true);
      onInfo("Video file deleted successfully.");
    } catch (error) {
      setDeleting(false);
      onError(error.message);
    }
  };

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
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass="exit-app-alert"
        header={"Are you sure?"}
        message="You are about to delete the video file attached to this incident. Proceed?"
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            handler: () => true
          },
          {
            cssClass: 'danger',
            text: 'Yes',
            handler: deleteVideo,
          }
        ]}
      />

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
              !isFetching ? (
                !isDeleted ? (
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
                    <ModalPanel>
                      <IonText color="danger">
                        File deleted
                    </IonText>
                    </ModalPanel>
                  )
              ) : (
                  <LoaderFallback />
                )
            ) : (
                <ModalPanel>
                  SMS Alert
                </ModalPanel>
              )}
          </div>
          <div className="ion-padding-horizontal">
            {!isVideo && (
              <IncidentContact incident={incident} />
            )}
            <small>Date: {moment(createdAt).format("MMM Do YY")}</small>
            {(isVideo && !isDeleted) && (
              <>
                <ShareButton incidentId={incident._id} disabled={isDeleting} />
                <Centered>
                  <IonButton
                    onClick={toggleAlert}
                    disabled={isDeleting}
                    color="danger"
                  >
                    {isDeleting ? "Deleting..." : "Delete"} <IonIcon slot="end" icon={trash} />
                  </IonButton>
                </Centered>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default IncidentModal;