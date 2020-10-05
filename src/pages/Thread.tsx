import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonFooter, IonButtons, IonButton, IonIcon, IonHeader, IonBackButton, IonToolbar, IonTitle, IonGrid, IonRow, IonCard, IonCol, IonText, IonTextarea } from "@ionic/react";
import { attachOutline, callOutline, sendOutline } from "ionicons/icons";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "./Thread.css";
import { useParams, useLocation, useHistory } from "react-router";
import { getThreadMessages } from "../http/messages";
import { useAppContext } from "../lib/context-lib";

const messageSchema = Yup.object({
  body: Yup.string().required("Message can't be blank"),
});

const Thread: React.FC = () => {
  let [messages, setMessages] = useState([]);
  const { threadId } = useParams();
  const location = useLocation() as any;
  const history = useHistory();
  const { currentUser } = useAppContext() as any;

  useEffect(() => {
    getThreadMessages(threadId, currentUser.token).then((data: any) => {
      setMessages(data || messages);
    }).catch(console.error);

    return () => {
      setMessages = null as any;
    };
  }, []);

  if (!location!.state!.fullName) {
    history.replace("/app/chat");
    return null;
  }

  const handleSubmit = async (values: any, { setSubmitting }: any) => { };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{location.state.fullName}</IonTitle>
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
            errors,
            touched,
            isValid,
            isSubmitting,
          }: any) => (
              <Form noValidate>
                <IonGrid>
                  <IonRow>
                    <IonCol size="3" className="ion-no-padding d-flex ion-align-items-center ion-justify-content-center">
                      <IonButtons>
                        <IonButton>
                          <IonIcon slot="icon-only" icon={callOutline} />
                        </IonButton>
                        <IonButton>
                          <IonIcon slot="icon-only" icon={attachOutline} />
                        </IonButton>
                      </IonButtons>
                    </IonCol>
                    <IonCol size="7" className="ion-no-padding d-flex ion-align-items-center message-col">
                      <IonTextarea
                        rows={1}
                        className={"ion-no-margin" + touched.body && errors.body ? " has-error" : ""}
                        name="body"
                        onIonChange={handleChange}
                        onIonBlur={handleBlur}
                      />
                    </IonCol>
                    <IonCol size="2" className="ion-no-padding d-flex ion-align-items-center ion-justify-content-center">
                      <IonButtons>
                        <IonButton disabled={!isValid || isSubmitting} type="submit">
                          <IonIcon slot="icon-only" icon={sendOutline} />
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
            <h5 className="ion-no-margin">{message.sender.fullName}</h5>
            <p className="ion-no-margin">{message.body}</p>
          </IonText>
          <IonText color="medium"><small className="ion-float-right">{moment(message.createdAt).format('LT')}</small></IonText>
        </IonCard>
      </IonCol>
    </IonRow>
  );
}