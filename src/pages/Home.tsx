import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonText } from '@ionic/react';
import React from 'react';

import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRow className="h100 ion-text-center">
          <IonCol className="ion-align-self-center">
            <IonText>
              <h1>Safe360</h1>
              <p>Welcome</p>
            </IonText>
            <IonButton color="dark" expand="block" href="/sign-in" >Sign in</IonButton>
            <IonText>
              OR
            </IonText>
            <IonButton color="dark" expand="block" href="/sign-up">Sign up</IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Home;
