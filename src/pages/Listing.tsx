import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonIcon, IonButtons, IonSearchbar, IonGrid, IonItem, IonLabel, IonAvatar, IonList, IonChip } from '@ionic/react';
import { search } from 'ionicons/icons';
import { useHistory } from 'react-router';

import './Listing.css';
import Rating from '../components/Rating';
import defaultAvatar from "../assets/img/default_avatar.jpg";
import { getUsers } from "../http/users";
import useToastManager from '../lib/toast-hook';
import { useAppContext } from '../lib/context-lib';

const Listing: React.FC = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setSearching] = useState(false);
  const [professionals, setProfessionals] = useState<any>([]);
  const history = useHistory();
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const fetchProfessionals = async (opts?: any) => {
    try {
      const { data } = await getUsers(opts);
      setProfessionals(data);
    } catch (error) {
      onError(error.message);
    }
  };

  useEffect(() => {
    fetchProfessionals({}).catch(error => onError(error.message));
  }, []);

  const toProfile = () => history.push('/app/profile');
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonAvatar slot="start" className="ion-padding" onClick={toProfile}>
            <img src={defaultAvatar} alt="" />
          </IonAvatar>
          <IonButtons slot="primary">
            <IonButton onClick={onToggle} color={showSearchBar ? "dark" : "medium"}>
              <IonIcon slot="icon-only" icon={search} />
            </IonButton>
          </IonButtons>
          <IonTitle>Find help</IonTitle>
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
        <IonList lines="full">
          {professionals.map((prof: any) => prof._id !== currentUser._id ? (
            <ListingItem key={prof._id} prof={prof} />
          ) : null)}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Listing;

function ListingItem({ prof }: any) {
  return (
    <IonItem routerLink={`/app/profile/${prof._id}`}>
      <IonAvatar slot="start">
        <img src={defaultAvatar} alt={prof.fullName} />
      </IonAvatar>
      <IonLabel>
        <h2 className="ion-text-capitalize">{prof.fullName}</h2>
        <p>{prof.bio || "No bio."}</p>
        {prof.rating && (
          <>
            <Rating rating={prof.rating} /><br />
          </>
        )}
        {prof.speciality.map((s: any) => <IonChip>{s}</IonChip>)}
      </IonLabel>
    </IonItem>
  );
}
