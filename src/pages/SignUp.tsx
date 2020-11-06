import { IonButton, IonContent, IonPage, IonRow, IonCol, IonText, IonRouterLink, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonDatetime, useIonViewDidEnter, useIonViewWillLeave, IonGrid } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

import { signUp } from '../http/users';
import { useAppContext } from '../lib/context-lib';
import { STORAGE_KEY, USER } from '../http/constants';
import { setObject } from '../lib/storage';
import useToastManager from '../lib/toast-manager';
import useMounted from '../lib/mount-lib';
import { ProfileData } from '../components/Profile';
import FormFieldFeedback from '../components/FormFieldFeedback';
import getCountries from '../http/helpers/get-countries';
import "./SignUp.css";

const signUpSchema = Yup.object({
  fullName: Yup.string().required("Enter your full name."),
  email: Yup.string().email("Enter a valid email.").required("Enter your email."),
  username: Yup.string().required("Enter a username."),
  gender: Yup.mixed().oneOf(["male", "female"]),
  birthday: Yup.date(),
  password: Yup.string().min(8, "Too short.").max(40, "Too long.").required("Enter your password."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Confirm your password."),
  countryCode: Yup.string().required("Select your country code."),
  phone: Yup.string().matches(/^[0-9]{1,}$/, "Invalid phone number.")
    .required("Enter your phone number."),
  accountType: Yup.string().required("Select your account type"),
});

interface Extras {
  password: string
  confirmPassword: string
  countryCode: string
}

const signupInitial: ProfileData & Extras = {
  fullName: "",
  email: "",
  username: "",
  gender: "",
  birthday: "",
  password: "",
  phone: "",
  countryCode: "",
  confirmPassword: "",
  accountType: "",
};

const SignUp: React.FC = () => {
  const { setCurrentUser } = useAppContext() as any;
  const [countries, setCountries] = useState([]);
  const history = useHistory()
  const { onError, onSuccess } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const { countryCode, phone, confirmPassword, ...rest } = values;
      rest.phone = `+${countryCode + phone}`;
      const { data } = await signUp(rest);
      setCurrentUser(data);
      isMounted && setSubmitting(false);
      await setObject(STORAGE_KEY, {
        currentUser: data,
      });
      onSuccess("Welcome @" + values.username);
      history.push("/app", {
        isFromAuthPage: true,
      });
    } catch (error) {
      isMounted && setSubmitting(false);
      onError(error.message);
    }
  };
  const _fetchCountries = async () => {
    try {
      const _countries = await getCountries();
      isMounted && setCountries(_countries);
    } catch (error) {
      onError(error.message)
    }
  };

  useEffect(() => {
    setMounted(true);
    _fetchCountries();

    return () => setMounted(false);
  }, []);

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
              initialValues={signupInitial}
            >{({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              isValid,
              isSubmitting,
            }) => (
                <Form noValidate>
                  <IonItem className={touched.fullName && errors.fullName ? "has-error" : ""}>
                    <IonLabel position="floating">Full name</IonLabel>
                    <IonInput type="text" name="fullName" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "fullName" }} />

                  <IonItem className={touched.email && errors.email ? "has-error" : ""}>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput type="email" name="email" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "email" }} />

                  <IonItem className={touched.username && errors.username ? "has-error" : ""}>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput type="text" name="username" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "username" }} />

                  <IonItem className={touched.accountType && errors.accountType ? "has-error" : ""}>
                    <IonLabel>Account type</IonLabel>
                    <IonSelect name="accountType" onIonChange={handleChange} onIonBlur={handleBlur}>
                      {Object.keys(USER.ACCOUNT_TYPES).map((type: string, index: number) => (
                        <IonSelectOption key={index} value={type}>{type}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "accountType" }} />

                  {(values.accountType !== USER.ACCOUNT_TYPES.HEALTH_FACILITY) && (
                    <IonRow>
                      <IonCol>
                        <IonItem className={touched.gender && errors.gender ? "has-error" : ""}>
                          <IonLabel>Gender</IonLabel>
                          <IonSelect name="gender" onIonChange={handleChange} onIonBlur={handleBlur}>
                            <IonSelectOption value="female">Female</IonSelectOption>
                            <IonSelectOption value="male">Male</IonSelectOption>
                          </IonSelect>
                        </IonItem>
                        <FormFieldFeedback {...{ errors, touched, fieldName: "gender" }} />
                      </IonCol>
                      <IonCol>
                        <IonItem className={touched.birthday && errors.birthday ? "has-error" : ""}>
                          <IonLabel>Birthday</IonLabel>
                          <IonDatetime displayFormat="MM DD YY" name="birthday" onIonChange={handleChange} onIonBlur={handleBlur} />
                        </IonItem>
                        <FormFieldFeedback {...{ errors, touched, fieldName: "birthday" }} />
                      </IonCol>
                    </IonRow>
                  )}

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
                      <FormFieldFeedback {...{ errors, touched, fieldName: "countryCode" }} />
                    </IonCol>

                    <IonCol>
                      <IonGrid className="ion-no-padding">
                        <IonRow>
                          <IonCol size="3">
                            <IonItem className="h100 country-code-preview">
                              <IonLabel>{values.countryCode || "---"}</IonLabel>
                            </IonItem>
                          </IonCol>
                          <IonCol size="9">
                            <IonItem className={touched.phone && errors.phone ? "has-error" : ""}
                              disabled={!values.countryCode || !!errors.countryCode}
                            >
                              <IonLabel position="floating">Phone number (exclusive country code)</IonLabel>
                              <IonInput name="phone" onIonChange={handleChange} onIonBlur={handleBlur} />
                            </IonItem>
                          </IonCol>
                        </IonRow>
                        <FormFieldFeedback {...{ errors, touched, fieldName: "phone" }} />
                      </IonGrid>
                    </IonCol>
                  </IonRow>

                  <IonItem className={touched.password && errors.password ? "has-error" : ""}>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput type="password" name="password" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "password" }} />

                  <IonItem className={touched.confirmPassword && errors.confirmPassword ? "has-error" : ""}>
                    <IonLabel position="floating">Confirm password</IonLabel>
                    <IonInput type="password" name="confirmPassword" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "confirmPassword" }} />

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
