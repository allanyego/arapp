import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import React, { useEffect, useState } from "react";
import moment from "moment";

import Centered from "../components/Centered";
import LoaderFallback from "../components/LoaderFallback";
import { useAppContext } from "../lib/context-lib";
import { APPOINTMENT } from "../http/constants";
import { updateAppointment } from "../http/appointments";
import useToastManager from "../lib/toast-manager";
import { checkmark, checkmarkCircle, close, warning } from "ionicons/icons";
import { useHistory } from "react-router";

const AppointmentDetails: React.FC<{
  appointment: any
}> = (props) => {
  const [appointment, setAppointment] = useState(props.appointment);
  const [isUpdating, setUpdating] = useState(false);
  const { onError } = useToastManager();
  const { currentUser } = useAppContext() as any;

  const _updateAppointment = async (_status: string) => {
    await updateAppointment(appointment._id, currentUser.token, {
      status: _status,
    });
    setAppointment({
      ...appointment,
      status: _status,
    });
  }

  const onReject = async () => {
    setUpdating(true);
    try {
      await _updateAppointment(APPOINTMENT.STATUSES.REJECTED)
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      onError(error.message);
    }
  };

  const onAccept = async () => {
    setUpdating(true);
    try {
      await _updateAppointment(APPOINTMENT.STATUSES.ACCEPTED);
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      onError(error.message);
    }
  };

  const onClose = async () => {
    setUpdating(true);
    try {
      await _updateAppointment(APPOINTMENT.STATUSES.CLOSED);
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      onError(error.message);
    }
  };

  const { user, serviceProvider, status } = appointment;
  const isServiceProvider = serviceProvider._id === currentUser._id;

  return (
    <Centered fullHeight>
      <div>
        <p className="ion-no-margin">
          <IonText color="medium">
            <small>
              Appointment with <strong className="ion-text-capitalize">
                {isServiceProvider ? user.fullName : serviceProvider.fullName}</strong>
            </small>
          </IonText>
        </p>
        <p className="ion-no-margin">
          <strong>
            Subject:
          </strong> {" "}
          {appointment.subject}
        </p>
        <p className="ion-no-margin">
          <strong>
            Date-Time:
          </strong> {" "}
          {moment(appointment.date).format("MMM Do YYYY")} - {moment(appointment.time).format("LT")}
        </p>
        <p className="ion-no-margin">
          <strong>
            Duration:
          </strong> {" "}
          {appointment.duration + (appointment.duration > 1 ? "hrs" : "hr")}
        </p>

        {isUpdating && (
          <LoaderFallback name="lines-small" />
        )}

        <div className="ion-margin-">
          {(status !== APPOINTMENT.STATUSES.CLOSED) ? (
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol className="ion-no-padding">
                  {(status === APPOINTMENT.STATUSES.UNANSWERED) && (
                    isServiceProvider ? (
                      <>
                        <div>
                          <IonButton
                            color="dark"
                            expand="block"
                            disabled={isUpdating}
                            onClick={onAccept}
                          >Accept</IonButton>
                        </div>
                        <div>
                          <IonButton
                            color="light"
                            expand="block"
                            disabled={isUpdating}
                            onClick={onReject}
                          >Reject</IonButton>
                        </div>
                      </>
                    ) : (
                        <IonButton
                          color="warning"
                          expand="block"
                          fill="clear"
                          disabled
                        >
                          Unanswered <IonIcon icon={warning} slot="end" />
                        </IonButton>
                      ))
                  }

                  {(status === APPOINTMENT.STATUSES.ACCEPTED) && (
                    isServiceProvider ? (
                      <IonButton
                        color="dark"
                        expand="block"
                        disabled={isUpdating}
                        onClick={onClose}
                      >Mark as closed</IonButton>
                    ) : (
                        <IonButton
                          color="success"
                          expand="block"
                          fill="clear"
                          disabled
                        >
                          Accepted <IonIcon icon={checkmark} slot="end" />
                        </IonButton>
                      )
                  )}

                  {(status === APPOINTMENT.STATUSES.REJECTED) && (
                    <IonButton
                      color="danger"
                      expand="block"
                      fill="clear"
                      disabled
                    >
                      Rejected <IonIcon icon={close} slot="end" />
                    </IonButton>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          ) : (
              <Centered>
                <IonButton
                  color="medium"
                  expand="block"
                  fill="clear"
                  disabled
                >
                  Closed <IonIcon icon={checkmarkCircle} slot="end" />
                </IonButton>
              </Centered>
            )}
        </div>
      </div>
    </Centered>
  );
};

const Appointment: React.FC = () => {
  const { activeAppointment } = useAppContext() as any;
  const [appointment, setAppointment] = useState<any>(null);
  const history = useHistory();

  useEffect(() => setAppointment(activeAppointment), [activeAppointment]);

  useIonViewDidEnter(() => {
    if (!activeAppointment) {
      history.replace("/app/appointments");
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/appointments" />
          </IonButtons>
          <IonTitle>Appointment details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding-horizontal">
        {!appointment ? (
          <LoaderFallback fullHeight />
        ) : (
            <AppointmentDetails appointment={appointment} />
          )}
      </IonContent>
    </IonPage>
  );
};

export default Appointment;