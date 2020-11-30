import { useAppContext } from "./context-lib";

export default function useAlerts() {
  const { alerts, setAlerts, socket } = useAppContext();

  const pushAlert = (alert) => setAlerts([...alerts, alert]);

  const onRespond = (alert) =>
    setAlerts([...alerts.filter((alrt) => alrt._id !== alert)]);

  const onAlert = (alert) => pushAlert(alert);

  const respond = async (alertId) => {
    setAlerts([
      ...alerts.map((alert) => {
        if (alert._id === alertId) {
          return {
            ...alert,
            hasBeenResponded: true,
          };
        }

        return alert;
      }),
    ]);
    socket.emit("respond", { alert: alertId });
  };

  return {
    respond,
    onRespond,
    onAlert,
  };
}
