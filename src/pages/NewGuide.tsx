import React from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonRow, IonCol, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText } from "@ionic/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router";

import { useAppContext } from "../lib/context-lib";
import { addGuide } from "../http/guides";
import useToastManager from "../lib/toast-hook";

const newGuideSchema = Yup.object({
  title: Yup.string().required("Enter a title for the guide."),
  body: Yup.string().required("Enter body for the guide."),
  tags: Yup.string(),
});

const NewGuide: React.FC = () => {
  const { currentUser } = useAppContext() as any;
  const history = useHistory();
  const { onError, onSuccess } = useToastManager();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      values.tags = values.tags.trim().split(" ");
      await addGuide(currentUser.token, values);
      setSubmitting(false);
      onSuccess("Guide posted successfully");
      history.push("/app/guides");
    } catch (error) {
      setSubmitting(false);
      onError(error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/guides" />
          </IonButtons>
          <IonTitle>Enter guide details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <IonCol>
            <Formik
              validationSchema={newGuideSchema}
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
                  <IonItem className={touched.title && errors.title ? "has-error" : ""}>
                    <IonLabel position="floating">Title</IonLabel>
                    <IonInput name="title" type="text" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonItem className={touched.body && errors.body ? "has-error" : ""}>
                    <IonLabel position="floating">Body</IonLabel>
                    <IonTextarea name="body" rows={10}
                      onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonText>

                  </IonText>
                  <IonItem className={touched.tags && errors.tags ? "has-error" : ""}>
                    <IonLabel position="floating">Enter tags separated by spaces</IonLabel>
                    <IonTextarea name="tags" rows={3}
                      onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</IonButton>
                    </IonCol>
                  </IonRow>
                </Form>
              )}</Formik>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default NewGuide;