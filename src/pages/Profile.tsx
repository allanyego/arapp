import React, { useState, useEffect } from "react";
import { IonText, IonPage, IonContent, IonChip, IonRow, IonCol, IonGrid, IonButton, IonList, IonItem, IonLabel, IonIcon, IonCard, IonCardHeader, IonCardContent, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonSpinner, IonModal, IonTextarea } from "@ionic/react";
import { caretDown, caretUp, call, mail, chatboxEllipses, heartCircleOutline } from "ionicons/icons";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import defaultAvatar from "../assets/img/default_avatar.jpg";
import "./Profile.css";
import Rating from "../components/Rating";
import { useParams } from "react-router";
import { getById } from "../http/users";
import { useAppContext } from "../lib/context-lib";
import { USER, STORAGE_KEY } from "../http/constants";
import { sendMessage } from "../http/messages";
import useToastManager from "../lib/toast-hook";
import useContacts from "../lib/contacts-lib";
import { setObject } from "../lib/storage";

interface ProfileData {
  _id?: string,
  fullName: string,
  username: string,
  gender: string,
  bio: string,
  conditions: string[],
  accountType: string | null,
  phone: string,
  email: string,
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

const Profile: React.FC = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  useEffect(() => {
    if (userId) {
      getById(userId).then(({ data }: any) => {
        if (data) {
          setUser(data);
        } else {
          setUser(currentUser);
        }
      }).catch(error => onError(error.message));
    } else {
      setUser(currentUser);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app" />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {!user ? (
              <IonCol className="d-flex ion-justify-content-center ion-align-items-center">
                <IonSpinner name="crescent" />
              </IonCol>
            ) : (<UserDetails user={user as any} />)}
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
        <IonRow onClick={onToggle}>
          <IonCol className="ion-no-padding">
            <h6 className="ion-no-margin">Contact</h6>
          </IonCol>
          <IonCol className="ion-no-padding ion-text-right">
            <IonIcon icon={isOpen ? caretUp : caretDown} />
          </IonCol>
        </IonRow>
      </IonCardHeader>
      {isOpen && (
        <IonCardContent className="body">
          <div className="contact-row">
            <div><IonIcon icon={call} /></div>
            <div><IonText>{phone}</IonText></div>
          </div>
          <div className="contact-row">
            <div><IonIcon icon={mail} /></div>
            <div>
              <IonText>
                {email}
              </IonText>
            </div>
          </div>
        </IonCardContent>
      )}
    </IonCard>
  );
}

const messageSchema = Yup.object({
  body: Yup.string().required("Can't send an empty message."),
});

function UserDetails({ user }: { user: ProfileData }) {
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();

  const toggleModal = () => setShowModal(!showModal);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const newMessage = {
        sender: currentUser._id,
        recipient: user._id,
        ...values,
      };

      await sendMessage(newMessage, currentUser.token);
      setSubmitting(false);
      onSuccess("Message sent");
      toggleModal();
    } catch (error) {
      setSubmitting(false);
      onError(error.message);
    }
  };

  return (
    <IonCol>
      <IonModal isOpen={showModal}>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={toggleModal}>Cancel</IonButton>
          </IonButtons>
          <IonTitle className="ion-text-capitalize">{user.fullName}</IonTitle>
        </IonToolbar>
        <IonRow className="h100">
          <IonCol className="ion-align-self-center">
            <IonText>
              <h1>Send new message</h1>
            </IonText>
            <Formik
              validationSchema={messageSchema}
              onSubmit={handleSubmit}
              initialValues={{}}
            >{({
              handleChange,
              handleBlur,
              errors,
              touched,
              isValid,
              isSubmitting
            }: any) => (
                <Form noValidate>
                  <IonItem className={touched.password && errors.password ? "has-error" : ""}>
                    <IonLabel position="floating">Your message</IonLabel>
                    <IonTextarea name="body" rows={4}
                      onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonRow>
                    <IonCol>
                      <IonButton
                        color="dark"
                        expand="block"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                      >{isSubmitting ? "Sending..." : "Send"}</IonButton>
                    </IonCol>
                  </IonRow>
                </Form>
              )}</Formik>
          </IonCol>
        </IonRow>
      </IonModal>

      <IonRow className="ion-justify-content-center">
        <IonCol size="6">
          <img src={(user.picture || defaultAvatar) as any} alt="user avatar" className="user-avatar" />
        </IonCol>
      </IonRow>
      <IonText className="ion-text-center">
        <h4>
          <span className="ion-text-capitalize">{user.fullName}</span><br />
          <IonText color="medium"><small>@{user.username}</small></IonText>
        </h4>
        {user.accountType === USER.ACCOUNT_TYPES.COUNSELLOR && (
          <p>
            {user.experience ? `${user.experience} years experience` : "No experience."} <br />
            {user.rating ? (
              <Rating rating={user.rating} />
            ) : (
                <IonText>No ratings</IonText>
              )}
          </p>
        )}
      </IonText>
      <IonText>
        <p>{user.bio ? user.bio : "No bio"}</p>
      </IonText>
      {user.accountType === USER.ACCOUNT_TYPES.USER && (
        <div>
          <ContactCard phone={user.phone} email={user.email} />
        </div>
      )}
      {user.accountType === USER.ACCOUNT_TYPES.COUNSELLOR && (
        <div>
          {user._id !== currentUser._id && (
            <IonRow className="ion-justify-content-center">
              <IonCol size="10">
                <IonButton color="dark" expand="block" onClick={toggleModal}>
                  Chat
                  <IonIcon slot="end" icon={chatboxEllipses} />
                </IonButton>
              </IonCol>
              <IonCol size="2">
                <IonButton color="light" expand="block">
                  <IonIcon slot="icon-only" icon={heartCircleOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          )}
          <IonText>
            <h6 className="section-title">Speciality</h6>
          </IonText>
          {user.speciality!.map((s, index) => <IonChip key={index}>{s}</IonChip>)}
        </div>
      )}
      <div>
        <IonText>
          <h6 className="section-title">Education</h6>
        </IonText>
        <IonList>
          {user.education!.map((sch, index) => <IonItem key={index}>
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
      {(currentUser._id === user._id) && !currentUser.emergencyContact && (
        <ContactButton />
      )}
    </IonCol>
  );
}

function ContactButton() {
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const pickContact = useContacts();
  const { onError, onSuccess } = useToastManager();

  const onContactPick = async () => {
    try {
      const contact = await pickContact();
      const newUserDetails = {
        ...currentUser,
        emergencyContact: {
          displayName: contact.displayName || contact.name,
          phone: contact.phoneNumbers[0],
        }
      };

      setCurrentUser(newUserDetails);
      await setObject(STORAGE_KEY, {
        currentUser: newUserDetails,
      });
      onSuccess("Emergency contact saved.");
    } catch (error) {
      onError(error.message);
    }
  };

  return (
    <>
      {!currentUser.emergencyContact ? (
        <IonText color="danger">
          Please select your emergency contact.
        </IonText>
      ) : (
          <IonText>
            <span className="ion-text-capitalize">
              {currentUser.emergencyContact.displayName}
            </span> is your current emergency contact.
          </IonText>
        )}
      <IonButton color="dark" expand="block" onClick={onContactPick}>{
        !currentUser.emergencyContact ? "Select" : "Change"
      }</IonButton>
    </>
  );
}