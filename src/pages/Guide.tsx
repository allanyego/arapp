import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText, IonList, IonItem, IonLabel, IonSpinner } from "@ionic/react";
import { useParams } from "react-router";
import moment from "moment";

import { getById } from "../http/guides";

export default function Guide() {
  const { guideId } = useParams();
  const [guide, setGuide] = useState<any>(null);

  const getGuideDetails = async () => {
    const { data } = await getById(guideId);
    setGuide(data);
  };

  useEffect(() => {
    getGuideDetails().catch(console.error);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Guide Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding-horizontal">
          {!guide ? (
            <div className="d-flex ion-justify-content-center ion-align-items-center">
              <IonSpinner name="crescent" />
            </div>
          ) : (
              <IonText>
                <h2>{guide!.title}</h2>
                <small>{moment(guide!.createdAt).format("LT")}</small>
                <div>{guide!.body}</div>
              </IonText>
            )}
        </div>
      </IonContent>
    </IonPage>
  );
}