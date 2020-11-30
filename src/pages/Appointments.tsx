import React, { useState } from "react";
import { IonPage, IonContent, IonList, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { useHistory } from "react-router";

import UserHeader from "../components/UserHeader";
import useToastManager from "../lib/toast-manager";
import { getUserAppointments } from "../http/appointments";
import { useAppContext } from "../lib/context-lib";
import AppointmentItem from "../components/AppointmentItem";
import LoaderFallback from "../components/LoaderFallback";
import useMounted from "../lib/mount-lib";

const Appointments: React.FC = () => {
  let [appointments, setAppointments] = useState<any[] | null>(null);
  const history = useHistory();
  const { onError } = useToastManager();
  const { currentUser, setActiveAppointment } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();

  const onTapAppointment = (appointment: any) => {
    setActiveAppointment(appointment);
    history.push("/app/appointments/" + appointment._id);
  }

  const fetchAppointments = async () => {
    if (isMounted) {
      setAppointments(null);
    }

    try {
      const { data } = await getUserAppointments(currentUser._id, currentUser.token);
      isMounted && setAppointments(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useIonViewDidEnter(() => {
    setActiveAppointment(null);
    fetchAppointments();
  }, []);

  useIonViewWillLeave(() => {
    setMounted(false);
  });

  return (
    <IonPage>
      <UserHeader title="Your appointments" />
      <IonContent fullscreen>
        {!appointments ? (
          <LoaderFallback />
        ) : (
            <IonList lines="full">
              {appointments.map(appointment => (
                <AppointmentItem
                  appointment={appointment}
                  key={appointment._id}
                  onTap={onTapAppointment}
                />
              ))}
            </IonList>
          )}
      </IonContent>
    </IonPage>
  );
}

export default Appointments;