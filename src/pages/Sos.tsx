import { IonButton, IonContent, IonPage, IonRow, IonCol, IonText, IonRouterLink, useIonViewWillLeave, IonIcon, IonSpinner } from '@ionic/react';
import React, { useState, useRef } from 'react';
import UserHeader from '../components/UserHeader';
import { useAppContext } from '../lib/context-lib';
import { Plugins } from "@capacitor/core"

import { postIncident } from "../http/incidents";
import useToastManager from '../lib/toast-manager';
import "./Sos.css";
import { filmOutline, stop } from 'ionicons/icons';
import useMounted from '../lib/mount-lib';
import Centered from '../components/Centered';

const { Geolocation } = Plugins;

const hasImageCapture = () => "ImageCapture" in window;

const Sos: React.FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [sentAlert, setSentAlert] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // const [imageCapture, setImageCapture] = useState(null);
  const [incidentId, setIncidentId] = useState(null);
  const [isRecording, setRecording] = useState(false);
  const videoElement = useRef<HTMLVideoElement>(null);
  const { currentUser, socket } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();
  const { isMounted, setMounted } = useMounted()
  let mediaRecorder: any;

  const reset = () => {
    setSentAlert(false);
    setIncidentId(null);
    setRecording(false);
    setStream(null);
  };

  const stopStream = () => {
    // Stop stream, recording and sent merge cue to server
    mediaRecorder && mediaRecorder.stop();
    socket.emit("merge-video", incidentId);
    stream && stream.getTracks().forEach(track => track.stop());
    isMounted && reset();
  }

  // const initPhotoCapabilities = async (imageCapture: any) => {
  //   await imageCapture.getPhotoCapabilities();
  // };

  const initStream = async (strm: MediaStream) => {
    isMounted && setStream(strm);
    videoElement.current!.srcObject = strm;

    // if (hasImageCapture()) {
    //   const _imgCapture = new (window as any).ImageCapture(stream.getVideoTracks()[0]);
    //   setImageCapture(_imgCapture);
    //   await initPhotoCapabilities(_imgCapture);
    // } else {
    //   onError("No image capture.");
    // }

    // Start recording and send to server
    const recorderOptions = {
      mimeType: 'video/webm',
      bitsPerSecond: 200000 // 0.2 Mbit/sec.
    };

    try {
      mediaRecorder = new (window as any).MediaRecorder(strm, recorderOptions);
      mediaRecorder.start(1000); // 1000 - the number of milliseconds to record into each Blob
      mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          socket.emit("video-evidence", {
            incidentId,
            chunk: event.data,
          });
        }
      };
    } catch (error) {
      onError(error.message);
    }
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

      isMounted && setRecording(true);
      initStream(_stream);
    } catch (error) {
      onError(error.message);
    }
  };

  const onSendSos = async () => {
    setSubmitting(true);
    try {
      let coords;
      try {
        coords = (await Geolocation.getCurrentPosition()).coords;
      } catch (error) {
        throw new Error("Could not get location. Make sure GPS is on ON");
      }

      const { data } = await postIncident({
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        user: currentUser._id,
        contact: currentUser.emergencyContact,
      }, currentUser.token);

      setSentAlert(true);
      setIncidentId(data._id);
      setSubmitting(false);
      onSuccess("Help is on the way. Consider taking a video.");
    } catch (error) {
      setSubmitting(false);
      onError(error.message);
    }
  };

  const startRecording = () => {
    // Record video after user has sent sos
    initCamera();
  };

  useIonViewWillLeave(() => {
    stopStream();
    setMounted(false);
  });

  return (
    <IonPage>
      <UserHeader title="Send out alert" />
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
                  {!isRecording && (
                    <>
                      <IonText>
                        <p>
                          Tap <strong>SEND SOS</strong> to send out an alert message to{" "}
                          <strong className="ion-text-capitalize">{currentUser.emergencyContact.displayName}</strong>
                        </p>
                      </IonText>

                      <Centered>
                        <IonButton
                          color="danger"
                          size={sentAlert ? "small" : "large"}
                          className="sos-button"
                          onClick={onSendSos}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Hold on" : "Send SOS"}
                        </IonButton>
                      </Centered>
                    </>
                  )}

                  <IonText>
                    <p>
                      {!sentAlert ?
                        "Send an alert and then record a video" :
                        (
                          <>
                            Tap <strong>BUTTON</strong> below{" "}
                            to start video recording. The video is uploaded in real time and you can{" "}
                            view it later.
                            </>
                        )
                      }
                    </p>
                  </IonText>
                  <Centered>
                    <IonButton
                      disabled={!sentAlert}
                      size={sentAlert ? "large" : "small"}
                      key="video-btn-ctrl"
                      fill="solid"
                      className="sos-button"
                      color={isRecording ? "danger" : "dark"}
                      onClick={isRecording ? stopStream : startRecording}
                    >
                      {/* {isRecording ? "Stop" : "Take video"} */}
                      <IonIcon icon={isRecording ? stop : filmOutline} slot="icon-only" />
                    </IonButton>
                  </Centered>
                  {isRecording && (
                    <p><strong>Stop recording</strong></p>
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
