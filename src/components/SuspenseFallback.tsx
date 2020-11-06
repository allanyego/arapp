import { IonText } from "@ionic/react";
import React from "react";
import LoaderFallback from "./LoaderFallback";

const SuspenseFallback: React.FC = () => {
  return (
    <LoaderFallback color="secondary">
      <IonText className="ion-text-center">
        <p>Hold on...</p>
      </IonText>
    </LoaderFallback>
  );
};

export default SuspenseFallback;