import React, { useEffect } from "react";
import { IonItem, IonInput, IonButton, IonText, IonIcon } from "@ionic/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import withEditableFeatures, { EditableProps } from "./withEditableFeatures";
import FormFieldFeedback from "../FormFieldFeedback";
import { editUser } from "../../http/users";
import { useAppContext } from "../../lib/context-lib";
import useToastManager from "../../lib/toast-manager";
import { call, mail } from "ionicons/icons";
import { REGEX } from "../../http/constants";

const nameSchema = Yup.object({
  email: Yup.string().email("Enter a valid email.").required("Enter your email."),
  phone: Yup.string().matches(REGEX.PHONE, "Invalid phone number.")
    .required("Enter your phone number."),
});

const ContactInfo: React.FC<EditableProps> = ({ user, isEditting, setEditting }) => {
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const handleSave = async (values: any, { setSubmitting }: any) => {
    try {
      values.phone = values.phone.trim();
      values.email = values.email.trim();
      await editUser(currentUser._id, currentUser.token, values);
      setCurrentUser(values);
      isEditting && setEditting(false);
    } catch (error) {
      onError(error.message);
    } finally {
      isEditting && setSubmitting(false);
    }
  };

  useEffect(() => () => setEditting(false), []);

  return (
    <>
      {isEditting && (
        <Formik
          validationSchema={nameSchema}
          onSubmit={handleSave}
          initialValues={{
            phone: user.phone,
            email: user.email,
          }}
        >
          {({
            handleChange,
            handleBlur,
            errors,
            values,
            touched,
            isValid,
            isSubmitting,
          }) => (
              <Form noValidate>
                <IonItem className={touched.phone && errors.phone ? "has-error" : ""}>
                  <IonInput
                    name="phone"
                    value={values.phone}
                    onIonChange={handleChange}
                    onIonBlur={handleBlur}
                    placeholder="e.g. +254700000000"
                  />
                </IonItem>
                <FormFieldFeedback {...{ errors, touched, fieldName: "phone" }} />

                <IonItem className={touched.email && errors.email ? "has-error" : ""}>
                  <IonInput
                    type="email"
                    name="email"
                    value={values.email}
                    onIonChange={handleChange}
                    onIonBlur={handleBlur}
                    placeholder="e.g. mike@mail.com"
                  />
                </IonItem>
                <FormFieldFeedback {...{ errors, touched, fieldName: "email" }} />

                <div className="d-flex ion-justify-content-end">
                  <IonButton
                    type="submit"
                    color="success"
                    size="small"
                    disabled={!isValid || isSubmitting}
                  >Save</IonButton>
                </div>
              </Form>
            )}
        </Formik>
      )}
      {!isEditting && (
        <>
          <div className="contact-row">
            <div><IonIcon icon={call} /></div>
            <div><IonText>{user.phone}</IonText></div>
          </div>
          <div className="contact-row">
            <div><IonIcon icon={mail} /></div>
            <div>
              <IonText>
                {user.email}
              </IonText>
            </div>
          </div>
        </>
      )}
    </>
  )
};

export default withEditableFeatures(ContactInfo);