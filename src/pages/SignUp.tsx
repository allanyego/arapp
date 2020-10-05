import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonText, IonRouterLink, IonInput, IonItem, IonLabel, IonItemDivider, IonSelect, IonSelectOption, IonDatetime } from '@ionic/react';
import React from 'react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { signUp } from '../http/users';
import { useAppContext } from '../lib/context-lib';

const signUpSchema = Yup.object({
  fullName: Yup.string().required("Enter your full name."),
  email: Yup.string().email("Enter a valid email.").required("Enter your email."),
  username: Yup.string().required("Enter a username."),
  gender: Yup.mixed().oneOf(["male", "female"]).required("Select your gender."),
  birthday: Yup.date().required("Enter your birthday."),
  password: Yup.string().min(8, "Too short.").max(40, "Too long.").required("Enter your password."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Confirm your password."),
});

const SignUp: React.FC = () => {
  const { setCurrentUser } = useAppContext() as any;
  const history = useHistory()

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const user = await signUp(values);
      setCurrentUser(user);
      setSubmitting(false);
      history.push("/account-type");
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonRow className="h100 ion-text-center">
          <IonCol className="ion-align-self-center">
            <IonText>
              <h1>Sign Up</h1>
            </IonText>
            <Formik
              validationSchema={signUpSchema}
              onSubmit={handleSubmit}
              initialValues={{}}
            >{({
              handleChange,
              handleBlur,
              errors,
              touched,
              isValid,
              isSubmitting,
            }: any) => (
                <Form noValidate>
                  <IonItem className={touched.fullName && errors.fullName ? "has-error" : ""}>
                    <IonLabel position="floating">Full name</IonLabel>
                    <IonInput type="text" name="fullName" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonItem className={touched.email && errors.email ? "has-error" : ""}>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput type="email" name="email" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonItem className={touched.username && errors.username ? "has-error" : ""}>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput type="text" name="username" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonRow>
                    <IonCol>
                      <IonItem className={touched.gender && errors.gender ? "has-error" : ""}>
                        <IonLabel>Gender</IonLabel>
                        <IonSelect name="gender" onIonChange={handleChange} onIonBlur={handleBlur}>
                          <IonSelectOption value="female">Female</IonSelectOption>
                          <IonSelectOption value="male">Male</IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                    <IonCol>
                      <IonItem className={touched.birthday && errors.birthday ? "has-error" : ""}>
                        <IonLabel>Birthday</IonLabel>
                        <IonDatetime displayFormat="MM DD YY" name="birthday" onIonChange={handleChange} onIonBlur={handleBlur} />
                      </IonItem>
                    </IonCol>
                  </IonRow>
                  <IonItem className={touched.password && errors.password ? "has-error" : ""}>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput type="password" name="password" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonItem className={touched.confirmPassword && errors.confirmPassword ? "has-error" : ""}>
                    <IonLabel position="floating">Confirm password</IonLabel>
                    <IonInput type="password" name="confirmPassword" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</IonButton>
                    </IonCol>
                  </IonRow>
                </Form>
              )}</Formik>
            <IonText>
              Already have an account? <IonRouterLink href="/sign-in">Sign in</IonRouterLink>
            </IonText>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
