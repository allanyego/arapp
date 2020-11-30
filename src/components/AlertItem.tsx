import { IonButton, IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";
import React, { useState } from "react";
import useAlerts from "../lib/alerts";

const AlertItem: React.FC<{
  alert: any,
}> = ({ alert }) => {
  const [isResponding, setResponding] = useState(false);
  const { respond } = useAlerts();

  const handleRespond = async () => {
    setResponding(true);
    await respond(alert._id);
    setResponding(false);
  };

  const { user, location, hasBeenResponded } = alert;

  return (
    <IonItem>
      <IonLabel>
        <h2 className="ion-text-capitalize">
          {user.fullName}
        </h2>
        <IonText color="medium">
          {!location ? "No location" : (
            <>
              <p className="ion-text-capitalize ion-no-margin">
                <small><strong>{location.name}</strong></small>
              </p>
              <span>
                <small>
                  <strong>
                    ({location.latitude.toFixed(2)}, {location.longitude.toFixed(2)})
                  </strong>
                </small>
              </span>
            </>
          )}
        </IonText>
        <div>
          <div>
            <small>
              User phone: <strong>{user.phone}</strong>
            </small>
          </div>
          <div className="d-flex ion-justify-content-end">
            {!hasBeenResponded && (
              <IonButton disabled={isResponding} onClick={handleRespond} color="success" size="small">Respond</IonButton>
            )}
          </div>
        </div>

      </IonLabel>
      {hasBeenResponded && (
        <IonIcon icon={checkmarkCircle} color="success" slot="end" />
      )}
    </IonItem>
  );
};

export default AlertItem;