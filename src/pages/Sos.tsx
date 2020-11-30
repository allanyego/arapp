import { IonButton, IonContent, IonPage, IonRow, IonCol, IonText, useIonViewWillLeave, IonIcon, IonFab, IonFabButton, useIonViewDidEnter } from '@ionic/react';
import React, { useState, useRef } from 'react';
import { Plugins } from "@capacitor/core"
import { v4 as uuidv4 } from "uuid";
import { CallNumber } from "@ionic-native/call-number";


import { useAppContext } from '../lib/context-lib';
import UserHeader from '../components/UserHeader';
import LoaderFallback from "../components/LoaderFallback";
import { postIncident } from "../http/incidents";
import useToastManager from '../lib/toast-manager';
import "./Sos.css";
import { call, filmOutline, stop } from 'ionicons/icons';
import useMounted from '../lib/mount-lib';
import Centered from '../components/Centered';
import { Link, useHistory } from 'react-router-dom';
import { USER } from '../http/constants';

const { Geolocation } = Plugins;

const hasImageCapture = () => "ImageCapture" in window;

const CallFab: React.FC = () => {
  const { onError } = useToastManager();

  const onCall = async () => {
    try {
      await CallNumber.callNumber("999", true);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <IonFab
      horizontal="start"
      slot="fixed"
    >
      <IonFabButton color="danger" onClick={onCall}>
        <IonIcon icon={call} />
      </IonFabButton>
    </IonFab>
  );
};

const Sos: React.FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // const [imageCapture, setImageCapture] = useState(null);
  // const [incidentId, setIncidentId] = useState<string | null>(null);
  const [isRecording, setRecording] = useState(false);
  const [isInitializing, setInitializing] = useState(false);
  const incidentId = useRef<string | null>(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const history = useHistory();
  const { currentUser, socket } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();
  const { isMounted, setMounted } = useMounted()
  let mediaRecorder: any;

  const reset = () => {
    setIncidentId(null);
    setRecording(false);
    setStream(null);
  };

  const setIncidentId = (id: string | null) => incidentId.current = id;
  const stopStream = () => {
    // Stop stream, recording and sent merge cue to server
    mediaRecorder && mediaRecorder.stop();
    socket.emit("merge-video", incidentId.current);
    stream && stream.getTracks().forEach(track => track.stop());
    isMounted && reset();
  }

  // const initPhotoCapabilities = async (imageCapture: any) => {
  //   await imageCapture.getPhotoCapabilities();
  // };

  const initStream = async (strm: MediaStream) => {
    isMounted && setStream(strm);
    if (videoElement.current) {
      videoElement.current.srcObject = strm;
    }

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
        const { current } = incidentId;
        if (current && event.data && event.data.size > 0) {
          socket.emit("video-evidence", {
            incidentId: current,
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
    setInitializing(true);
    try {
      const _stream = await window.navigator.mediaDevices.getUserMedia({
        ...constraints
      });

      if (isMounted) {
        setIncidentId(uuidv4());
        setInitializing(false);
        setRecording(true);
      }
      initStream(_stream);
    } catch (error) {
      if (isMounted) {
        setIncidentId(null);
        setInitializing(false);
      }
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
        throw new Error("Could not get location. Make sure GPS is on ON.");
      }

      const { data } = await postIncident({
        location: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        user: currentUser._id,
        contact: currentUser.emergencyContact,
      }, currentUser.token);
      const { fullName, phone } = currentUser;
      socket.emit("alert", {
        alert: {
          _id: data._id,
          user: {
            fullName,
            phone,
          },
          location: data.location,
        }
      });

      setSubmitting(false);
      onSuccess("Help is on the way. Consider taking a video.");
    } catch (error) {
      setSubmitting(false);
      onError(error.message);
    }
  };

  const startRecording = () => {
    initCamera();
  };

  useIonViewDidEnter(() => {
    if (currentUser.accountType === USER.ACCOUNT_TYPES.LAW_ENFORCER) {
      return history.replace("/app");
    }
  });

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
        <CallFab />

        <div className={"video-stream" + (isRecording ? " recording" : "")}>
          {hasImageCapture() && (
            <video
              style={{
                visibility: isRecording ? "visible" : "hidden"
              }}
              ref={videoElement}
              autoPlay
              playsInline />
          )}
          {isInitializing && (
            <div className="stream-loader">
              <LoaderFallback color="light" fullHeight />
            </div>
          )}
        </div>
        <IonRow className="h100 ion-text-center">
          <IonCol className="ion-align-self-center">
            {!currentUser.emergencyContact ? (
              <IonText>
                <p>To send emergency alerts, you need to pick an {" "}
                  <strong>emergency contact</strong>.{' '}
                  Head on to your <Link to={{
                    pathname: "/app/profile",
                    state: {
                      setContact: true,
                    }
                  }}>
                    profile
                  </Link> and select one.</p>
              </IonText>
            ) : (
                <>
                  <>
                    {isSubmitting ? (
                      <LoaderFallback name="lines-small">
                        <p className="ion-no-margin text-center">
                          Sending
                            </p>
                      </LoaderFallback>
                    ) : (
                        <IonText>
                          <p style={{
                            margin: "3em 0 .25em"
                          }}>
                            <small>
                              Tap <strong>SEND SOS below</strong> to send out an alert message to{" "}
                              <strong className="ion-text-capitalize">{currentUser.emergencyContact.displayName}</strong>
                            </small>
                          </p>
                        </IonText>
                      )}

                    <Centered>
                      <IonButton
                        color="danger"
                        size={isRecording ? "small" : "large"}
                        className="sos-button"
                        onClick={onSendSos}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Hold on" : "Send SOS"}
                      </IonButton>
                    </Centered>
                  </>
                </>
              )}

            <IonText>
              <p className="ion-text-center">
                <strong>OR</strong>
              </p>
            </IonText>

            {!isRecording && (
              isInitializing ? (
                <LoaderFallback name="lines-small">
                  <p className="ion-no-margin text-center">
                    Initializing
                  </p>
                </LoaderFallback>
              ) : (
                  <IonText>
                    <p>
                      <small>
                        Tap <strong>BUTTON</strong> below{" "}
                        to start video recording. The video is uploaded in real time and you can{" "}
                        view it later.
                      </small>
                    </p>
                  </IonText>
                )
            )}
            <Centered>
              <IonButton
                disabled={isInitializing}
                size="large"
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
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage >
  );
};

export default Sos;
