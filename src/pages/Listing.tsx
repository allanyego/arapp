import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonIcon, IonButtons, IonSearchbar, IonGrid, IonItem, IonLabel, IonAvatar, IonList, IonChip, useIonViewDidEnter, useIonViewWillLeave } from '@ionic/react';
import { business, peopleCircleOutline, person, personCircleOutline, search } from 'ionicons/icons';

import './Listing.css';
import Rating from '../components/Rating';
import { getUsers } from "../http/users";
import useToastManager from '../lib/toast-manager';
import { useAppContext } from '../lib/context-lib';
import LoaderFallback from '../components/LoaderFallback';
import { USER } from '../http/constants';
import { ProfileData } from '../components/Profile';
import userPicture from '../http/helpers/user-picture';
import HeaderAvatar from '../components/HeaderAvatar';
import useMounted from '../lib/mount-lib';
import LazyImage from '../components/LazyImage';

const Listing: React.FC = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setSearching] = useState(false);
  let [professionals, setProfessionals] = useState<any[] | null>(null);
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  const fetchProfessionals = async (opts?: any) => {
    try {
      const { data } = await getUsers(currentUser.token, opts);
      isMounted && setProfessionals(data);
    } catch (error) {
      onError(error.message);
    }
  };

  const onToggle = () => setShowSearchBar(show => !show);
  const closeSearchBar = () => setShowSearchBar(false);
  const handleChange = (e: any) => {
    setSearchTerm(e.target.value.trim());
  };
  const handleSearch = async () => {
    if (!searchTerm) {
      return;
    }

    setSearching(true);

    try {
      await fetchProfessionals(searchTerm);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };


  useIonViewDidEnter(() => {
    fetchProfessionals({});
  });

  useIonViewWillLeave(() => setMounted(false));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <HeaderAvatar />
          <IonButtons slot="primary">
            <IonButton onClick={onToggle} color={showSearchBar ? "dark" : "medium"}>
              <IonIcon slot="icon-only" icon={search} />
            </IonButton>
          </IonButtons>
          <IonTitle size="small">Counsellors/Facilities</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {showSearchBar && (
          <div className="search-bar">
            <IonGrid>
              <IonRow>
                <IonCol className="ion-no-padding">
                  <IonSearchbar
                    value={searchTerm}
                    onIonChange={handleChange}
                    showCancelButton="focus"
                    cancelButtonText="Custom Cancel"
                    onIonCancel={closeSearchBar}
                  />
                </IonCol>
                <IonCol className="ion-no-padding d-flex ion-align-items-center" size="2">
                  <IonButton expand="block" onClick={handleSearch} disabled={isSearching}>Find</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        )}
        {!professionals ? (
          <LoaderFallback />
        ) : (
            <IonList lines="full">
              {professionals.map((prof: any) => prof._id !== currentUser._id ? (
                <ListingItem key={prof._id} prof={prof} />
              ) : null)}
            </IonList>
          )}
      </IonContent>
    </IonPage>
  );
};

export default Listing;

function ListingItem({ prof }: {
  prof: ProfileData
}) {
  const isFacility = prof.accountType === USER.ACCOUNT_TYPES.HEALTH_FACILITY;

  return (
    <IonItem routerLink={`/app/profile/${prof._id}`} button detail>
      <IonAvatar slot="start">
        <LazyImage src={userPicture(prof)} alt={prof.fullName} />
      </IonAvatar>
      <IonLabel>
        <h2 className="ion-text-capitalize">{prof.fullName}</h2>
        <p>{prof.speciality || "---"}</p>
        <Rating userId={prof._id as string} />
      </IonLabel>
      <IonIcon
        slot="end"
        icon={isFacility ?
          business :
          person}
      />
    </IonItem>
  );
}
