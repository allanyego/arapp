import React from "react";
import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route, useRouteMatch } from "react-router";

import _Appointments from "../Appointments";
import Appointment from "../Appointment";

const Appointments: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path={`${path}/:appointmentId`} component={Appointment} exact />
        <Route path={path} component={_Appointments} exact />
      </IonRouterOutlet>
    </IonPage>
  );
}

export default Appointments;