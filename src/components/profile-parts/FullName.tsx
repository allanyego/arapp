import React, { useEffect } from "react";
import { IonItem, IonInput, IonButton, IonText } from "@ionic/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import withEditableFeatures, { EditableProps } from "./withEditableFeatures";
import FormFieldFeedback from "../FormFieldFeedback";
import { editUser } from "../../http/users";
import { useAppContext } from "../../lib/context-lib";
import useToastManager from "../../lib/toast-manager";
import trimAndLower from "../../lib/trim-and-lower";

const nameSchema = Yup.object({
  fullName: Yup.string().min(2, "Too short").required("Enter your full name"),
});

const FullName: React.FC<EditableProps> = ({ user, isEditting, setEditting }) => {
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const handleSave = async (values: any, { setSubmitting }: any) => {
    try {
      values.fullName = trimAndLower(values.fullName)
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
            fullName: user.fullName,
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
                <IonItem>
                  <IonInput
                    name="fullName"
                    placeholder="e.g. john may"
                    value={values.fullName}
                    onIonChange={handleChange}
                    onIonBlur={handleBlur}
                  />
                </IonItem>
                <FormFieldFeedback {...{ errors, touched, fieldName: "fullName" }} />

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
        <h4 className="ion-text-capitalize" style={{
          marginBottom: 0,
        }}>
          {user.fullName}
        </h4>
      )}
      <h4 style={{
        marginTop: 0,
        marginBottom: 0,
      }}>
        <IonText color="medium"><small>@{user.username}</small></IonText>
      </h4>
    </>
  )
};

export default withEditableFeatures(FullName);