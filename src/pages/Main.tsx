import React from "react";
import { useRouteMatch, Route, Redirect } from "react-router";
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonRouterOutlet } from "@ionic/react";
import { informationCircle, personCircle, chatbubbles } from "ionicons/icons";
import InfoCenter from "./InfoCenter";
import Chat from "./Chat";
import Listing from "./Listing";
import Thread from "./Thread";
import ConditionDetails from "./ConditionDetails";
import Profile from "./Profile";
import BookAppointment from "./BookAppointment";

const Main: React.FC = () => {
  const { url, path } = useRouteMatch();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path={path} exact={true} render={() => <Redirect to={`${path}/info`} />} />
        <Route path={`${path}/info`} component={InfoCenter} exact={true} />
        <Route path={`${path}/book/:professionalId`} component={BookAppointment} exact />
        <Route path={`${path}/chat`} component={Chat} exact={true} />
        <Route path={`${path}/professionals`} component={Listing} exact={true} />
        <Route path={`${path}/chat/:threadId`} component={Thread} exact />
        <Route path={`${path}/info/:conditionId`} component={ConditionDetails} exact />
        <Route path={`${path}/profile`} component={Profile} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="info" href={`${url}/info`}>
          <IonIcon icon={informationCircle} />
          <IonLabel>Info Center</IonLabel>
          <IonBadge>6</IonBadge>
        </IonTabButton>

        <IonTabButton tab="professionals" href={`${url}/professionals`}>
          <IonIcon icon={personCircle} />
          <IonLabel>Professionals</IonLabel>
        </IonTabButton>

        <IonTabButton tab="chat" href={`${url}/chat`}>
          <IonIcon icon={chatbubbles} />
          <IonLabel>Chat</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Main;