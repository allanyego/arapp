import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonCard, IonCardContent, IonItem, IonAvatar, IonList, IonLabel, IonText } from "@ionic/react";

import defaultAvatar from "../assets/img/default_avatar.jpg";
import { useRouteMatch, useHistory } from "react-router";
import { useAppContext } from "../lib/context-lib";
import { getUserThreads } from "../http/messages";

export default function Chat() {
  const history = useHistory();
  const [threads, setThreads] = useState<any>([]);
  const { currentUser } = useAppContext() as any;

  useEffect(() => {
    getUserThreads(currentUser._id, currentUser.token).then(({ data }) => {
      setThreads(data || threads);
    }).catch(console.error);
  }, []);

  const toProfile = () => history.push('/app/profile');

  return (
    <IonPage>
      {/* TODO: Refactor this header */}
      <IonHeader>
        <IonToolbar>
          <IonAvatar slot="start" className="ion-padding" onClick={toProfile}>
            <img src={defaultAvatar} alt="mike scott" />
          </IonAvatar>
          <IonTitle>Chat</IonTitle>
        </IonToolbar>
      </IonHeader>
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
        <h2>{otherUser.fullName}</h2>
        <IonText color="medium">{thread.lastMessage.body}</IonText>
      </IonLabel>
    </IonItem>
  );
}