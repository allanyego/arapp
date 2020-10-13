import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonCardTitle, IonCardContent, IonCard, IonCardHeader, IonFab, IonFabButton, IonIcon, IonCardSubtitle, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { useRouteMatch, useHistory } from "react-router";
import moment from "moment";

import { add } from "ionicons/icons";
import { useAppContext } from "../lib/context-lib";
import { getGuides } from "../http/guides";
import { USER } from "../http/constants";
import UserHeader from "../components/UserHeader";
import useToastManager from "../lib/toast-hook";
import LoaderFallback from "../components/LoaderFallback";
import ucFirst from "../lib/uc-first";

export default function Guides() {
  const history = useHistory();
  let [guides, setGuides] = useState<any[] | null>(null);
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const getLatestGuides = async () => {
    try {
      const { data } = await getGuides();
      setGuides(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useIonViewDidEnter(() => {
    getLatestGuides().catch(error => onError(error.message));
  });

  useEffect(() => () => {
    setGuides = () => null;
  }, []);

  const toNewGuideForm = () => history.push("/app/guides/new");

  return (
    <IonPage>
      <UserHeader title="Guides and tips" />
      <IonContent fullscreen>

        {currentUser.accountType === USER.ACCOUNT_TYPES.COUNSELLOR &&
          <IonFab vertical="center" horizontal="end" slot="fixed">
            <IonFabButton onClick={toNewGuideForm} color="dark">
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        }

        {!guides ? (
          <LoaderFallback />
        ) : (
            guides.map((guide: any) => <GuideCard key={guide._id} guide={guide} />)
          )}
      </IonContent>
    </IonPage>
  );
}

function GuideCard({ guide }: any) {
  const { url } = useRouteMatch();

  return (
    <IonCard routerLink={`${url}/${guide._id}`}>
      <IonCardHeader>
        <IonCardTitle>{ucFirst(guide.title)}</IonCardTitle>
        <IonCardSubtitle>
          <small>{moment(guide.createdAt).format("LT")}</small>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {guide.body.slice(0, 150) + "..."}
      </IonCardContent>
    </IonCard>
  );
}