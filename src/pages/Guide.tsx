import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText, IonList, IonItem, IonLabel, IonSpinner, IonChip } from "@ionic/react";
import { useParams } from "react-router";
import moment from "moment";

import { getById } from "../http/guides";
import useToastManager from "../lib/toast-hook";

export default function Guide() {
  const { guideId } = useParams();
  const [guide, setGuide] = useState<any>(null);
  const { onError } = useToastManager();

  const getGuideDetails = async () => {
    try {
      const { data } = await getById(guideId);
      setGuide(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useEffect(() => {
    getGuideDetails().catch(error => onError(error.message));
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
            <div className="h100 d-flex ion-justify-content-center ion-align-items-center">
              <IonSpinner name="crescent" />
            </div>
          ) : (
              <IonText>
                <h2>{guide!.title}</h2>
                <small>Posted {moment(guide!.createdAt).format("LT")}</small>
                <div className="ion-margin-vertical">{guide!.body}</div>
                {guide!.tags.map((tag: any, index: number) =>
                  <IonChip key={index} color="tertiary">{tag}</IonChip>
                )}
              </IonText>
            )}
        </div>
      </IonContent>
    </IonPage>
  );
}