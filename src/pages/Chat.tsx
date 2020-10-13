import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonItem, IonAvatar, IonList, IonLabel, IonText } from "@ionic/react";

import defaultAvatar from "../assets/img/default_avatar.jpg";
import { useRouteMatch, useHistory } from "react-router";
import { useAppContext } from "../lib/context-lib";
import { getUserThreads } from "../http/messages";
import useToastManager from "../lib/toast-hook";
import UserHeader from "../components/UserHeader";

export default function Chat() {
  const [threads, setThreads] = useState<any>([]);
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  useEffect(() => {
    getUserThreads(currentUser._id, currentUser.token).then(({ data }) => {
      setThreads(data || threads);
    }).catch(error => onError(error.message));
  }, []);

  return (
    <IonPage>
      <UserHeader title="Chat" />
      <IonContent fullscreen>
        <IonList>
          {threads.map((thread: any) => <ThreadRibbon key={thread._id} thread={thread} />)}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

function ThreadRibbon({ thread }: any) {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { currentUser } = useAppContext() as any;
  const otherUser = thread.participants.filter(
    (user: any) => user._id !== currentUser._id
  )[0];

  const toThread = () => history.push({
    pathname: `${url}/${thread._id}`,
    state: {
      ...otherUser,
    }
  });

  return (
    <IonItem onClick={toThread}>
      <IonAvatar slot="start">
        <img src={defaultAvatar} alt={otherUser.fullName} />
      </IonAvatar>
      <IonLabel>
        <h2 className="ion-text-capitalize">{otherUser.fullName}</h2>
        <IonText color="medium">{thread.lastMessage.body}</IonText>
      </IonLabel>
    </IonItem>
  );
}