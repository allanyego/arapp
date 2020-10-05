import React, { useState } from "react";
import { IonHeader, IonToolbar, IonAvatar, IonTitle, IonButtons, IonButton, IonIcon, IonPopover, IonList, IonItem, IonLabel } from "@ionic/react";
import { ellipsisVertical, list, exit } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAppContext } from "../lib/context-lib";
import defaultAvatar from "../assets/img/default_avatar.jpg";
import { clear } from "../lib/storage";

export default function UserHeader({ title }: { title: string }) {
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(undefined);
  const { currentUser, setCurrentUser } = useAppContext() as any;

  const onShowPopover = (e: any) => {
    e.persist();
    setPopoverEvent(e);
    setShowPopover(true);
  };
  const onHidePopover = () => setShowPopover(false);
  const toProfile = () => history.push('/app/profile');
  const handleLogout = async () => {
    try {
      await clear();
      setCurrentUser(null);
      history.push("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonAvatar slot="start" className="ion-padding" onClick={toProfile}>
          <img src={defaultAvatar} alt={currentUser.fullName} />
        </IonAvatar>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="secondary">
          <IonButton onClick={onShowPopover}>
            <IonIcon slot="icon-only" icon={ellipsisVertical} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonPopover
        isOpen={showPopover}
        event={popoverEvent}
        cssClass='my-custom-class'
        onDidDismiss={onHidePopover}
      >
        <IonList>
          <IonItem routerLink="/app/professionals">
            <IonIcon slot="start" icon={list} />
            <IonLabel>Find professionals</IonLabel>
          </IonItem>
          <IonItem color="danger" onClick={handleLogout}>
            <IonIcon slot="start" icon={exit} />
            <IonLabel>Logout</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>
    </IonHeader>
  );
}
