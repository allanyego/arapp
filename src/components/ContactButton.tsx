import { IonButton, IonIcon, IonText } from "@ionic/react";
import { alertCircle, create } from "ionicons/icons";
import React from "react";
import { STORAGE_KEY } from "../http/constants";
import useContacts from "../lib/contacts-lib";
import { useAppContext } from "../lib/context-lib";
import { setObject } from "../lib/storage";
import useToastManager from "../lib/toast-manager";

export default function ContactButton() {
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
          phone: contact.phoneNumbers[0].value,
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
              Current emergency contact. <br />
              <div className="ion-padding-start">
                <strong>{currentUser.emergencyContact.displayName}</strong><br />
                <strong>{currentUser.emergencyContact.phone}</strong>
              </div>
            </span>
          </IonText>
        )}
      <IonButton color="dark" expand="block" onClick={onContactPick}>
        {
          <>
            {!currentUser.emergencyContact ? "Select" : "Change"}
            < IonIcon slot="end" icon={!currentUser.emergencyContact ? alertCircle : create} />
          </>
        }
      </IonButton>
    </>
  );
}