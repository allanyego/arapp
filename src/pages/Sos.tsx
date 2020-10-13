import { IonButton, IonContent, IonPage, IonRow, IonCol, IonText, IonRouterLink } from '@ionic/react';
import React, { useState, useRef, useEffect } from 'react';
import UserHeader from '../components/UserHeader';
import { useAppContext } from '../lib/context-lib';
import { Plugins } from "@capacitor/core"

import { postIncident } from "../http/incidents";
import useToastManager from '../lib/toast-hook';
import "./Sos.css";

const { Geolocation } = Plugins;

const hasImageCapture = () => "ImageCapture" in window;

const Sos: React.FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [stream, setStream] = useState(null);
  const [imageCapture, setImageCapture] = useState(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const { currentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();

  const initPhotoCapabilities = async (imageCapture: any) => {
    const c = await imageCapture.getPhotoCapabilities();
  };

  const initStream = async (stream: any) => {
    setStream(stream);
    videoElement.current!.srcObject = stream;

    if (hasImageCapture()) {
      const _imgCapture = new (window as any).ImageCapture(stream.getVideoTracks()[0]);
      setImageCapture(_imgCapture);
      await initPhotoCapabilities(_imgCapture);
    } else {
      onError("No image capture.");
    }
  };

  const initCamera = async (constraints = {
    facingMode: "environment"
  }) => {
    try {
      const _stream = await window.navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
        ...constraints
      });

      initStream(_stream);
    } catch (error) {
      onError(error.message);
    }
  };

  const onSendSos = async () => {
    setSubmitting(true);
    try {
      const { coords } = await Geolocation.getCurrentPosition();
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

  useEffect(() => {
    initCamera().catch(error => onError(error.message));
  }, []);

  return (
    <IonPage>
      <UserHeader title="Alert" />
      <IonContent fullscreen style={{
        position: "relative"
      }}>
        {hasImageCapture() && (
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
                    <p>Tap here to send out SOS message</p>
                  </IonText>
                  <IonButton color="danger" size="large" expand="block"
                    onClick={onSendSos}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending" : "Send SOS"}
                  </IonButton>
                </>
              )}
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Sos;
