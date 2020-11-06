import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonItem, IonAvatar, IonList, IonLabel, IonText, useIonViewDidEnter, useIonViewWillLeave, IonToolbar, IonSegment, IonSegmentButton, IonIcon, IonRow, IonGrid, IonCol, IonSearchbar, IonButton, IonInput, IonTextarea, IonCard, IonSpinner } from "@ionic/react";
import { add, peopleOutline, personOutline } from "ionicons/icons";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { useRouteMatch, useHistory } from "react-router";
import { useAppContext } from "../lib/context-lib";
import { getUserThreads, addPublicThread, getPublicThreads } from "../http/messages";
import useToastManager from "../lib/toast-manager";
import UserHeader from "../components/UserHeader";
import LoaderFallback from "../components/LoaderFallback";
import FormFieldFeedback from "../components/FormFieldFeedback";
import useMounted from "../lib/mount-lib";
import Centered from "../components/Centered";
import debounce from "../lib/debounce";
import userPicture from "../http/helpers/user-picture";
import LazyImage from '../components/LazyImage';
import "./Chat.css";

export default function Chat() {
  const [threads, setThreads] = useState<any[] | null>(null);
  const [publicThreads, setPublicThreads] = useState<any[] | null>(null);
  const [activeView, setActiveView] = useState("direct");
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  useIonViewDidEnter(() => {
    getUserThreads(currentUser._id, currentUser.token).then(({ data }) => {
      isMounted && setThreads(data || threads);
    }).catch(error => onError(error.message));

    getPublicThreads(currentUser.token).then(({ data }) => {
      isMounted && setPublicThreads(data || threads);
    }).catch(error => onError(error.message));
  });

  useIonViewWillLeave(() => setMounted(false));

  const onSegmentChange = (e: any) => {
    setActiveView(e.detail.value);
  };

  return (
    <IonPage>
      <UserHeader title="Chat" />
      <IonContent fullscreen>
        <div className="d-flex h100 chat-page-container">
          <IonToolbar>
            <IonSegment onIonChange={onSegmentChange} value={activeView}>
              <IonSegmentButton value="direct">
                <IonIcon icon={personOutline} />
                <IonLabel>Direct</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="community">
                <IonIcon icon={peopleOutline} />
                <IonLabel>Community</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>

          <div>
            {(activeView === "direct") ? (
              <DMThreads threads={threads} />
            ) : (
                <GroupChatThreads threads={publicThreads} setThreads={setPublicThreads} />
              )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

interface ThreadProps {
  threads: any[] | null
}

const publicThreadSchema = Yup.object({
  name: Yup.string().required("Enter thread name"),
  description: Yup.string().min(10, "Too short").max(75, "Too long").required("Some little info, please")
});

function GroupChatThreads({ threads, setThreads }: ThreadProps & {
  setThreads: any,
}) {
  const [isVisible, setVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const { currentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();
  const { isMounted, setMounted } = useMounted();
  const { url } = useRouteMatch();
  const history = useHistory();

  const openForm = () => setVisible(true);
  const closeForm = () => setVisible(false);
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const { data } = await addPublicThread(values, currentUser.token);
      onSuccess("Thread created.");
      if (isMounted) {
        setThreads([...threads, data]);
        closeForm();
      }
    } catch (error) {
      onError(error.message);
    } finally {
      isVisible && setSubmitting(false);
    }
  };
  const handleSearch = (e: any) => {
    const value = e.target.value.trim();
    if (!value) {
      setSearchResults(null);
    } else {
      const res = threads!.filter((t: any) => t.name.match(value));
      setSearchResults(res);
    }
  };

  useEffect(() => () => setMounted(false), []);

  return (
    <div className="h100 public-threads">
      {isVisible && (
        <IonCard className="public-threads-form">
          <Formik
            validationSchema={publicThreadSchema}
            onSubmit={handleSubmit}
            initialValues={{
              name: "",
              description: ""
            }}
          >
            {({
              handleChange,
              handleBlur,
              errors,
              touched,
              isValid,
              isSubmitting,
            }) => (
                <Form noValidate>
                  <IonItem className={touched.name && errors.name ? "has-error" : ""}>
                    <IonLabel position="floating">Thread name</IonLabel>
                    <IonInput name="name" type="text" onIonChange={handleChange} onIonBlur={handleBlur}
                      autofocus
                    />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "name" }} />

                  <IonItem className={touched.description && errors.description ? "has-error" : ""}>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonTextarea
                      rows={2}
                      name="description"
                      onIonChange={handleChange}
                      onIonBlur={handleBlur}
                    />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "description" }} />

                  <IonRow>
                    <IonCol>
                      <IonButton
                        color="light"
                        expand="block"
                        disabled={isSubmitting}
                        onClick={closeForm}
                      >Cancel</IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton
                        color="dark"
                        expand="block"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                      >{isSubmitting ?
                        <IonSpinner name="lines-small" /> :
                        "Submit"}
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </Form>
              )}
          </Formik>
        </IonCard>
      )}

      <IonGrid>
        <IonRow>
          <IonCol size="2">
            <Centered fullHeight>
              <IonButton fill="clear" color="success" onClick={openForm}>
                <IonIcon slot="icon-only" icon={add} />
              </IonButton>
            </Centered>
          </IonCol>
          <IonCol size="10">
            <IonSearchbar
              onIonChange={debounce(handleSearch, 600)}
              showCancelButton="never"
              cancelButtonText="Custom Cancel"
            />
          </IonCol>
        </IonRow>
      </IonGrid>
      {!threads ? (
        <LoaderFallback />
      ) : (
          <IonList>
            {(searchResults || threads).map((thread: any) => {
              const toThread = () => history.push({
                pathname: `${url}/${thread._id}`,
                state: {
                  ...thread,
                }
              });

              return (
                <IonItem onClick={toThread} button detail key={thread._id}>
                  <IonLabel>
                    <h2 className="ion-text-capitalize">{thread.name}</h2>
                    <IonText color="medium">{thread.description}</IonText>
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
    </div>
  );
}

function DMThreads({ threads }: ThreadProps) {
  return !threads ? (
    <LoaderFallback />
  ) : (
      <IonList>
        {threads.map((thread: any) => <ThreadRibbon key={thread._id} thread={thread} />)}
      </IonList>
    )
}

function ThreadRibbon({ thread }: any) {
  const { url } = useRouteMatch();
  const history = useHistory();
  const { currentUser } = useAppContext() as any;
  const otherUser = thread.participants.filter(
    (user: any) => user._id !== currentUser._id
  )[0];

  const toThread = () => history.push({
    pathname: `${url}/${thread._id}`,
    state: {
      ...otherUser,
    }
  });

  return (
    <IonItem onClick={toThread} button detail>
      <IonAvatar slot="start">
        <LazyImage src={userPicture(otherUser)} alt={otherUser.fullName} />
      </IonAvatar>
      <IonLabel>
        <h2 className="ion-text-capitalize">{otherUser.fullName}</h2>
        <IonText color="medium">{thread.lastMessage.body}</IonText>
      </IonLabel>
    </IonItem>
  );
}