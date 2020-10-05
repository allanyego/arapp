import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonCardTitle, IonCardContent, IonCard, IonCardHeader, IonAvatar, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { useRouteMatch, useHistory } from "react-router";

import defaultAvatar from "../assets/img/default_avatar.jpg";
import { add } from "ionicons/icons";
import { useAppContext } from "../lib/context-lib";
import { getConditions } from "../http/conditions";

const _conditions = [
  {
    _id: "34u556996",
    name: "depression (TEST)",
    description: "this is some short description/background of the condition: depression. how it comes to be.",
    symptomps: `isolation
regression
anger
demotivation
difficulty concentrating`,
    possibleRemedies: `clinical therapy
meditation
high grade`,
  }
];

export default function InfoCenter() {
  const history = useHistory();
  const [conditions, setConditions] = useState(_conditions)
  const { currentUser } = useAppContext() as any;

  useEffect(() => {
    getConditions().then(({ data }: any) => {
      setConditions(data);
    }).catch(console.error);
  }, []);

  const toProfile = () => history.push('/app/profile');
  const toNewConditionForm = () => history.push("/app/conditions/new");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonAvatar slot="start" className="ion-padding" onClick={toProfile}>
            <img src={defaultAvatar} alt="mike scott" />
          </IonAvatar>
          <IonTitle>Info Center</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        {currentUser.accountType !== "patient" &&
          <IonFab vertical="center" horizontal="end" slot="fixed">
            <IonFabButton onClick={toNewConditionForm}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        }

        {conditions.map(condition => <ConditionCard key={condition._id} condition={condition} />)}
      </IonContent>
    </IonPage>
  );
}

type ConditionCardProps = {
  condition: {
    _id: string,
    name: string,
    description: string,
  }
};

function ConditionCard({ condition }: ConditionCardProps) {
  const { url } = useRouteMatch();

  return (
    <IonCard routerLink={`${url}/${condition._id}`}>
      <IonCardHeader>
        <IonCardTitle>{condition.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {condition.description.slice(0, 150) + "..."}
      </IonCardContent>
    </IonCard>
  );
}