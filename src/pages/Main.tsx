import React from "react";
import { useRouteMatch, Route, Redirect } from "react-router";
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonRouterOutlet } from "@ionic/react";
import { informationCircle, megaphone, chatbox } from "ionicons/icons";
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
        <Route path={`${path}/guides/:guideId`} component={Guide} exact />
        <Route path={`${path}/guides/new`} component={NewGuide} exact />
        <Route path={`${path}/profile/:userId?`} component={Profile} />
        <Route path={`${path}/sos`} component={Guides} exact />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="info" href={`${url}/guides`}>
          <IonIcon icon={informationCircle} />
          <IonLabel>Guides</IonLabel>
          {/* <IonBadge>6</IonBadge> */}
        </IonTabButton>

        <IonTabButton tab="sos" href={`${url}/sos`}>
          <IonIcon icon={megaphone} />
          <IonLabel>Send SOS</IonLabel>
        </IonTabButton>

        <IonTabButton tab="chat" href={`${url}/chat`}>
          <IonIcon icon={chatbox} />
          <IonLabel>Chat</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Main;