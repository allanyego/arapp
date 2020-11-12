import { IonButton, IonCard, IonCol, IonIcon, IonInput, IonItem, IonLabel, IonRow, IonSpinner, IonText } from "@ionic/react";
import { alertCircle, create } from "ionicons/icons";
import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { REGEX, STORAGE_KEY } from "../http/constants";
import useContacts from "../lib/contacts-lib";
import { useAppContext } from "../lib/context-lib";
import { setObject } from "../lib/storage";
import useToastManager from "../lib/toast-manager";
import Centered from "./Centered";
import FormFieldFeedback from "./FormFieldFeedback";

const contactSchema = Yup.object({
  displayName: Yup.string().required("Enter contact display name."),
  phone: Yup.string().matches(REGEX.PHONE).required("Enter phone number."),
});

export default function ContactButton() {
  const [showForm, setShowForm] = useState(false);
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
  const toggleForm = () => setShowForm(!showForm);
  const closeForm = () => setShowForm(false);
  const onSaveContact = (values: any, { setSubmitting }: any) => {
    setCurrentUser({
      emergencyContact: {
        displayName: values.displayName.trim(),
        phone: values.phone.trim(),
      }
    });
    setSubmitting(false);
    closeForm();
  };

  const initialFormValues = currentUser.emergencyContact || {
    name: "",
    description: ""
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

      <Centered>
        <IonButton onClick={toggleForm} fill="clear" color="medium" size="small">
          {showForm ? "Close" : "Enter manually"}
        </IonButton>
      </Centered>

      {showForm && (
        <IonCard>
          <Formik
            validationSchema={contactSchema}
            onSubmit={onSaveContact}
            initialValues={initialFormValues}
          >
            {({
              handleChange,
              handleBlur,
              errors,
              touched,
              isValid,
              isSubmitting,
            }) => (
                <Form noValidate>
                  <IonItem className={touched.displayName && errors.displayName ? "has-error" : ""}>
                    <IonLabel position="floating">Display name</IonLabel>
                    <IonInput name="displayName" type="text" onIonChange={handleChange} onIonBlur={handleBlur}
                      autofocus
                    />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "displayName" }} />

                  <IonItem className={touched.phone && errors.phone ? "has-error" : ""}>
                    <IonLabel position="floating">Phone</IonLabel>
                    <IonInput name="phone" type="text" onIonChange={handleChange} onIonBlur={handleBlur}
                      autofocus
                    />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "phone" }} />

                  <IonRow>
                    <IonCol>
                      <IonButton
                        color="light"
                        expand="block"
                        disabled={isSubmitting}
                        onClick={closeForm}
                      >Close</IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton
                        color="dark"
                        expand="block"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                      >{isSubmitting ?
                        <IonSpinner name="lines-small" /> :
                        "Save"}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </Form>
              )}
          </Formik>
        </IonCard>
      )}
    </>
  );
}