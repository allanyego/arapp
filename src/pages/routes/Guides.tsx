import React from "react";
import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route } from "react-router";

import Guide from "../Guide";
import NewGuide from "../NewGuide";
import _Guides from "../Guides";

const Guides: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/app/guides" component={_Guides} exact />
        <Route path="/app/guides/guide/:guideId" component={Guide} exact />
        <Route path="/app/guides/new" component={NewGuide} exact />
      </IonRouterOutlet>
    </IonPage>
  );
}

export default Guides;