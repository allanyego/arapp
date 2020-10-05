import React from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonRow, IonCol, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText } from "@ionic/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAppContext } from "../lib/context-lib";
import { addCondition } from "../http/conditions";
import { useHistory } from "react-router";

const newConditionSchema = Yup.object({
  name: Yup.string().required("Enter a name for this condition."),
  description: Yup.string().required("Enter condition description."),
  symptoms: Yup.string().required("Enter some symptoms."),
  remedies: Yup.string().required("Enter some remedies."),
});

const NewCondition: React.FC = () => {
  const { currentUser } = useAppContext() as any;
  const history = useHistory();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await addCondition(currentUser.token, values);
      setSubmitting(false);
      history.push("/app/info");
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/infor" />
          </IonButtons>
          <IonTitle>Enter condition details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <IonCol>
            <Formik
              validationSchema={newConditionSchema}
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
                  <IonItem className={touched.name && errors.name ? "has-error" : ""}>
                    <IonLabel position="floating">Name</IonLabel>
                    <IonInput name="name" type="text" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonItem className={touched.description && errors.description ? "has-error" : ""}>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonTextarea name="description" rows={3}
                      placeholder={'one\ntwo\nthree\nfour'} onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonText>
                    Write each symptom in a new line
            </IonText>
                  <IonItem className={touched.symptoms && errors.symptoms ? "has-error" : ""}>
                    <IonLabel position="floating">Symptoms</IonLabel>
                    <IonTextarea name="symptoms" rows={3}
                      placeholder={'one\ntwo\nthree\nfour'} onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonText>
                    Write each remedy in a new line
            </IonText>
                  <IonItem className={touched.remedies && errors.remedies ? "has-error" : ""}>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonTextarea name="remedies" rows={3}
                      placeholder={'one\ntwo\nthree\nfour'} onIonChange={handleChange} onIonBlur={handleBlur} />
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

export default NewCondition;