import React, { useState } from 'react';
import { IonContent, IonPage, IonList, useIonViewDidEnter, useIonViewWillLeave } from '@ionic/react';
import { useHistory } from 'react-router';

import { getPolice } from "../http/users";
import useToastManager from '../lib/toast-manager';
import { useAppContext } from '../lib/context-lib';
import LoaderFallback from '../components/LoaderFallback';
import useMounted from '../lib/mount-lib';
import UserListingItem from '../components/UserListingItem';
import SearchBar from '../components/SearchBar';
import SearchHeader from '../components/SearchHeader';
import { USER } from '../http/constants';

const PoliceListing: React.FC = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isSearching, setSearching] = useState(false);
  let [police, setPolice] = useState<any[] | null>(null);
  const history = useHistory();
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  const fetchPolice = async (opts?: any) => {
    try {
      const { data } = await getPolice(currentUser.token, opts);
      isMounted && setPolice(data);
    } catch (error) {
      onError(error.message);
    }
  };

  const onToggle = () => {
    if (showSearchBar) {
      setPolice(null);
      fetchPolice({});
    }
    setShowSearchBar(show => !show)
  };
  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }

    setSearching(true);

    try {
      await fetchPolice({
        username: searchTerm,
      });
    } catch (error) {
      onError(error.message);
    } finally {
      setSearching(false);
    }
  };


  useIonViewDidEnter(() => {
    setMounted(true);
    if (currentUser.accountType === USER.ACCOUNT_TYPES.LAW_ENFORCER) {
      return history.replace("/app");
    }

    fetchPolice({});
  });

  useIonViewWillLeave(() => setMounted(false));

  return (
    <IonPage>
      <SearchHeader
        title="Police"
        {...{ showSearchBar, onToggle }}
      />

      <IonContent fullscreen>
        {showSearchBar && (
          <SearchBar isSearching={isSearching} onSearch={handleSearch} />
        )}
        {!police ? (
          <LoaderFallback />
        ) : (
            <IonList lines="full">
              {police.map((cop: any) => cop._id !== currentUser._id ? (
                <UserListingItem key={cop._id} user={cop} />
              ) : null)}
            </IonList>
          )}
      </IonContent>
    </IonPage>
  );
};

export default PoliceListing;