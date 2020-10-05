import React from "react";
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText, IonList, IonItem, IonLabel } from "@ionic/react";

export default function ConditionDetails() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Condition Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding-horizontal">
          <IonText>
            <h2>depression</h2>
            <p>Lorem ipsum dolor, sit amet consectet dignissimos saepe. Tempora ratione ex pariatur amet</p>

            <h6 className="section-title">Symptoms</h6>
            <IonList>
              <IonItem>
                <IonLabel>Some symptom</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Some other symptom</IonLabel>
              </IonItem>
            </IonList>

            <h6 className="section-title">Possible remedies</h6>
            <IonList>
              <IonItem>
                <IonLabel>Some remedy</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Some other remedy</IonLabel>
              </IonItem>
            </IonList>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
}