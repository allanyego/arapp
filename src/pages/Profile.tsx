import React, { useState, useEffect } from "react";
import { IonAvatar, IonText, IonPage, IonContent, IonChip, IonRow, IonCol, IonGrid, IonButton, IonList, IonItem, IonListHeader, IonLabel, IonIcon, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import { heartOutline, star, starHalf, caretDown, caretUp, call, mail } from "ionicons/icons";
import moment from "moment";

import defaultAvatar from "../assets/img/default_avatar.jpg";
import "./Profile.css";
import Rating from "../components/Rating";
import { useParams, useHistory } from "react-router";
import { getById } from "../http/users";
import { useAppContext } from "../lib/context-lib";

interface ProfileData {
  name: string,
  username: string,
  gender: string,
  bio: string,
  conditions: string[],
  contact: {
    phone: string,
    email: string,
  },
  picture?: string,
  experience?: Number,
  speciality?: string[],
  education?: {
    institution: string,
    areaOfStudy: string,
    startDate: Date,
    endDate?: Date,
  }[],
  rating?: number,
}

const profileData: ProfileData = {
  name: "john hops",
  username: "jonny",
  gender: "male",
  bio: "i like cheese cake and shoes :)",
  conditions: ["depression", "disillusion"],
  contact: {
    phone: "254722900200",
    email: "mymail@me.com",
  },
};

const docProfileData: ProfileData = {
  name: "john hops",
  username: "jonny",
  gender: "male",
  bio: "i like cheese cake and shoes :)",
  conditions: ["depression", "disillusion"],
  contact: {
    phone: "254722900200",
    email: "mymail@me.com",
  },
  experience: 6,
  speciality: ["depression", "grief", "addiction"],
  education: [
    {
      institution: "moi university",
      areaOfStudy: "psychology",
      startDate: new Date("2014-10-23"),
      endDate: new Date("2020-3-22"),
    },
    {
      institution: "moi university",
      areaOfStudy: "msc. psychology",
      startDate: new Date("2021-10-23"),
      endDate: new Date("2022-3-22"),
    }
  ],
  rating: 4.5,
};

const Profile: React.FC = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const { currentUser } = useAppContext() as any;

  useEffect(() => {
    if (userId) {
      getById(userId).then(({ data }: any) => {
        if (data) {
          setUser(data);
        } else {
          setUser(currentUser);
        }
      }).catch(console.error);
    } else {
      setUser(currentUser);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/info" />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              {/* <IonRow className="ion-justify-content-center">
                <IonCol size="6">
                  <img src={(user.picture || defaultAvatar) as any} alt="user avatar" className="user-avatar" />
                </IonCol>
              </IonRow>
              <IonText className="ion-text-center">
                <h4><span className="ion-text-capitalize">{user.fullname}</span><br /><IonText color="medium"><small>@{user.username}</small></IonText></h4>
                <p>
                  {user.experience} years experience <br />
                  {user.rating ? (
                    <Rating rating={user.rating} />
                  ) : (
                      <IonText>No ratings</IonText>
                    )}
                </p>
              </IonText>
              <IonText>
                <p>{user.bio ? user.bio : "No bio"}</p>
              </IonText>
              <IonRow className="ion-justify-content-center">
                <IonCol size="10">
                  <IonButton expand="block" routerLink={`/app/book/${user._id}`}>Book session</IonButton>
                </IonCol>
                <IonCol size="2">
                  <IonButton expand="block">
                    <IonIcon slot="icon-only" icon={heartOutline} />
                  </IonButton>
                </IonCol>
              </IonRow>
              {user.accountType === 'patient' && (
                <div>
                  <IonText>
                    <h6 className="section-title">Struggles</h6>
                  </IonText>
                  {user.conditions.map((c, index) => <IonChip key={index}>{c}</IonChip>)}
                </div>
              )}
              {user.accountType === 'patient' && (
                <div>
                  <ContactCard {...profileData.contact} />
                </div>
              )}
              {['professional', 'institution'].includes(user.accountType) && (
                <div>
                  <IonText>
                    <h6 className="section-title">Speciality</h6>
                  </IonText>
                  {docProfileData.speciality!.map((s, index) => <IonChip key={index}>{s}</IonChip>)}
                </div>
              )} */}
              <div>
                <IonText>
                  <h6 className="section-title">Education</h6>
                </IonText>
                <IonList>
                  {docProfileData.education!.map((sch, index) => <IonItem key={index}>
                    <div className="ion-margin-bottom">
                      <IonLabel className="ion-text-capitalize"><strong>{sch.institution}</strong></IonLabel>
                      <IonText color="medium">
                        {moment(sch.startDate).format("MMM YYYY")} - {sch.endDate ? (moment(sch.endDate).format("MMM YYYY")) : "Current"}
                      </IonText><br />
                      <IonText className="ion-text-capitalize">
                        {sch.areaOfStudy}
                      </IonText>
                    </div>
                  </IonItem>)}
                </IonList>
              </div>
            </IonCol>
            {/* <IonCol></IonCol> */}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}

export default Profile;

function ContactCard({ phone, email }: { phone: string, email: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen(open => !open);

  return (
    <IonCard className="ion-no-margin ion-margin-vertical contact-card">
      <IonCardHeader className="header">
        <IonRow>
          <IonCol className="ion-no-padding">
            <h6 className="ion-no-margin">Contact</h6>
          </IonCol>
          <IonCol className="ion-no-padding ion-text-right">
            <IonIcon icon={isOpen ? caretUp : caretDown} onClick={onToggle} />
          </IonCol>
        </IonRow>
      </IonCardHeader>
      {isOpen && (
        <IonCardContent className="body">
          <div className="contact-row">
            <div><IonIcon icon={call} /></div>
            <div><IonText>{profileData.contact.phone}</IonText></div>
          </div>
          <div className="contact-row">
            <div><IonIcon icon={mail} /></div>
            <div>
              <IonText>
                {profileData.contact.email}
              </IonText>
            </div>
          </div>
        </IonCardContent>
      )}
    </IonCard>
  );
}