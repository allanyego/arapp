import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonHeader, IonBackButton, IonToolbar, IonTitle, IonGrid, IonRow, IonCard, IonCol, IonText, IonTextarea } from "@ionic/react";
import { attachOutline, callOutline, sendOutline, caretForwardCircle, call, documentAttach } from "ionicons/icons";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "./Thread.css";
import { useParams, useLocation, useHistory } from "react-router";
import { getThreadMessages, sendMessage } from "../http/messages";
import { useAppContext } from "../lib/context-lib";
import useToastManager from "../lib/toast-hook";

const messageSchema = Yup.object({
  body: Yup.string().required("Message can't be blank"),
});

const Thread: React.FC = () => {
  let [messages, setMessages] = useState<any>([]);
  const { threadId } = useParams();
  const { state }: any = useLocation();
  const history = useHistory();
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  useEffect(() => {
    getThreadMessages(threadId, currentUser.token).then(({ data }: any) => {
      setMessages(data || messages);
    }).catch(error => onError(error.message));

    return () => {
      setMessages = () => { };
    };
  }, []);

  if (state && !state.fullName) {
    history.replace("/app/chat");
    return null;
  }

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const recipientField = messages[0].sender._id !== currentUser._id ?
        messages[0].sender._id :
        messages[0].recipient._id;

      const newMessage = {
        thread: messages[0].thread,
        sender: currentUser._id,
        recipient: recipientField,
        ...values,
      };

      await sendMessage(newMessage, currentUser.token);
      setSubmitting(false);
      resetForm({});
      setMessages((msgs: any) => [...msgs, {
        ...newMessage,
        sender: {
          fullName: currentUser.fullName,
          _id: currentUser._id,
        },
        createdAt: Date.now(),
        _id: String(Date.now())
      }]);
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
            <IonBackButton defaultHref="/app/chat" />
          </IonButtons>
          <IonTitle className="ion-text-capitalize">{(state && state.fullName) || "...user..."}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {messages.map((msg: any) => <Message key={msg._id} message={msg} />)}
        </IonGrid>
      </IonContent>
      <IonFooter>
        <Formik
          validationSchema={messageSchema}
          onSubmit={handleSubmit}
          initialValues={{}}
        >
          {({
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
            isSubmitting,
          }: any) => (
              <Form noValidate>
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol size="3" className="ion-no-padding d-flex ion-align-items-center ion-justify-content-start">
                      <IonButtons>
                        <IonButton>
                          <IonIcon slot="icon-only" icon={call} />
                        </IonButton>
                        <IonButton>
                          <IonIcon slot="icon-only" icon={documentAttach} />
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                    <IonCol size="7" className="ion-no-padding d-flex ion-align-items-center message-col">
                      <IonTextarea
                        value={values.body || ""}
                        rows={1}
                        className={`ion-no-margin ${touched.body && errors.body ? "has-error" : ""}`}
                        name="body"
                        onIonChange={handleChange}
                        onIonBlur={handleBlur}
                      />
                    </IonCol>
                    <IonCol size="2" className="ion-no-padding d-flex ion-align-items-center ion-justify-content-center">
                      <IonButtons>
                        <IonButton disabled={!isValid || isSubmitting} type="submit">
                          <IonIcon slot="icon-only" icon={caretForwardCircle} />
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </Form>
            )}
        </Formik>
      </IonFooter>
    </IonPage>
  );
};

export default Thread;

function Message({ message }: any) {
  const { currentUser } = useAppContext() as any;

  return (
    <IonRow className={message.sender._id === currentUser._id ? "ion-justify-content-end" : ""}>
      <IonCol size="7">
        <IonCard className="ion-padding">
          <IonText>
            <h5 className="ion-no-margin ion-text-capitalize">{message.sender.fullName}</h5>
            <p className="ion-no-margin">{message.body}</p>
          </IonText>
          <IonText color="medium"><small className="ion-float-right">{moment(message.createdAt).format('LT')}</small></IonText>
        </IonCard>
      </IonCol>
    </IonRow>
  );
}