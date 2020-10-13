import React from "react";
import { useRouteMatch, Route, Redirect } from "react-router";
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from "@ionic/react";
import { informationCircle, megaphone, chatbox } from "ionicons/icons";
import Guides from "./Guides";
import Chat from "./Chat";
import Listing from "./Listing";
import Thread from "./Thread";
import Guide from "./Guide";
import NewGuide from "./NewGuide";
import { useAppContext } from "../lib/context-lib";
import ContactPickModal from "../components/ContactPickModal";
import Sos from "./Sos";
import ProfilePage from "./ProfilePage";

const Main: React.FC = () => {
  const { url, path } = useRouteMatch();
  const { currentUser } = useAppContext() as any;

  return (
    <>
      <ContactPickModal show={!currentUser.emergencyContact} />
      <IonTabs>
        <IonRouterOutlet>
          <Route path={`${path}/profile`} component={ProfilePage} />
          <Route path={`${path}/chat`} component={Chat} exact={true} />
          <Route path={`${path}/professionals`} component={Listing} exact />
          <Route path={`${path}/chat/:threadId`} component={Thread} exact />
          <Route path={`${path}/guides`} component={Guides} exact />
          <Route path={`${path}/guides/:guideId`} component={Guide} exact />
          <Route path={`${path}/guides/new`} component={NewGuide} exact />
          <Route path={`${path}/sos`} component={Sos} exact />
          <Route path={path} exact={true} render={() => <Redirect to={`${path}/guides`} />} />
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
    </>
  );
};

export default Main;