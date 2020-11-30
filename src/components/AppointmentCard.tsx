import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import CollapsibleCard from "./CollapsibleCard";
import { IonButton, IonCol, IonDatetime, IonInput, IonItem, IonLabel, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import FormFieldFeedback from "./FormFieldFeedback";
import useMounted from "../lib/mount-lib";
import useToastManager from "../lib/toast-manager";
import { useParams } from "react-router";
import { postAppointment } from "../http/appointments";
import { useAppContext } from "../lib/context-lib";

const durations = [1, 2, 3, 4];

const appointmentSchema = Yup.object({
  subject: Yup.string().required("Enter subject."),
  date: Yup.date().required("Select preferred date."),
  time: Yup.string().required("Select desired time."),
  duration: Yup.number().required("Select duration of appointment"),
});

const AppointmentForm: React.FC = () => {
  const { userId } = useParams<any>();
  const { isMounted, setMounted } = useMounted();
  const { onError, onSuccess } = useToastManager();
  const { currentUser } = useAppContext() as any;

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      await postAppointment(userId, currentUser.token, values);
      if (isMounted) {
        setSubmitting(false);
        resetForm({});
      }
      onSuccess("Great. Appointment booked.");
    } catch (error) {
      isMounted && setSubmitting(false);
      onError(error.message);
    }
  };

  useEffect(() => () => setMounted(false), []);

  return (
    <Formik
      validationSchema={appointmentSchema}
      onSubmit={handleSubmit}
      initialValues={{
        subject: "",
        date: "",
        time: "",
        duration: "",
      }}
    >
      {({
        handleChange,
        handleBlur,
        errors,
        touched,
        isValid,
        values,
        isSubmitting,
      }) => (
          <Form noValidate>
            <IonItem className={touched.subject && errors.subject ? "has-error" : ""}>
              <IonLabel position="floating">Subject</IonLabel>
              <IonInput
                value={values.subject}
                type="text"
                name="subject"
                onIonChange={handleChange}
                onIonBlur={handleBlur}
              />
            </IonItem>
            <FormFieldFeedback {...{ errors, touched, fieldName: "subject" }} />

            <IonItem className={touched.date && errors.date ? "has-error" : ""}>
              <IonLabel>Date</IonLabel>
              <IonDatetime
                value={values.date}
                displayFormat="MM DD YY" name="date" onIonChange={handleChange} onIonBlur={handleBlur} />
            </IonItem>
            <FormFieldFeedback {...{ errors, touched, fieldName: "date" }} />

            <IonItem className={touched.time && errors.time ? "has-error" : ""}>
              <IonLabel>Time</IonLabel>
              <IonDatetime
                value={values.time}
                displayFormat="hh:mm"
                name="time" onIonChange={handleChange} onIonBlur={handleBlur}
              />
            </IonItem>
            <FormFieldFeedback {...{ errors, touched, fieldName: "time" }} />

            <IonItem className={touched.duration && errors.duration ? "has-error" : ""}>
              <IonLabel>Duration</IonLabel>
              <IonSelect
                value={values.duration}
                name="duration" onIonChange={handleChange} onIonBlur={handleBlur}>
                {durations.map((duration) => (
                  <IonSelectOption key={duration} value={duration}>
                    {duration + (duration > 1 ? "hrs" : "hr")}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <FormFieldFeedback {...{ errors, touched, fieldName: "duration" }} />

            <IonRow>
              <IonCol>
                <IonButton
                  color="dark"
                  expand="block"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                >{isSubmitting ? "Booking..." : "Book"}</IonButton>
              </IonCol>
            </IonRow>
          </Form>
        )}
    </Formik>
  );
};

const AppointmentCard: React.FC = () => {
  return (
    <CollapsibleCard headerText="Book appointment" noPadding>
      <IonText color="medium" className="ion-margin-horizontal">
        <small>Fill form below to book an appointment</small>
      </IonText>
      <AppointmentForm />
    </CollapsibleCard>
  );
};

export default AppointmentCard;