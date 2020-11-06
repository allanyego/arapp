import { IonText } from "@ionic/react";
import React from "react";

interface WordCounterProps {
  max: number
  text: string
  min?: number
}

const WordCounter: React.FC<WordCounterProps> = ({
  text,
  max,
  min = 0
}) => {
  const textLength = text.length;
  const hasError = textLength < min || textLength > max;
  const currentCount = textLength < min ? min : textLength;

  return (
    <IonText color={hasError ? "danger" : "medium"}>
      <p className="ion-no-margin ion-text-right">
        <small style={{
          fontSize: "70%"
        }}><i>{currentCount}/{max}</i></small>
      </p>
    </IonText>
  );
};

export default WordCounter;