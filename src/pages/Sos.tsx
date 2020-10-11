import { IonButton, IonContent, IonPage, IonRow, IonCol, IonText, IonRouterLink } from '@ionic/react';
import React, { useState } from 'react';
import UserHeader from '../components/UserHeader';
import { useAppContext } from '../lib/context-lib';
import { Plugins } from "@capacitor/core"

import { postIncident } from "../http/incidents";
import useToastManager from '../lib/toast-hook';

const { Geolocation } = Plugins;

const Sos: React.FC = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { currentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();

  const onSendSos = async () => {
    setSubmitting(true);
    try {
      const { coords } = await Geolocation.getCurrentPosition();
      await postIncident({
        location: {
          ...coords,
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

  return (
    <IonPage>
      <UserHeader title="Alert" />
      <IonContent fullscreen>
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
