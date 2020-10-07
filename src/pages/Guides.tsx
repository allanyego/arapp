import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonCardTitle, IonCardContent, IonCard, IonCardHeader, IonFab, IonFabButton, IonIcon, IonCardSubtitle } from "@ionic/react";
import { useRouteMatch, useHistory } from "react-router";
import moment from "moment";

import { add } from "ionicons/icons";
import { useAppContext } from "../lib/context-lib";
import { getGuides } from "../http/guides";
import { USER } from "../http/constants";
import UserHeader from "../components/UserHeader";
import useToastManager from "../lib/toast-hook";

export default function Guides() {
  const history = useHistory();
  const [guides, setGuides] = useState([])
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

  useEffect(() => {
    getLatestGuides().catch(error => onError(error.message));
  }, []);

  const toNewGuideForm = () => history.push("/app/guides/new");

  return (
    <IonPage>
      <UserHeader title="Guides and tips" />
      <IonContent fullscreen>

        {currentUser.accountType === USER.ACCOUNT_TYPES.COUNSELLOR &&
          <IonFab vertical="center" horizontal="end" slot="fixed">
            <IonFabButton onClick={toNewGuideForm}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        }

        {guides.map((guide: any) => <GuideCard key={guide._id} guide={guide} />)}
      </IonContent>
    </IonPage>
  );
}

function GuideCard({ guide }: any) {
  const { url } = useRouteMatch();

  return (
    <IonCard routerLink={`${url}/${guide._id}`}>
      <IonCardHeader>
        <IonCardTitle>{guide.title}</IonCardTitle>
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