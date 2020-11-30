import React from "react";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import { videocam } from "ionicons/icons";
import moment from "moment";

const VideoShareItem: React.FC<{
  file: any,
  onTap: (arg: any) => any,
}> = ({ file, onTap }) => {
  const handleClick = () => onTap(file);

  const { user, incident } = file;

  return (
    <IonItem onClick={handleClick} button detail detailIcon={videocam}>
      <IonLabel>
        <h2 className="ion-text-capitalize">
          {user.fullName}
        </h2>
        <IonText color="medium">
          <small>{moment(incident.createdAt).format("MMM Do YY")}</small>
        </IonText>
      </IonLabel>
    </IonItem>
  );
};

export default VideoShareItem;