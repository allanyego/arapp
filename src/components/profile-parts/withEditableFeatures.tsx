import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { close, pencil } from "ionicons/icons";
import { ProfileData } from "../Profile";

export default function withEditableFeatures(Comp: React.FC<any>): React.FC<EditableProps> {
  return (props) => {
    const [isEditting, setEditting] = useState(false);

    const toggle = () => setEditting(!isEditting);

    return props.currentUserId !== props.user._id ?
      (
        <Comp {...props} setEditting={() => null} />
      ) : (
        <div style={{
          position: "relative"
        }}>
          <Comp {...props} {...{ isEditting, setEditting }} />
          <EditFabButton onClick={toggle} isEditting={isEditting} />
        </div>
      );
  };
}

export interface EditableProps {
  user: ProfileData
  currentUserId: string
  setEditting?: any,
  isEditting?: boolean
}

export function EditFabButton({ onClick, isEditting, style }: {
  onClick: (...args: any[]) => any,
  isEditting: boolean,
  style?: object,
}) {
  return (
    <div
      className="d-flex ion-justify-content-center ion-align-items-center border-circle edit-floating-btn"
      onClick={onClick}
      style={style}
    >
      <IonIcon
        color={isEditting ? "danger" : "dark"}
        icon={isEditting ? close : pencil} />
    </div>
  );
}