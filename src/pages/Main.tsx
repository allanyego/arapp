import React from "react";
import { useRouteMatch, Route, Redirect } from "react-router";
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonRouterOutlet } from "@ionic/react";
import { informationCircle, personCircle, chatbubbles } from "ionicons/icons";
import Guides from "./Guides";
import Chat from "./Chat";
import Listing from "./Listing";
import Thread from "./Thread";
import Guide from "./Guide";
import Profile from "./Profile";
import NewGuide from "./NewGuide";
import { useAppContext } from "../lib/context-lib";
import { USER } from "../http/constants";

const Main: React.FC = () => {
  const { url, path } = useRouteMatch();
  const { currentUser } = useAppContext() as any;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path={path} exact={true} render={() => <Redirect to={`${path}/guides`} />} />
        <Route path={`${path}/chat`} component={Chat} exact={true} />
        <Route path={`${path}/professionals`} render={
          () => currentUser.accountType === USER.ACCOUNT_TYPES.USER ?
            <Listing /> :
            <Redirect to={`${path}/guides`} />
        } exact={true} />
        <Route path={`${path}/chat/:threadId`} component={Thread} exact />
        <Route path={`${path}/guides`} component={Guides} exact />
        <Route path={`${path}/guides/:conditionId`} component={Guide} exact />
        <Route path={`${path}/guides/new`} component={NewGuide} exact />
        <Route path={`${path}/profile/:userId?`} component={Profile} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="info" href={`${url}/guides`}>
          <IonIcon icon={informationCircle} />
          <IonLabel>Guides</IonLabel>
          {/* <IonBadge>6</IonBadge> */}
        </IonTabButton>

        {currentUser.accountType === USER.ACCOUNT_TYPES.USER && (
          <IonTabButton tab="professionals" href={`${url}/professionals`}>
            <IonIcon icon={personCircle} />
            <IonLabel>Professionals</IonLabel>
          </IonTabButton>
        )}

        <IonTabButton tab="chat" href={`${url}/chat`}>
          <IonIcon icon={chatbubbles} />
          <IonLabel>Chat</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Main;