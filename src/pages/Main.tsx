import React, { Suspense, useEffect } from "react";
import { useRouteMatch, Route, Redirect } from "react-router";
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from "@ionic/react";
import { informationCircle, megaphone, chatbox } from "ionicons/icons";
import io from "socket.io-client";

import { useAppContext } from "../lib/context-lib";
import ContactPickModal from "../components/ContactPickModal";
import SuspenseFallback from "../components/SuspenseFallback";
import useMounted from "../lib/mount-lib";
import { ROOT_URL } from "../http/constants";
import Incidents from "./Incidents";

const Guides = React.lazy(() => import("./routes/Guides"));
const Chat = React.lazy(() => import("./routes/Chat"));
const Profile = React.lazy(() => import("./routes/Profile"));
const Listing = React.lazy(() => import("./Listing"));
const Sos = React.lazy(() => import("./Sos"));

const Main: React.FC = () => {
  const { url, path } = useRouteMatch();
  const { currentUser, socket, setSocket } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();

  const handleSocketErr = (err: Error) => {
    console.log("Socket error", err);
  };

  useEffect(() => {
    const _socket = io(ROOT_URL, {
      query: {
        userId: currentUser._id,
      },
      forceNew: true,
    });

    _socket.on("error", handleSocketErr);
    _socket.on("connect_error", handleSocketErr);
    _socket.on("connect_timeout", handleSocketErr);

    isMounted && setSocket(_socket);

    return () => {
      socket && socket.close();
      setSocket(null);
      setMounted(false);
    }
  }, []);

  return (
    <>
      <ContactPickModal isOpen={!currentUser.emergencyContact} />
      <Suspense fallback={<SuspenseFallback />}>
        <IonTabs>
          <IonRouterOutlet>
            <Route path={path} render={() => <Redirect to={`${path}/guides`} />} exact />
            <Route path={`${path}/professionals`} component={Listing} exact />
            <Route path={`${path}/incidents`} component={Incidents} exact />
            <Route path={`${path}/sos`} component={Sos} exact />
            <Route path={`${path}/chat`} component={Chat} />
            <Route path={`${path}/guides`} component={Guides} />
            <Route path={`${path}/profile`} component={Profile} />
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
      </Suspense>
    </>
  );
};

export default Main;