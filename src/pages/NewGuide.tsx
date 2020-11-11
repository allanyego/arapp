<<<<<<< HEAD
import React, { useState } from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonRow, IonCol, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText, IonGrid, IonIcon, IonCard, IonList } from "@ionic/react";
=======
import React from "react";
import { IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonRow, IonCol, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonText } from "@ionic/react";
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router";

import { useAppContext } from "../lib/context-lib";
import { addGuide } from "../http/guides";
<<<<<<< HEAD
import useToastManager from "../lib/toast-manager";
import FormFieldFeedback from "../components/FormFieldFeedback";
import { add, close } from "ionicons/icons";
import WordCounter from "../components/WordCounter";

const newGuideSchema = Yup.object({
  title: Yup.string().max(75, "Too long.").required("Enter a title for the guide."),
  body: Yup.string().min(75, "Too short.").max(500, "Too long.")
    .required("Enter body for the guide."),
=======
import useToastManager from "../lib/toast-hook";

const newGuideSchema = Yup.object({
  title: Yup.string().required("Enter a title for the guide."),
  body: Yup.string().required("Enter body for the guide."),
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
  tags: Yup.string(),
});

const NewGuide: React.FC = () => {
<<<<<<< HEAD
  const [links, setLinks] = useState([]);
=======
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
  const { currentUser } = useAppContext() as any;
  const history = useHistory();
  const { onError, onSuccess } = useToastManager();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
<<<<<<< HEAD
      const tags = values.tags.split(",").map((tag: string) => tag.trim());
      await addGuide(currentUser.token, {
        ...values,
        tags: Array.from(new Set(tags)),
        links,
      });
=======
      values.tags = values.tags.trim().split(" ");
      await addGuide(currentUser.token, values);
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
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
<<<<<<< HEAD
          <IonTitle size="small">Post a guide/tip</IonTitle>
=======
          <IonTitle>Enter guide details</IonTitle>
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <IonCol>
            <Formik
              validationSchema={newGuideSchema}
              onSubmit={handleSubmit}
<<<<<<< HEAD
              initialValues={{
                title: "",
                body: "",
                tags: "",
              }}
=======
              initialValues={{}}
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
            >{({
              handleChange,
              handleBlur,
              errors,
<<<<<<< HEAD
              values,
=======
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
              touched,
              isValid,
              isSubmitting
            }: any) => (
                <Form noValidate>
                  <IonItem className={touched.title && errors.title ? "has-error" : ""}>
                    <IonLabel position="floating">Title</IonLabel>
<<<<<<< HEAD
                    <IonInput
                      name="title"
                      type="text"
                      onIonChange={handleChange}
                      onIonBlur={handleBlur}
                      placeholder="e.g. sexual trauma"
                    />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "title" }} />

                  <IonItem className={touched.body && errors.body ? "has-error" : ""}>
                    <IonLabel position="floating">Body</IonLabel>
                    <IonTextarea
                      name="body"
                      rows={10}
                      onIonChange={handleChange} onIonBlur={handleBlur}
                      placeholder="Comprehensive content on the selected title"
                    />
                  </IonItem>
                  <WordCounter
                    min={75}
                    max={500}
                    text={values.body}
                  />
                  <FormFieldFeedback {...{ errors, touched, fieldName: "body" }} />

                  <IonItem className={touched.tags && errors.tags ? "has-error" : ""}>
                    <IonLabel position="floating">Enter tags separated by commas</IonLabel>
                    <IonTextarea
                      name="tags"
                      rows={3}
                      onIonChange={handleChange} onIonBlur={handleBlur}
                      placeholder="e.g. trauma, stress"
                    />
                  </IonItem>

                  <ExternalLinks {...{ links, setLinks }} />

                  <IonRow>
                    <IonCol>
                      <IonButton
                        color="dark"
                        expand="block" type="submit" disabled={!isValid || isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</IonButton>
=======
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
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
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

<<<<<<< HEAD
export default NewGuide;

function ExternalLinks({ links, setLinks }: {
  links: any[],
  setLinks: any
}) {
  const [val, setVal] = useState("");
  const [inputError, setInputError] = useState<null | string>(null);

  const onChange = (e: any) => {
    if (inputError) {
      setInputError(null);
    }

    setVal(e.target.value.trim());
  };
  const isValidLinkText = (linkText: string): boolean => {
    const LINK_REGEX = /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
    const [text, url] = linkText.split(",").map(p => p.trim());
    if (text && url && LINK_REGEX.test(url)) {
      return true;
    }
    return false;
  };

  const handleSubmit = () => {
    if (!val) {
      return setInputError("Cannot be empty");
    }
    if (!isValidLinkText(val)) {
      return setInputError("Invalid text/link combo");
    }

    if (links.includes(val)) {
      return;
    }
    setLinks([val, ...links]);
    setVal("");
  };
  const handleRemove = (link: string) => {
    setLinks([...links.filter(li => li !== link)]);
  };

  return (
    <>
      <IonText color="medium" className="ion-margin-top">
        <small>
          Add links to this guide/post (separate the link text from the url with a comma).{" "}
  For example: <strong>danger zones, https://www....</strong>
        </small>
      </IonText>
      <IonGrid>
        <IonRow>
          <IonCol className="ion-no-padding">
            <IonItem
              className={inputError ? "has-error" : ""}
            >
              <IonLabel position="floating">Link</IonLabel>
              <IonInput
                value={val}
                onIonChange={onChange}
              />
            </IonItem>
            {inputError && (
              <FormFieldFeedback
                errors={{
                  link: inputError,
                }}
                touched={{
                  link: true,
                }}
                fieldName="link"
              />
            )}
          </IonCol>
          <IonCol
            className="ion-no-padding d-flex ion-align-items-center"
            size="2">
            <IonButton
              fill="clear"
              color="success"
              onClick={handleSubmit}
              disabled={!!inputError}
            >
              <IonIcon icon={add} slot="icon-only" />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonList>
        {links.map((link: string, index: any) => {
          const [text, url] = link.split(",").map((li: any) => li.trim());
          const onRemove = () => handleRemove(link);

          return (
            <IonItem key={index}>
              <IonLabel>
                <h4>{text}</h4>
                <p>{url}</p>
              </IonLabel>
              <IonButton slot="end" onClick={onRemove} fill="clear" color="danger">
                <IonIcon slot="icon-only" icon={close} />
              </IonButton>
            </IonItem>
          );
        })}
      </IonList>
    </>
  );
}
=======
export default NewGuide;
>>>>>>> a75637a9998d4d473ca83e2b32c0b83e0b061c22
