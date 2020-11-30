import { IonButton, IonContent, IonPage, IonRow, IonCol, IonText } from '@ionic/react';
import React from 'react';

import Centered from '../components/Centered';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRow className="h100 ion-text-center">
          <IonCol className="ion-align-self-center">
            <Centered>
              <img src="/assets/icon/icon-512x512.png" alt="Brand" className="home-brand" />
            </Centered>
            <IonText>
              <h1 style={{
                margin: "15px 0 0"
              }}>
                <strong>
                  AR App
                </strong>
              </h1>
              <p className="ion-no-margin ion-margin-bottom">Welcome</p>
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
