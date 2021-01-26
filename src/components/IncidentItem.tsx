import React from "react";
import { IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";
import { play } from "ionicons/icons";
import moment from "moment";

import { INCIDENT_TYPES } from "../http/constants";

const IncidentItem: React.FC<{
  incident: any,
  onSelect: any,
}> = ({ incident, onSelect }) => {
  const onTap = () => onSelect(incident);
  const isVideo = incident.type === INCIDENT_TYPES.VIDEO;

  return (
    <IonItem onClick={onTap} button key={incident._id}>
      <IonLabel>
        <h3 className="ion-text-capitalize">
          {isVideo ? (
            "Video capture"
          ) : (
              <>
                SMS to <strong>{incident.contact.displayName}</strong>
              </>
            )}
        </h3>
        <p>{isVideo ? incident.videoEvidence : incident.location.name}</p>
        <IonText color="medium">
          <small>{moment(incident.createdAt).format("MMM Do YY")}</small>
        </IonText>
      </IonLabel>
      {isVideo && (
        <IonIcon slot="end" color="danger" icon={play} />
      )}
    </IonItem>
  );
};

export default IncidentItem;