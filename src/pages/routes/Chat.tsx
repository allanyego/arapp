import React from "react";
import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router";

import Thread from "../Thread";
import _Chat from "../Chat";

const Chat: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/app/chat/:threadId" component={Thread} exact />
        <Route path="/app/chat" component={_Chat} exact />
      </IonRouterOutlet>
    </IonPage>
  );
}

export default Chat;