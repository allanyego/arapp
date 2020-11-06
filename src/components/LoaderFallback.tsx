import React from "react";
import { IonSpinner } from "@ionic/react";
import Centered from "./Centered";

const LoaderFallback: React.FC<{
  fullHeight?: boolean
  color?: string,
  name?: any,
}> = ({ fullHeight = true, color = "dark", children, name = "lines" }) => {
  return (
    <Centered fullHeight={fullHeight}>
      <div>
        <Centered>
          <IonSpinner {...{ color, name }} />
        </Centered>
        {children}
      </div>
    </Centered>
  );
};

export default LoaderFallback;