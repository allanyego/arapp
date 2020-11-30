import React from "react";
import { IonItem, IonLabel, IonText, IonGrid, IonRow, IonCol, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonButton } from "@ionic/react";
import moment from "moment";

import { USER } from "../http/constants";
import { useAppContext } from "../lib/context-lib";
import { arrowForward } from "ionicons/icons";

interface ItemProps {
  appointment: any
  onTap: (arg: any) => any,
}

const AppointmentItem: React.FC<ItemProps> = ({ appointment, onTap }) => {
  const { currentUser } = useAppContext() as any;

  const handleClick = () => {
    onTap(appointment);
  };

  const isCurrentPatient = currentUser.accountType === USER.ACCOUNT_TYPES.USER;

  const Inner = () => (
    <IonItem
      detailIcon={arrowForward}
      onClick={handleClick}
      button
      detail
    >
      <IonLabel>
        <h2 className="ion-text-capitalize">
          <strong>
            {
              isCurrentPatient ? (
                appointment.serviceProvider.fullName
              ) : (
                  appointment.user.fullName
                )}
          </strong>
        </h2>
        <IonText color="medium">
          {appointment.subject}
        </IonText>
        <div className="d-flex ion-align-items-center ion-justify-content-between">
          <div>
            <small>
              {moment(appointment.date).format("MMM Do YYYY")} - {moment(appointment.time).format("LT")}
            </small>
          </div>
          <div>
            <small>
              {appointment.duration + (appointment.duration > 1 ? "hrs" : "hr")}
            </small>
          </div>
        </div>
        <IonText color="medium">
          <i>
            <small>{appointment.status}</small>
          </i>
        </IonText>
      </IonLabel>
    </IonItem>
  );

  return (
    <>
      <Inner key="appointment-inner" />
    </>
  );
}

export default AppointmentItem;