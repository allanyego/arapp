import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonSearchbar } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import React, { useState } from "react";
import trimAndLower from "../lib/trim-and-lower";

import "./SearchBar.css";

const SearchBar: React.FC<{
  isSearching: boolean,
  onSearch: (term: string) => any,
}> = ({
  isSearching,
  onSearch,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (e: any) => {
      setSearchTerm(e.target.value.trim());
    };
    const handleSearch = () => onSearch(trimAndLower(searchTerm));

    return (
      <div className="search-bar">
        <IonGrid>
          <IonRow>
            <IonCol className="ion-no-padding">
              <IonSearchbar
                value={searchTerm}
                onIonChange={handleChange}
                showCancelButton="focus"
              />
            </IonCol>
            <IonCol className="ion-no-padding d-flex ion-align-items-center" size="2">
              <IonButton onClick={handleSearch} disabled={isSearching} className="search-btn">
                <IonIcon icon={searchOutline} slot="icon-only" />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    );
  };

export default SearchBar;