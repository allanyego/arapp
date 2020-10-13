import React from "react";
import { IonSpinner } from "@ionic/react";

const LoaderFallback: React.FC = () => {
  return (
    <div className="h100 d-flex ion-justify-content-center ion-align-items-center">
      <IonSpinner name="lines" />
    </div>
  );
};

export default LoaderFallback;