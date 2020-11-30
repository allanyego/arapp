import React, { useEffect } from "react";
import { IonButton, IonItem, IonInput, IonGrid, IonText, IonBadge } from "@ionic/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import withEditableFeatures, { EditableProps } from "./withEditableFeatures";
import FormFieldFeedback from "../FormFieldFeedback";
import { editUser } from "../../http/users";
import { useAppContext } from "../../lib/context-lib";
import useToastManager from "../../lib/toast-manager";
import trimAndLower from "../../lib/trim-and-lower";

const specialitySchema = Yup.object({
  speciality: Yup.string().required("This shouldn't be empty."),
});

const Speciality: React.FC<EditableProps> = ({ user, isEditting, setEditting, currentUserId }) => {
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const handleSave = async (values: any, { setSubmitting }: any) => {
    try {
      values.speciality = trimAndLower(values.speciality);
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

  if (currentUserId !== user._id && !user?.speciality) {
    return null;
  }

  return (
    <div>
      <IonText>
        <h6 className="section-title">Speciality</h6 >
      </IonText >
      {isEditting ? (
        <IonGrid>
          <Formik
            validationSchema={specialitySchema}
            onSubmit={handleSave}
            initialValues={{
              speciality: user.speciality || ""
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
                  <IonItem
                    className={touched.speciality && errors.speciality ? "has-error" : ""}
                  >
                    <IonInput
                      name="speciality"
                      placeholder="e.g. social therapist"
                      value={values.speciality}
                      onIonChange={handleChange}
                      onIonBlur={handleBlur}
                    />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "speciality" }} />

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
        </IonGrid>
      ) : user.speciality ? (
        <IonBadge color="dark">
          {user.speciality}
        </IonBadge>
      ) : "---"}
    </div>
  );
}

export default withEditableFeatures(Speciality);