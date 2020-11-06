import React, { useEffect } from "react";
import { IonText, IonTextarea, IonItem, IonButton } from "@ionic/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import withEditableFeatures from "./withEditableFeatures";
import { EditableProps } from "./withEditableFeatures";
import useToastManager from "../../lib/toast-manager";
import { useAppContext } from "../../lib/context-lib";
import useMounted from "../../lib/mount-lib";
import { editUser } from "../../http/users";
import FormFieldFeedback from "../FormFieldFeedback";
import sleep from "../../lib/sleep";
import WordCounter from "../WordCounter";

const bioSchema = Yup.object({
  bio: Yup.string().min(15, "Some more").max(150, "Too long"),
});

const Bio: React.FC<EditableProps> = ({ user, isEditting, setEditting, currentUserId }) => {
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

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

  if (currentUserId !== user._id && !user.bio) {
    return null;
  }

  return isEditting ? (
    <Formik
      validationSchema={bioSchema}
      onSubmit={handleSave}
      initialValues={{
        bio: user.bio || "",
      }}
    >
      {({
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
      }) => (
          <Form noValidate>
            <IonItem>
              <IonTextarea
                name="bio"
                placeholder="Something interesting about you"
                rows={3}
                value={values.bio}
                onIonChange={handleChange}
                onIonBlur={handleBlur}
              />
            </IonItem>
            <WordCounter
              min={15}
              max={150}
              text={values.bio}
            />
            <FormFieldFeedback {...{ errors, touched, fieldName: "bio" }} />

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
  ) :
    <IonText>
      <p>{user.bio ? user.bio : "No bio"}</p>
    </IonText>;
};

export default withEditableFeatures(Bio);