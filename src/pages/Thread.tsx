import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonHeader, IonBackButton, IonToolbar, IonTitle, IonGrid, IonRow, IonCard, IonCol, IonText, IonTextarea, useIonViewDidEnter, useIonViewWillLeave } from "@ionic/react";
import { arrowForwardCircle } from "ionicons/icons";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "./Thread.css";
import { useParams, useLocation, useHistory } from "react-router";
import { getThreadMessages, sendMessage } from "../http/messages";
import { useAppContext } from "../lib/context-lib";
import useToastManager from "../lib/toast-manager";
import LoaderFallback from "../components/LoaderFallback";
import useMounted from "../lib/mount-lib";

const messageSchema = Yup.object({
  body: Yup.string().required("Message can't be blank"),
});

const Thread: React.FC = () => {
  let [messages, setMessages] = useState<any[] | null>(null);
  const { threadId } = useParams<any>();
  const { state }: any = useLocation();
  const history = useHistory();
  const { currentUser, socket } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();
  const { onError } = useToastManager();

  const addMessage = (msg: any) => {
    isMounted && setMessages((msgs: any) => [
      ...msgs, msg,
    ]);
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const newMessage = {
        thread: threadId,
        sender: currentUser._id,
        ...values,
      };

      if (!state?.name) {
        // If it is not a public thread
        const aMessage = (messages as any[])[0];
        const recipientField = aMessage.sender._id !== currentUser._id ?
          aMessage.sender._id :
          aMessage.recipient._id;
        newMessage.recipient = recipientField;
      }

      const { data } = await sendMessage(newMessage, currentUser.token);
      setSubmitting(false);
      resetForm({});
      const postedMessage = {
        ...(data.lastMessage || data),
        sender: {
          fullName: currentUser.fullName,
          _id: currentUser._id,
        }
      };
      addMessage(postedMessage);
      socket.emit("new-message", {
        room: threadId,
        message: postedMessage,
      });
    } catch (error) {
      console.log("send msg error", error);
      setSubmitting(false);
      onError(error.message);
    }
  };
  const leaveRoom = () => socket.emit("left-room", {
    room: threadId,
  });

  useIonViewDidEnter(() => {
    socket.emit("join", {
      room: threadId,
    });
    socket.on("new-message", ({ message }: any) => {
      addMessage(message);
    });

    getThreadMessages(threadId, currentUser.token).then(({ data }: any) => {
      isMounted && setMessages(data);
    }).catch(error => {
      onError(error.message);
      history.replace("/app/chat");
    });
  });

  useIonViewWillLeave(() => {
    leaveRoom();
    setMounted(false);
  });

  useEffect(() => leaveRoom, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/chat" />
          </IonButtons>
          <IonTitle size="small" className="ion-text-capitalize">
            {(state && (state.fullName || state.name)) || "...user..."}
          </IonTitle>
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
                    {/* <IonCol
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
                    </IonCol> */}
                    <IonCol
                      size="10"
                      className="ion-no-padding ion-padding-start d-flex ion-align-items-center message-col"
                    >
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
                        <IonButton disabled={!isValid || isSubmitting} type="submit" color="primary">
                          <IonIcon slot="icon-only" icon={arrowForwardCircle} />
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
  const isMine = message.sender._id === currentUser._id;

  return (
    <IonRow className={isMine ? "ion-justify-content-end me" : "other"}>
      <IonCol size="7">
        <h5 className="ion-no-margin ion-text-capitalize">{message.sender.fullName}</h5>
        <IonCard className="ion-padding message-bubble">
          <IonText>
            <p className="ion-no-margin">{message.body}</p>
          </IonText>
          <IonText color="medium"><small className="ion-float-right">{moment(message.createdAt).format('LT')}</small></IonText>
        </IonCard>
      </IonCol>
    </IonRow>
  );
}