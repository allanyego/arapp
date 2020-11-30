import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";

import AlertItem from "../components/AlertItem";
import UserHeader from "../components/UserHeader";
import { USER } from "../http/constants";
import { useAppContext } from "../lib/context-lib";

const Alerts: React.FC = () => {
  const history = useHistory();
  const { alerts, currentUser } = useAppContext() as any;

  useIonViewDidEnter(() => {
    if (currentUser.accountType !== USER.ACCOUNT_TYPES.LAW_ENFORCER) {
      history.replace("/app");
      return;
    }
  });

  return (
    <IonPage>
      <UserHeader title="Recent alerts" />

      <IonContent fullscreen>
        <IonList lines="full">
          {alerts.map((alert: any) => (
            <AlertItem
              alert={alert}
              key={alert._id}
            />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Alerts;