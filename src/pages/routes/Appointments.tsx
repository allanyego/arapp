import React from "react";
import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router";

import _Appointments from "../Appointments";
import Appointment from "../Appointment";

const Appointments: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/app/appointments/:appointmentId" component={Appointment} exact />
        <Route path="/app/appointments" component={_Appointments} exact />
      </IonRouterOutlet>
    </IonPage>
  );
}

export default Appointments;