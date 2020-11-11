import React, { useEffect } from 'react';
import { IonButton, IonContent, IonPage, IonRow, IonCol, IonText, IonRouterLink, IonItem, IonLabel, IonInput } from '@ionic/react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { signIn } from '../http/users';
import { useAppContext } from '../lib/context-lib';
import { useHistory } from 'react-router';
import { setObject } from '../lib/storage';
import { STORAGE_KEY, USER } from '../http/constants';
import useToastManager from '../lib/toast-manager';
import useMounted from '../lib/mount-lib';
import FormFieldFeedback from '../components/FormFieldFeedback';

const loginSchema = Yup.object({
  username: Yup.string().required("Enter your username."),
  password: Yup.string().required("Enter your password.")
});

const SignIn: React.FC = () => {
  const { setCurrentUser } = useAppContext() as any;
  const history = useHistory();
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const { data } = await signIn(values.username.trim(), values.password);
      isMounted && setSubmitting(false);
      // Check if user is admin
      if (data.accountType === USER.ACCOUNT_TYPES.ADMIN) {
        return onError("Admin login attempt. Use web app instead.");
      }

      setCurrentUser(data);
      await setObject(STORAGE_KEY, {
        currentUser: data,
      });

      history.push("/app", {
        isFromAuthPage: true,
      });
    } catch (error) {
      isMounted && setSubmitting(false);
      onError(error.message);
    }
  };

  useEffect(() => () => setMounted(false), []);


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
                    <IonInput name="username" type="text" onIonChange={handleChange} onIonBlur={handleBlur}
                      autofocus
                    />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "username" }} />

                  <IonItem className={touched.password && errors.password ? "has-error" : ""}>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput name="password" type="password" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "password" }} />

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
              Don't have an account? <IonRouterLink routerLink="/sign-up">Sign up</IonRouterLink>
            </IonText>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
