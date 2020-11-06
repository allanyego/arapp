import React from "react";
import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route, useRouteMatch } from "react-router";

import Guide from "../Guide";
import NewGuide from "../NewGuide";
import _Guides from "../Guides";

const Guides: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path={`${path}/:guideId`} component={Guide} exact />
        <Route path={`${path}/new`} component={NewGuide} exact />
        <Route path={path} component={_Guides} exact />
      </IonRouterOutlet>
    </IonPage>
  );
}

export default Guides;