import React, { useEffect, useState } from "react";
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonPopover, IonList, IonItem, IonLabel } from "@ionic/react";
import { ellipsisVertical, list, exit } from "ionicons/icons";
import { useHistory } from "react-router";

import { useAppContext } from "../lib/context-lib";
import { clear } from "../lib/storage";
import useToastManager from "../lib/toast-manager";
import "./UserHeader.css";
import useLocationChange from "../lib/location-change";
import HeaderAvatar from "./HeaderAvatar";
import useMounted from "../lib/mount-lib";

export default function UserHeader({ title, titleSize = "small" }: {
  title: string,
  titleSize?: "small" | "large" | undefined,
}) {
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState(undefined);
  const { setCurrentUser } = useAppContext() as any;
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  const onShowPopover = (e: any) => {
    e.persist();
    setPopoverEvent(e);
    setShowPopover(true);
  };
  const onHidePopover = () => isMounted && setShowPopover(false);
  // Hide the popover on navigation
  useLocationChange(onHidePopover);

  const handleLogout = async () => {
    try {
      await clear();
      setCurrentUser(null);
      history.push("/sign-in");
    } catch (error) {
      onError(error.message);
    }
  };

  useEffect(() => () => setMounted(false), []);

  return (
    <IonHeader>
      <IonToolbar>
        <HeaderAvatar />
        <IonTitle size={titleSize}>{title}</IonTitle>
        <IonButtons slot="end">
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
            <IonLabel>Counsellors/Facilities</IonLabel>
          </IonItem>
          <IonItem onClick={handleLogout} button>
            <IonIcon color="danger" slot="start" icon={exit} />
            <IonLabel color="danger">Logout</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>
    </IonHeader>
  );
}
