import React from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonText, IonRouterLink, IonItem, IonLabel, IonInput } from '@ionic/react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { signIn } from '../http/users';
import { useAppContext } from '../lib/context-lib';
import { useHistory } from 'react-router';
import { setObject } from '../lib/storage';
import { STORAGE_KEY } from '../http/constants';
import useToastManager from '../lib/toast-hook';

const loginSchema = Yup.object({
  username: Yup.string().required("Enter your username."),
  password: Yup.string().required("Enter your password.")
});

const SignIn: React.FC = () => {
  const { setCurrentUser } = useAppContext() as any;
  const history = useHistory();
  const { onError } = useToastManager();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const { data } = await signIn(values.username.trim(), values.password);
      setSubmitting(false);
      setCurrentUser(data);
      await setObject(STORAGE_KEY, {
        currentUser: data,
      });

      if (data.accountType) {
        history.push("/app");
      } else {
        history.push("/account-type");
      }
    } catch (error) {
      setSubmitting(false);
      onError(error.message);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRow className="h100 ion-text-center">
          <IonCol className="ion-align-self-center">
            <IonText>
              <h1>Sign In</h1>
            </IonText>
            <Formik
              validationSchema={loginSchema}
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
                  <IonItem className={touched.username && errors.username ? "has-error" : ""}>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput name="username" type="text" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonItem className={touched.password && errors.password ? "has-error" : ""}>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput name="password" type="password" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonRow>
                    <IonCol>
                      <IonButton
                        color="dark"
                        expand="block"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                      >{isSubmitting ? "Submitting..." : "Submit"}</IonButton>
                    </IonCol>
                  </IonRow>
                </Form>
              )}</Formik>
            <IonText>
              Don't have an account? <IonRouterLink href="/sign-up">Sign up</IonRouterLink>
            </IonText>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
