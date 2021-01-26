import React, { useState } from "react";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonRow, IonSearchbar, IonText } from "@ionic/react";
import { close, shareSocial } from "ionicons/icons";

import { shareVideoUrl } from "../http/incidents";
import { getPolice } from "../http/users";
import { useAppContext } from "../lib/context-lib";
import debounce from "../lib/debounce";
import useToastManager from "../lib/toast-manager";
import trimAndLower from "../lib/trim-and-lower";
import Centered from "./Centered";
import LoaderFallback from "./LoaderFallback";

const SearchResult: React.FC<{
  user: any,
  onTap: (arg: any) => any,
}> = ({ user, onTap }) => {
  const handleClick = () => onTap(user);

  return (
    <IonItem button onClick={handleClick}>
      <IonLabel>
        <h2 className="ion-text-capitalize">
          <strong>{user.fullName}</strong>
        </h2>
        <IonText color="medium">
          <small>@{user.username}</small>
        </IonText>
      </IonLabel>
    </IonItem>
  );
};

const ShareButton: React.FC<{
  incidentId: string,
  disabled?: boolean,
}> = ({ incidentId, disabled = false }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [isSharing, setSharing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { onError, onSuccess } = useToastManager();
  const { currentUser } = useAppContext() as any;

  const toggleSearch = () => setShowSearch(!showSearch);

  const fetchPolice = async (opts?: any) => {
    setSearching(true);
    try {
      const { data } = await getPolice(currentUser.token, opts);
      setSearchResults(data);
      setSearching(false);
    } catch (error) {
      setSearching(false);
      onError(error.message);
    }
  };

  const onTap = async (user: any) => {
    toggleSearch();
    setSharing(true);
    try {
      await shareVideoUrl(incidentId, user._id, currentUser.token);
      onSuccess("Video url shared.");
      setSharing(false);
    } catch (error) {
      setSharing(false);
      onError(error.message);
    }
  };

  const handleSearch = async (e: any) => {
    const searchTerm = trimAndLower(e.target.value);
    if (!searchTerm) {
      return;
    }

    setSearching(true);

    try {
      await fetchPolice({
        username: searchTerm
      });
    } catch (error) {
      onError(error.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <Centered>
        <IonButton
          onClick={toggleSearch}
          disabled={disabled || isSharing}
          color="dark"
        >
          {isSharing ? "Sharing..." : "Share to a cop"} <IonIcon slot="end" icon={shareSocial} />
        </IonButton>
      </Centered>
      {showSearch && (
        <div className="share-results-container">
          <IonGrid>
            <IonRow>
              <IonCol className="ion-no-padding">
                <IonSearchbar
                  onIonChange={debounce(handleSearch, 1200)}
                  placeholder="enter username"
                />
              </IonCol>
              <IonCol className="ion-no-padding d-flex ion-align-items-center" size="2">
                <IonButton fill="clear" color="danger" onClick={toggleSearch} disabled={isSearching}>
                  <IonIcon slot="icon-only" icon={close} />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <hr />

          {isSearching ? (
            <LoaderFallback fullHeight />
          ) : (
              <IonList lines="full">
                {searchResults.map((user: any) => (
                  <SearchResult key={user._id} {...{ onTap, user }} />
                ))}
              </IonList>
            )}
        </div>
      )}
    </div>
  )
};

export default ShareButton;