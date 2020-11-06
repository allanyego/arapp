import React, { useState } from "react";
import { IonModal, IonToolbar, IonButtons, IonButton, IonTitle, IonRow, IonCol, IonText } from "@ionic/react";
import { useAppContext } from "../lib/context-lib";
import useToastManager from "../lib/toast-manager";
import useContacts from "../lib/contacts-lib";

const ContactPickModal: React.FC<{
  isOpen?: boolean,
}> = ({ isOpen = false }) => {
  const [showModal, setShowModal] = useState(isOpen);
  const { setCurrentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();
  const pickContact = useContacts();

  const hideModal = () => setShowModal(false);
  const onContactPick = async () => {
    try {
      const contact = await pickContact();

      setCurrentUser({
        emergencyContact: {
          displayName: contact.displayName || contact.name,
          phone: contact.phoneNumbers[0].value,
        }
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
          <IonButton onClick={hideModal} color="danger">Close</IonButton>
        </IonButtons>
        <IonTitle size="small">
          <strong>
            PICK emergency contact
          </strong>
        </IonTitle>
      </IonToolbar>
      <IonRow className="h100">
        <IonCol className="ion-align-self-center">
          <IonText>
            <h3>Select a contact you would like to be alerted in case of an emergency.</h3>
            <IonText color="danger">
              <p className="ion-text-center">
                <strong>Make sure contact includes the country code!</strong>
              </p>
            </IonText>
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