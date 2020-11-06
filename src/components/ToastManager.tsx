import React from "react";
import { IonToast } from "@ionic/react";

import useToastManager from "../lib/toast-manager";
import { useAppContext } from "../lib/context-lib";
import "./ToastManager.css";

export const NOTIFICATION_TYPES = {
  DANGER: "danger",
  INFO: "info",
  SUCCESS: "success",
};

const ToastManager: React.FC = () => {
  const { popNotification } = useToastManager();
  const { notifications } = useAppContext() as any;

  return (
    <>
      {(notifications || []).map((notification: any) => (
        <IonToast
          key={notification._id}
          cssClass={"fancy-toast " + notification.type}
          isOpen={true}
          position="top"
          message={notification.message}
          onDidDismiss={popNotification}
          duration={notification.duration || 2500}
        />
      ))}
    </>
  );
};

export default ToastManager;