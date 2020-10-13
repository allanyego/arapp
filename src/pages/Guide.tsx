import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText, IonChip, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { useParams } from "react-router";
import moment from "moment";

import { getById } from "../http/guides";
import useToastManager from "../lib/toast-hook";
import LoaderFallback from "../components/LoaderFallback";
import ucFirst from "../lib/uc-first";

export default function Guide() {
  const { guideId } = useParams();
  let [guide, setGuide] = useState<any>(null);
  const { onError } = useToastManager();

  const getGuideDetails = async () => {
    try {
      const { data } = await getById(guideId);
      setGuide(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useIonViewDidEnter(() => {
    getGuideDetails().catch(error => onError(error.message));
  });

  useEffect(() => () => {
    setGuide = () => null;
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
        {!guide ? (
          <LoaderFallback />
        ) : (
            <div className="ion-padding-horizontal">
              <IonText>
                <h2>{ucFirst(guide!.title)}</h2>
                <small>Posted {moment(guide!.createdAt).format("LT")}</small>
                <div className="ion-margin-vertical">{guide!.body}</div>
                {guide!.tags.map((tag: any, index: number) =>
                  <IonChip key={index} color="tertiary">{tag}</IonChip>
                )}
              </IonText>
            </div>
          )}
      </IonContent>
    </IonPage>
  );
}