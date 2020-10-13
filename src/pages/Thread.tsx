import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonHeader, IonBackButton, IonToolbar, IonTitle, IonGrid, IonRow, IonCard, IonCol, IonText, IonTextarea, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { caretForwardCircle, call, documentAttach } from "ionicons/icons";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "./Thread.css";
import { useParams, useLocation, useHistory } from "react-router";
import { getThreadMessages, sendMessage } from "../http/messages";
import { useAppContext } from "../lib/context-lib";
import useToastManager from "../lib/toast-hook";
import LoaderFallback from "../components/LoaderFallback";

const messageSchema = Yup.object({
  body: Yup.string().required("Message can't be blank"),
});

const Thread: React.FC = () => {
  let [messages, setMessages] = useState<any[] | null>(null);
  const { threadId } = useParams();
  const { state }: any = useLocation();
  const history = useHistory();
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  useIonViewDidEnter(() => {
    getThreadMessages(threadId, currentUser.token).then(({ data }: any) => {
      setMessages(data);
    }).catch(error => {
      onError(error.message);
      history.replace("/app/chat");
    });

    return () => {
      setMessages = () => { };
    };
  });

  useEffect(() => () => {
    setMessages = () => null;
  }, []);

  if (state && !state.fullName) {
    history.replace("/app/chat");
    return null;
  }

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const aMessage = (messages as any[])[0];
      const recipientField = aMessage.sender._id !== currentUser._id ?
        aMessage.sender._id :
        aMessage.recipient._id;

      const newMessage = {
        thread: aMessage.thread,
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
        {!messages ? (
          <LoaderFallback />
        ) : (
            <IonGrid>
              {messages.map((msg: any) => <Message key={msg._id} message={msg} />)}
            </IonGrid>
          )}
      </IonContent>
      <IonFooter className="inbox-box-footer">
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
                <IonGrid className="ion-no-padding message-form-grid">
                  <IonRow>
                    <IonCol
                      size="4"
                      className="ion-no-padding d-flex ion-align-items-center ion-justify-content-start">
                      <IonButtons>
                        <IonButton size="small">
                          <IonIcon slot="icon-only" icon={call} />
                        </IonButton>
                        <IonButton size="small">
                          <IonIcon slot="icon-only" icon={documentAttach} />
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                    <IonCol size="6" className="ion-no-padding d-flex ion-align-items-center message-col">
                      <IonTextarea
                        value={values.body || ""}
                        rows={1}
                        className={`ion-no-margin message-input ${touched.body && errors.body ? "has-error" : ""}`}
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