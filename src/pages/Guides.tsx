import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonCardTitle, IonCardContent, IonCard, IonCardHeader, IonAvatar, IonFab, IonFabButton, IonIcon, IonButton } from "@ionic/react";
import { useRouteMatch, useHistory } from "react-router";

import defaultAvatar from "../assets/img/default_avatar.jpg";
import { add, ellipsisVertical } from "ionicons/icons";
import { useAppContext } from "../lib/context-lib";
import { getGuides } from "../http/guides";
import { USER } from "../http/constants";
import UserHeader from "../components/UserHeader";

export default function Guides() {
  const history = useHistory();
  const [guides, setGuides] = useState([])
  const { currentUser } = useAppContext() as any;

  const getLatestGuides = async () => {
    const { data } = await getGuides();
    setGuides(data);
  };

  useEffect(() => {
    getLatestGuides().catch(console.error);
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
      </IonCardHeader>
      <IonCardContent>
        {guide.body.slice(0, 150) + "..."}
      </IonCardContent>
    </IonCard>
  );
}