import React, { Suspense, useEffect } from "react";
import { useRouteMatch, Route, Redirect } from "react-router";
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from "@ionic/react";
import { informationCircle, megaphone, chatbox } from "ionicons/icons";
import io from "socket.io-client";

import { useAppContext } from "../lib/context-lib";
// import ContactPickModal from "../components/ContactPickModal";
import SuspenseFallback from "../components/SuspenseFallback";
import useMounted from "../lib/mount-lib";
import { ROOT_URL, USER } from "../http/constants";
import useAlerts from "../lib/alerts";
import useToastManager from "../lib/toast-manager";

const Alerts = React.lazy(() => import("./Alerts"));
const Appointments = React.lazy(() => import("./routes/Appointments"));
const Chat = React.lazy(() => import("./routes/Chat"));
const Guides = React.lazy(() => import("./routes/Guides"));
const Incidents = React.lazy(() => import("./Incidents"));
const Listing = React.lazy(() => import("./Listing"));
const PoliceListing = React.lazy(() => import("./PoliceListing"));
const Profile = React.lazy(() => import("./routes/Profile"));
const Sos = React.lazy(() => import("./Sos"));
const VideoShares = React.lazy(() => import("./VideoShares"));

const Main: React.FC = () => {
  const { path } = useRouteMatch();
  const { currentUser, socket, setSocket } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();
  const { onRespond, onAlert } = useAlerts();
  const { onInfo } = useToastManager();
  const isLawEnforcer = currentUser.accountType === USER.ACCOUNT_TYPES.LAW_ENFORCER;

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

    if (isLawEnforcer) {
      _socket.on("alert", ({ alert }: any) => {
        onInfo("There is a new alert.");
        onAlert(alert);
      });
      _socket.on("respond", ({ alert }: any) => onRespond(alert));
    }

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
      {/* <ContactPickModal isOpen={!currentUser.emergencyContact} /> */}
      <Suspense fallback={<SuspenseFallback />}>
        <IonTabs>
          <IonRouterOutlet>
            {/* <Route path={path} render={() => <Redirect to={`${path}/guides`} />} exact /> */}
            <Route path={`${path}/professionals`} component={Listing} exact />
            <Route path={`${path}/incidents`} component={Incidents} exact />
            <Route path={`${path}/sos`} component={Sos} exact />
            <Route path={`${path}/alerts`} component={Alerts} exact />
            <Route path={`${path}/video-shares`} component={VideoShares} exact />
            <Route path={`${path}/police`} component={PoliceListing} exact />
            <Route path={`${path}/appointments`} component={Appointments} />
            <Route path={`${path}/chat`} component={Chat} />
            <Route path={`${path}/guides`} component={Guides} />
            <Route path={`${path}/profile`} component={Profile} />
            <Route render={() => <Redirect to={`${path}/guides`} />} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="guides" href="/app/guides">
              <IonIcon icon={informationCircle} />
              <IonLabel>Guides</IonLabel>
              {/* <IonBadge>6</IonBadge> */}
            </IonTabButton>

            {!isLawEnforcer && (
              <IonTabButton tab="sos" href="/app/sos">
                <IonIcon icon={megaphone} />
                <IonLabel>Send SOS</IonLabel>
              </IonTabButton>
            )}

            <IonTabButton tab="chat" href="/app/chat">
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