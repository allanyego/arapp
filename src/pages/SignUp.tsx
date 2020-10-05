import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonText, IonRouterLink, IonInput, IonItem, IonLabel, IonItemDivider, IonSelect, IonSelectOption, IonDatetime } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { signUp } from '../http/users';
import { useAppContext } from '../lib/context-lib';
import { STORAGE_KEY } from '../http/constants';
import { setObject } from '../lib/storage';

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
  countryCode: Yup.string().required("Select your country code."),
  phone: Yup.string().matches(/^[0-9]{1,}$/, "Invalid phone number.")
    .required("Enter your phone number."),
});

const COUNTRIES_URL = "https://restcountries.eu/rest/v2/all?fields=callingCodes;name";

const SignUp: React.FC = () => {
  const { setCurrentUser } = useAppContext() as any;
  const [countries, setCountries] = useState([]);
  const history = useHistory()

  useEffect(() => {
    fetch(COUNTRIES_URL).then(async res => {
      setCountries(await res.json());
    }).catch(console.error);
  }, []);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const { countryCode, phone, ...rest } = values;
      rest.phone = countryCode + phone;
      const { data } = await signUp(rest);
      setCurrentUser(data);
      setSubmitting(false);
      history.push("/account-type");
      await setObject(STORAGE_KEY, {
        currentUser: data,
      });
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
                  <IonRow>
                    <IonCol>
                      <IonItem className={touched.countryCode && errors.countryCode ? "has-error" : ""}>
                        <IonLabel position="floating">Country Code</IonLabel>
                        <IonSelect name="countryCode" onIonChange={handleChange} onIonBlur={handleBlur}>
                          {countries.map(
                            (c: any, i) => (
                              <IonSelectOption
                                key={i}
                                value={c.callingCodes[0]}
                              >{`(${c.callingCodes[0]}) ${c.name}`}</IonSelectOption>
                            )
                          )}
                        </IonSelect>
                      </IonItem>
                    </IonCol>
                    <IonCol>
                      <IonItem className={touched.phone && errors.phone ? "has-error" : ""}>
                        <IonLabel position="floating">Phone number (exclusive country code)</IonLabel>
                        <IonInput name="phone" onIonChange={handleChange} onIonBlur={handleBlur} />
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
              Already have an account? <IonRouterLink href="/sign-in">Sign in</IonRouterLink>
            </IonText>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
