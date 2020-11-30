import React, { useState } from "react";
import { IonPage, IonContent, IonCardTitle, IonCardContent, IonCard, IonCardHeader, IonFab, IonFabButton, IonIcon, IonCardSubtitle, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { useRouteMatch } from "react-router";
import moment from "moment";

import { add } from "ionicons/icons";
import { useAppContext } from "../lib/context-lib";
import { getGuides } from "../http/guides";
import UserHeader from "../components/UserHeader";
import useToastManager from "../lib/toast-manager";
import LoaderFallback from "../components/LoaderFallback";
import ucFirst from "../lib/uc-first";
import useMounted from "../lib/mount-lib";
import { USER } from "../http/constants";

export default function Guides() {
  let [guides, setGuides] = useState<any[] | null>(null);
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();
  const { currentUser } = useAppContext() as any;

  const getLatestGuides = async () => {
    try {
      const { data } = await getGuides(currentUser.token);
      isMounted && setGuides(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useIonViewDidEnter(() => {
    getLatestGuides();
  });

  useIonViewWillLeave(() => setMounted(false));

  const { active, accountType } = currentUser;

  return (
    <IonPage>
      <UserHeader title="Guides and tips" />
      <IonContent fullscreen>

        {active && accountType !== USER.ACCOUNT_TYPES.LAW_ENFORCER && (
          <IonFab
            vertical="center"
            horizontal="end"
            slot="fixed"
          >
            <IonFabButton size="small" color="dark" routerLink="/app/guides/new">
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

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
      <IonCardHeader
        className="ion-no-padding ion-padding-horizontal ion-padding-top"
      >
        <IonCardTitle>
          <h6 className="ion-no-margin">
            {ucFirst(guide.title)}
          </h6>
        </IonCardTitle>
        <IonCardSubtitle className="ion-no-margin">
          <small>
            <strong>{moment(guide.createdAt).fromNow()}</strong>
          </small>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {guide.body.slice(0, 150) + "..."}
      </IonCardContent>
    </IonCard>
  );
}