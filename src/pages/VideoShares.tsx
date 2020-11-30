import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonList, IonModal, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import React, { useState } from "react";
import moment from "moment";
import { useHistory } from "react-router";

import LoaderFallback from "../components/LoaderFallback";
import useToastManager from "../lib/toast-manager";
import createVideoUrl from "../lib/create-video-url";
import VideoShareItem from "../components/VideoShareItem";
import { getVideoShares } from "../http/incidents";
import { useAppContext } from "../lib/context-lib";
import useMounted from "../lib/mount-lib";
import { USER } from "../http/constants";
import UserHeader from "../components/UserHeader";

const VideoModal: React.FC<{
  isOpen: boolean
  file: any
  onClose: () => any
}> = ({
  isOpen,
  file,
  onClose,
}) => {
    const [url, setUrl] = useState<string | null>(null);
    const { onError } = useToastManager();

    const setUp = async () => {
      try {
        isOpen && setUrl(createVideoUrl(incident.videoEvidence, file.token));
      } catch (error) {
        onError(error.message);
      }
    };
    const tearDown = () => setUrl(null);

    if (!file) {
      return null;
    }

    const { incident } = file;

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
          <IonTitle size="small" color="primary">Incident #{incident._id}</IonTitle>
        </IonToolbar>
        <IonContent fullscreen>
          <div className="h100">
            <div>
              {url ? (
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
                )}
            </div>
            <div className="ion-padding-horizontal">
              <p className="ion-no-margin ion-text-capitalize">
                {file.user.fullName}
              </p>
              <small>Date: {moment(incident.createdAt).format("MMM Do YY")}</small>
            </div>
          </div>
        </IonContent>
      </IonModal>
    );
  };

const VideoShares: React.FC = () => {
  const [videoFiles, setVideoFiles] = useState<any[] | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const history = useHistory();
  const { onError } = useToastManager();
  const { currentUser } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();

  const closeModal = () => setSelected(null);
  const fetchVideoFiles = async () => {
    try {
      const { data } = await getVideoShares(currentUser._id, currentUser.token);
      isMounted && setVideoFiles(data);
    } catch (error) {
      onError(error.message);
    }
  };
  const onTap = (file: any) => setSelected(file);

  useIonViewDidEnter(() => {
    if (currentUser.accountType !== USER.ACCOUNT_TYPES.LAW_ENFORCER) {
      history.replace("/app");
      return;
    }
    setMounted(true);
    fetchVideoFiles();
  });

  useIonViewWillLeave(() => setMounted(false));

  return (
    <IonPage>
      <UserHeader title="Video shares" />

      <IonContent fullscreen>
        <VideoModal file={selected} isOpen={!!selected} onClose={closeModal} />

        {!videoFiles ? (
          <LoaderFallback fullHeight />
        ) : (
            <IonList lines="full">
              {videoFiles.map((file: any) => (
                <VideoShareItem
                  key={file._id}
                  {...{ file, onTap }}
                />
              ))}
            </IonList>
          )}
      </IonContent>
    </IonPage>
  );
};

export default VideoShares;