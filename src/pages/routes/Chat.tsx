import React from "react";
import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route, useRouteMatch } from "react-router";

import Thread from "../Thread";
import _Chat from "../Chat";

const Chat: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path={`${path}/:threadId`} component={Thread} exact />
        <Route path={path} component={_Chat} exact />
      </IonRouterOutlet>
    </IonPage>
  );
}

export default Chat;