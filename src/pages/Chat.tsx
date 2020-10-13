import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonItem, IonAvatar, IonList, IonLabel, IonText, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";

import defaultAvatar from "../assets/img/default_avatar.jpg";
import { useRouteMatch, useHistory } from "react-router";
import { useAppContext } from "../lib/context-lib";
import { getUserThreads } from "../http/messages";
import useToastManager from "../lib/toast-hook";
import UserHeader from "../components/UserHeader";
import LoaderFallback from "../components/LoaderFallback";

export default function Chat() {
  let [threads, setThreads] = useState<any[] | null>(null);
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  useIonViewDidEnter(() => {
    getUserThreads(currentUser._id, currentUser.token).then(({ data }) => {
      setThreads(data || threads);
    }).catch(error => onError(error.message));
  });

  useEffect(() => () => {
    setThreads = () => null;
  }, []);

  return (
    <IonPage>
      <UserHeader title="Inbox" />
      <IonContent fullscreen>
        {!threads ? (
          <LoaderFallback />
        ) : (
            <IonList>
              {threads.map((thread: any) => <ThreadRibbon key={thread._id} thread={thread} />)}
            </IonList>
          )}
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
    <IonItem onClick={toThread} button detail>
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