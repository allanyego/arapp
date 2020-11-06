import React, { useEffect, useState } from "react";
import { IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonText, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonInput, IonDatetime, IonButton } from "@ionic/react";
import { add, addCircle, close, trash } from "ionicons/icons";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import withEditableFeatures, { EditableProps } from "./withEditableFeatures";
import FormFieldFeedback from "../FormFieldFeedback";
import { editUser } from "../../http/users";
import { useAppContext } from "../../lib/context-lib";
import useToastManager from "../../lib/toast-manager";

const educationSchema = Yup.object({
  institution: Yup.string().required("Enter institution name"),
  areaOfStudy: Yup.string().required("Enter area of study"),
  startDate: Yup.date().max(new Date(), "Start date can't be in the future")
    .required("Select start date"),
  endDate: Yup.date().max(new Date(), "End date can't be in the future")
    .required("Select end date")
    .min(Yup.ref("startDate"), "End date can't be before start date"),
});

const EducationForm: React.FC<{ handleSubmit: any }> = ({ handleSubmit }) => {
  return (
    <Formik
      validationSchema={educationSchema}
      onSubmit={handleSubmit}
      initialValues={{
        institution: "",
        areaOfStudy: "",
        startDate: undefined,
        endDate: undefined,
      }}
    >
      {({
        handleChange,
        handleBlur,
        errors,
        values,
        touched,
        isValid,
        isSubmitting,
      }) => {
        const inputError = Object.keys(errors)[0];

        return (
          <Form noValidate>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonItem
                    className={(touched.institution && errors.institution) ? "has-error" : ""}
                  >
                    <IonLabel position="floating">Institution</IonLabel>
                    <IonInput
                      name="institution"
                      value={values.institution}
                      onIonChange={handleChange}
                      onIonBlur={handleBlur}
                    />
                  </IonItem>
                  <IonItem
                    className={(touched.areaOfStudy && errors.areaOfStudy) ? "has-error" : ""}
                  >
                    <IonLabel position="floating">Area of study</IonLabel>
                    <IonInput
                      name="areaOfStudy"
                      value={values.areaOfStudy}
                      onIonChange={handleChange}
                      onIonBlur={handleBlur}
                    />
                  </IonItem>
                  <IonGrid className="ion-no-padding">
                    <IonRow>
                      <IonCol size="6" className="ion-no-padding" style={{
                        padding: "5px 0"
                      }}>
                        <IonItem
                          className={(touched.startDate && errors.startDate) ? "has-error" : ""}
                        >
                          <IonLabel>Start date</IonLabel>
                          <IonDatetime
                            displayFormat="MM DD YY"
                            name="startDate"
                            value={values.startDate}
                            onIonChange={handleChange}
                            onIonBlur={handleBlur}
                          />
                        </IonItem>
                      </IonCol>
                      <IonCol size="6" className="ion-no-padding" style={{
                        padding: "5px 0 5px 5px"
                      }}>
                        <IonItem
                          className={(touched.endDate && errors.endDate) ? "has-error" : ""}
                        >
                          <IonLabel>End date</IonLabel>
                          <IonDatetime
                            displayFormat="MM DD YY"
                            name="endDate"
                            value={values.endDate}
                            onIonChange={handleChange}
                            onIonBlur={handleBlur}
                          />
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                  {inputError && (
                    <FormFieldFeedback
                      errors={{
                        education: (errors as any)[inputError],
                      }}
                      touched={{
                        education: true,
                      }}
                      fieldName="education"
                    />
                  )}
                </IonCol>
                <IonCol
                  className="ion-no-padding d-flex ion-align-items-center"
                  size="2">
                  <IonButton
                    type="submit"
                    fill="clear"
                    color="success"
                    disabled={!isValid || isSubmitting}
                  >
                    <IonIcon icon={add} slot="icon-only" />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </Form>
        )
      }}
    </Formik>
  );
};

const Inner: React.FC<{
  startDate: any,
  endDate: any,
  institution: any,
  areaOfStudy: any,
  isEditting: boolean,
  onRemove: (arg: any) => any,
}> = ({
  startDate,
  endDate,
  institution,
  areaOfStudy,
  isEditting,
  onRemove,
}) => {
    return (
      <IonItem>
        <div>
          <IonLabel className="ion-text-capitalize"><strong>{institution}</strong></IonLabel>
          <IonText color="medium">
            {moment(startDate).format("MMM YYYY")} - {endDate ? (moment(endDate).format("MMM YYYY")) : "Current"}
          </IonText><br />
          <IonText className="ion-text-capitalize">
            {areaOfStudy}
          </IonText>
        </div>
        <IonButton slot="end" onClick={onRemove} fill="clear" color="danger">
          <IonIcon slot="icon-only" icon={close} />
        </IonButton>
      </IonItem>
    );
  };

const Education: React.FC<EditableProps> = ({ user, isEditting, setEditting, currentUserId }) => {
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const [education, setEducation] = useState<any[] | undefined>(user.education);
  const [isSaving, setSaving] = useState(false);
  const { onError } = useToastManager();

  const handleSubmit = (values: any, { setSubmitting, resetForm }: any) => {
    setEducation([...education, {
      ...values,
      id: Date.now(),
    }]);
    setSubmitting(false);
    resetForm({});
  };

  const handleRemove = (id: string) => () => {
    let temp = education;
    setEducation([...temp!.filter((e: any) => {
      return e._id ? (e._id !== id) : (e.id !== id)
    })]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await editUser(currentUser._id, currentUser.token, {
        education
      });
      setCurrentUser({
        education,
      });
      isEditting && setEditting(false);
    } catch (error) {
      onError(error.message);
    } finally {
      isEditting && setSaving(false);
    }
  };

  useEffect(() => () => setEditting(false), []);

  if (currentUserId !== user._id && !user.education!.length) {
    return null;
  }

  return (
    <div>
      <IonText>
        <h6 className="section-title">Education</h6>
      </IonText>

      {isEditting && (
        <EducationForm {...{ handleSubmit }} />
      )}

      <IonList>
        {education!.map((sch: any) => {
          const key = sch._id || sch.id;

          return (
            <Inner
              {...sch}
              key={key}
              isEditting={isEditting}
              onRemove={handleRemove(key)}
            />
          );
        })}
      </IonList>
      {isEditting && (
        <div className="d-flex ion-justify-content-end">
          <IonButton
            type="submit"
            color="success"
            size="small"
            disabled={isSaving}
            onClick={handleSave}
          >Save</IonButton>
        </div>
      )}
    </div>
  )
};

export default withEditableFeatures(Education);