import { NOTIFICATION_TYPES } from "../components/ToastManager";
import { useAppContext } from "./context-lib";

export default function useToastManager() {
  const { notifications, setNotifications } = useAppContext();

  const popNotification = () => {
    const prev = notifications;
    setNotifications(prev.slice(1, prev.length));
  };

  const pushNotification = (message, type, duration) =>
    setNotifications([
      ...notifications,
      {
        message,
        type,
        duration,
        _id: Date.now(),
      },
    ]);

  const onError = (message, duration) =>
    pushNotification(message, NOTIFICATION_TYPES.DANGER, duration);

  const onSuccess = (message, duration) =>
    pushNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);

  const onInfo = (message, duration) =>
    pushNotification(message, NOTIFICATION_TYPES.INFO, duration);

  return {
    onError,
    onSuccess,
    onInfo,
    popNotification,
  };
}
