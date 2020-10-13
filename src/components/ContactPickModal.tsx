import React, { useState } from "react";
import { IonModal, IonToolbar, IonButtons, IonButton, IonTitle, IonRow, IonCol, IonText } from "@ionic/react";
import { useAppContext } from "../lib/context-lib";
import useToastManager from "../lib/toast-hook";
import useContacts from "../lib/contacts-lib";
import { setObject } from "../lib/storage";
import { STORAGE_KEY } from "../http/constants";

const ContactPickModal: React.FC<any> = ({ show = false }) => {
  const [showModal, setShowModal] = useState(show);
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();
  const pickContact = useContacts();

  const hideModal = () => setShowModal(false);
  const onContactPick = async () => {
    try {
      const contact = await pickContact();
      const newUserDetails = {
        ...currentUser,
        emergencyContact: {
          displayName: contact.displayName || contact.name,
          phone: contact.phoneNumbers[0].value,
        }
      };

      setCurrentUser(newUserDetails);
      await setObject(STORAGE_KEY, {
        currentUser: newUserDetails,
      });
      onSuccess("Emergency contact saved.");
      setShowModal(false);
    } catch (error) {
      onError(error.message);
    }
  };

  return (
    <IonModal isOpen={showModal}>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={hideModal}>Cancel</IonButton>
        </IonButtons>
        <IonTitle>Emergency contact</IonTitle>
      </IonToolbar>
      <IonRow className="h100">
        <IonCol className="ion-align-self-center">
          <IonText>
            <h3>Select a contact you would like to be alerted in case of an emergency.</h3>
          </IonText>
          <IonButton
            color="dark"
            expand="block"
            size="large"
            onClick={onContactPick}
          >Pick</IonButton>

        </IonCol>
      </IonRow>
    </IonModal>
  );
};

export default ContactPickModal;