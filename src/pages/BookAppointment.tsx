import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonText, IonItem, IonDatetime, IonLabel, IonRow, IonCol, IonButton, IonInput, IonList, IonRadioGroup, IonListHeader, IonRadio } from "@ionic/react";
import { useRouteMatch, useHistory } from "react-router";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { APPOINTMENT } from "../http/constants";
import { getById } from "../http/users";
import { useAppContext } from "../lib/context-lib";
import { post } from "../http/appointments";

const { ONSITE_CONSULTATION, VIRTUAL_CONSULTATION, ONSITE_TESTS } = APPOINTMENT.TYPES;
const appointmentSchema = Yup.object({
  subject: Yup.string().required("Enter subject."),
  date: Yup.date().required("Select preferred date."),
  time: Yup.string().required("Select desired time."),
  type: Yup.string().oneOf([
    VIRTUAL_CONSULTATION,
    ONSITE_CONSULTATION,
    ONSITE_TESTS
  ]).required("Select the type of appointment"),
});

export default function BookAppointment() {
  const { professionalId } = useRouteMatch() as any;
  const [professional, setProfessional] = useState<any>(null);
  const history = useHistory();
  const { currentUser } = useAppContext() as any;

  useEffect(() => {
    getById(professionalId).then(({ data }) => {
      if (data && data.username) {
        setProfessional(data);
      } else {
        history.replace("/professionals");
      }

    }).catch(console.error);
  }, []);

  if (!professionalId) {
    history.replace("/app/professionals");
  }

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const { data } = await post(professionalId, currentUser.token, {
        patient: currentUser._id,
        ...values,
      });
      setSubmitting(false);
      history.goBack();
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Book appointment</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div>
          <Formik
            validationSchema={appointmentSchema}
            onSubmit={handleSubmit}
            initialValues={{}}
          >
            {({
              handleChange,
              handleBlur,
              errors,
              touched,
              isValid,
              isSubmitting,
            }: any) => (
                <Form noValidate>
                  <IonItem className={touched.subject && errors.subject ? "has-error" : ""}>
                    <IonLabel position="floating">Subject</IonLabel>
                    <IonInput type="text" name="subject" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonText>
                    <h4>Choose a date you would like to see <strong>{professional.fullName}</strong></h4>
                  </IonText>
                  <IonItem className={touched.date && errors.date ? "has-error" : ""}>
                    <IonLabel>Select date</IonLabel>
                    <IonDatetime displayFormat="MM DD YY" name="date" onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <IonItem className={touched.time && errors.time ? "has-error" : ""}>
                    <IonLabel>Time</IonLabel>
                    <IonDatetime displayFormat="hh:mm"
                      name="time" onIonChange={handleChange} onIonBlur={handleBlur}
                    />
                  </IonItem>
                  <IonList>
                    <IonRadioGroup className={touched.type && errors.type ? "has-error" : ""}
                      name="type" onIonChange={handleChange} onBlur={handleBlur}
                    >
                      <IonListHeader>
                        <IonLabel>Appointment type</IonLabel>
                      </IonListHeader>

                      <IonItem>
                        <IonLabel>Onsite consultation</IonLabel>
                        <IonRadio slot="start" value={ONSITE_CONSULTATION} />
                      </IonItem>
                      <IonItem>
                        <IonLabel>Virtual consultation</IonLabel>
                        <IonRadio slot="start" value={VIRTUAL_CONSULTATION} />
                      </IonItem>
                      <IonItem>
                        <IonLabel>Onsite tests</IonLabel>
                        <IonRadio slot="start" value={ONSITE_TESTS} />
                      </IonItem>
                    </IonRadioGroup>
                  </IonList>
                  <IonRow>
                    <IonCol>
                      <IonButton expand="block" type="submit"
                        disabled={!isValid || isSubmitting}
                      >{isSubmitting ? "Booking..." : "Book"}</IonButton>
                    </IonCol>
                  </IonRow>
                </Form>
              )}
          </Formik>
        </div>
      </IonContent>
    </IonPage>
  );
}