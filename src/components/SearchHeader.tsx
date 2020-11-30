import { IonButton, IonButtons, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { search } from "ionicons/icons";
import React from "react";
import HeaderAvatar from "./HeaderAvatar";

const SearchHeader: React.FC<{
  title: string,
  showSearchBar: boolean,
  onToggle: () => any,
}> = ({ title, showSearchBar, onToggle }) => {
  return (
    <IonHeader>
      <IonToolbar>
        <HeaderAvatar />
        <IonButtons slot="end">
          <IonButton onClick={onToggle} color={showSearchBar ? "dark" : "medium"}>
            <IonIcon slot="icon-only" icon={search} />
          </IonButton>
        </IonButtons>
        <IonTitle size="small">{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default SearchHeader;