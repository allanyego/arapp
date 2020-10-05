import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonText, IonIcon, IonButtons, IonBackButton, IonSearchbar, IonGrid, IonItem, IonLabel, IonRange, IonCheckbox, IonInput, IonToggle, IonSelectOption, IonSelect, IonDatetime, IonThumbnail, IonAvatar, IonList, IonChip } from '@ionic/react';
import { caretBackCircle, search, personCircle, ellipsisHorizontal, ellipsisVertical, checkmarkCircle, shuffle, star, informationCircle, navigate, home, closeCircle } from 'ionicons/icons';
import { useHistory } from 'react-router';

import './Listing.css';
import Rating from '../components/Rating';
import defaultAvatar from "../assets/img/default_avatar.jpg";
import { getUsers } from "../http/users";

const Listing: React.FC = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setSearching] = useState(false);
  const [professionals, setProfessionals] = useState<any>([]);
  const history = useHistory();

  const fetchProfessionals = async (opts?: any) => {
    return (await getUsers(opts)).data;
  };

  useEffect(() => {
    fetchProfessionals().then(setProfessionals).catch(console.error);
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
      setProfessionals(await fetchProfessionals(searchTerm));
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
            <img src={defaultAvatar} alt="mike scott" />
          </IonAvatar>
          <IonButtons slot="primary">
            <IonButton onClick={onToggle} color={showSearchBar ? "dark" : "medium"}>
              <IonIcon slot="icon-only" icon={search} />
            </IonButton>
          </IonButtons>
          <IonTitle>Professionals</IonTitle>
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
                  <IonButton expand="block" onClick={handleSearch} disabled={isSearching}>Go</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        )}
        <IonList lines="full">
          {professionals.map((prof: any) => <ListingItem key={prof._id} prof={prof} />)}
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
        <h3>{prof.fullName}</h3>
        <p>{prof.bio || "No bio."}</p>
        {prof.rating ? (
          <>
            <Rating rating={prof.rating} /><br />
          </>
        ) : "No rating."}
        {prof.speciality.map((s: any) => <IonChip>{s}</IonChip>)}
      </IonLabel>
    </IonItem>
  );
}
