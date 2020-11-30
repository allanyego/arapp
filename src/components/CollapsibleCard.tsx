import { IonCard, IonCardContent, IonCardHeader, IonCol, IonIcon, IonRow } from "@ionic/react";
import { chevronDown, chevronUp } from "ionicons/icons";
import React, { useState } from "react";

const CollapsibleCard: React.FC<{
  headerText: string,
  noPadding?: boolean,
}> = ({ headerText, noPadding = false, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(open => !open);

  return (
    <IonCard className="ion-no-margin ion-margin-vertical collapsible-card">
      <IonCardHeader className="header">
        <IonRow onClick={onToggle}>
          <IonCol className="ion-no-padding">
            <h6 className="ion-no-margin">{headerText}</h6>
          </IonCol>
          <IonCol className="ion-no-padding ion-text-right">
            <IonIcon
              color={isOpen ? "dark" : "primary"}
              icon={isOpen ? chevronUp : chevronDown}
            />
          </IonCol>
        </IonRow>
      </IonCardHeader>
      {isOpen && (
        <IonCardContent className={"body" + (noPadding ? " ion-no-padding" : "")}>
          {children}
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default CollapsibleCard;