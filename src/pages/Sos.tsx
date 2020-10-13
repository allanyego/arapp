import { IonButton, IonContent, IonPage, IonRow, IonCol, IonText, IonRouterLink, useIonViewWillLeave, IonIcon, IonSpinner } from '@ionic/react';
import React, { useState, useRef } from 'react';
import UserHeader from '../components/UserHeader';
import { useAppContext } from '../lib/context-lib';
import { Plugins } from "@capacitor/core"

import { postIncident } from "../http/incidents";
import useToastManager from '../lib/toast-hook';
import "./Sos.css";
import { ellipse } from 'ionicons/icons';

const { Geolocation } = Plugins;

const hasImageCapture = () => "ImageCapture" in window;

const Sos: React.FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // const [imageCapture, setImageCapture] = useState(null);
  const [isRecording, setRecording] = useState(false);
  const videoElement = useRef<HTMLVideoElement>(null);
  const { currentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();

  const stopStream = () => {
    stream && stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setRecording(false);
  }

  // const initPhotoCapabilities = async (imageCapture: any) => {
  //   await imageCapture.getPhotoCapabilities();
  // };

  const initStream = async (strm: MediaStream) => {
    setStream(strm);
    videoElement.current!.srcObject = strm;

    // if (hasImageCapture()) {
    //   const _imgCapture = new (window as any).ImageCapture(stream.getVideoTracks()[0]);
    //   setImageCapture(_imgCapture);
    //   await initPhotoCapabilities(_imgCapture);
    // } else {
    //   onError("No image capture.");
    // }
  };

  const initCamera = async (constraints = {
    video: {
      facingMode: "environment"
    },
    audio: true
  }) => {
    try {
      const _stream = await window.navigator.mediaDevices.getUserMedia({
        ...constraints
      });
      setRecording(true);

      initStream(_stream);
    } catch (error) {
      onError(error.message);
    }
  };

  const onSendSos = async () => {
    setSubmitting(true);
    try {
      const { coords } = await Geolocation.getCurrentPosition();
      initCamera().catch(error => onError(error.message));
      await postIncident({
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        user: currentUser._id,
        contact: currentUser.emergencyContact,
      }, currentUser.token);
      setSubmitting(false);
      onSuccess("Hold on. Help is on the way.");
    } catch (error) {
      setSubmitting(false);
      onError(error.message);
    }
  };

  useIonViewWillLeave(stopStream);

  return (
    <IonPage>
      <UserHeader title="Alert" />
      <IonContent fullscreen style={{
        position: "relative"
      }}>
        {hasImageCapture() && isRecording && (
          <video
            className="video-stream"
            ref={videoElement}
            // onLoadedMetaData={this.handleVideoMetadata}
            autoPlay
            playsInline />
        )}
        <IonRow className="h100 ion-text-center">
          <IonCol className="ion-align-self-center">
            {!currentUser.emergencyContact ? (
              <IonText>
                <p>To send emergency alerts, you need to pick an emergency contact.{' '}
                  Head on to your <IonRouterLink routerLink="/app/profile">
                    profile
                  </IonRouterLink> and select one.</p>
              </IonText>
            ) : (
                <>
                  <IonText>
                    <p>
                      {isRecording ? "Stop recording" : "Tap here to send out SOS message"}
                    </p>
                  </IonText>
                  {isRecording ? (
                    <IonButton
                      key="stop-recording-btn"
                      fill="outline"
                      color="dark"
                      size="large"
                      expand="block"
                      onClick={stopStream}
                    >
                      Stop recording
                      <IonIcon icon={ellipse} slot="end" />
                    </IonButton>
                  ) : (
                      <IonButton color="danger" size="large" expand="block"
                        onClick={onSendSos}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending" : "Send SOS"}
                      </IonButton>
                    )}
                </>
              )}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage >
  );
};

export default Sos;
