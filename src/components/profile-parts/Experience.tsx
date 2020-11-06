import React, { useEffect } from "react";
import { IonButton, IonItem, IonInput } from "@ionic/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import withEditableFeatures, { EditableProps } from "./withEditableFeatures";
import FormFieldFeedback from "../FormFieldFeedback";
import { useAppContext } from "../../lib/context-lib";
import useToastManager from "../../lib/toast-manager";
import { editUser } from "../../http/users";

const experienceSchema = Yup.object({
  experience: Yup.number().min(1, "Minimum 1").max(75, "Too much?"),
});

const Experience: React.FC<EditableProps> = ({ user, isEditting, setEditting, currentUserId }) => {
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const handleSave = async (values: any, { setSubmitting }: any) => {
    try {
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

  if ((currentUser._id !== user._id) && !user?.experience) {
    return null;
  }

  return <>
    {isEditting ? (
      <Formik
        validationSchema={experienceSchema}
        onSubmit={handleSave}
        initialValues={{
          experience: user.experience || undefined,
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
                  type="number"
                  placeholder="Years of experience"
                  name="experience"
                  value={values.experience}
                  onIonChange={handleChange}
                  onIonBlur={handleBlur}
                />
              </IonItem>
              <FormFieldFeedback {...{ errors, touched, fieldName: "experience" }} />

              <div className="d-flex ion-justify-content-end">
                <IonButton
                  type="submit"
                  color="success"
                  size="small"
                  disabled={!isValid || isSubmitting}
                >
                  Save</IonButton>
              </div>
            </Form>
          )}
      </Formik>
    ) :
      (
        <p className="ion-no-margin">
          {user.experience ? `${user.experience} years experience` : "No experience."}
        </p>
      )
    }
  </>
}

export default withEditableFeatures(Experience);