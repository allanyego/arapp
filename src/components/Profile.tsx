import React, { useEffect, useState } from "react";
import { IonText, IonPage, IonContent, IonChip, IonRow, IonCol, IonGrid, IonButton, IonList, IonItem, IonLabel, IonIcon, IonCard, IonCardHeader, IonCardContent, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonModal, IonTextarea, IonSpinner, IonCardTitle, IonBadge } from "@ionic/react";
import { caretDown, caretUp, call, mail, chatboxEllipses, heartCircleOutline, create, alertCircle, heartCircle, star, pencil, folderOpen, albums, chevronUp, chevronDown } from "ionicons/icons";
import moment from "moment";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import "./Profile.css";
import Rating, { RatingStars } from "../components/Rating";
import { useAppContext } from "../lib/context-lib";
import { USER, STORAGE_KEY } from "../http/constants";
import { sendMessage } from "../http/messages";
import useToastManager from "../lib/toast-manager";
import useContacts from "../lib/contacts-lib";
import { setObject } from "../lib/storage";
import LoaderFallback from "./LoaderFallback";
import Bio from "./profile-parts/Bio";
import FullName from "./profile-parts/FullName";
import Education from "./profile-parts/Education";
import ContactButton from "./ContactButton";
import Speciality from "./profile-parts/Speciality";
import useMounted from "../lib/mount-lib";
import { checkIfFavorited, favorite } from "../http/favorites";
import Centered from "./Centered";
import FormFieldFeedback from "./FormFieldFeedback";
import { addReview, getUserReview } from "../http/reviews";
import ProfilePicture from "./profile-parts/ProfilePicture";
import Experience from "./profile-parts/Experience";
import ContactInfo from "./profile-parts/ContactInfo";
import { EditFabButton } from "./profile-parts/withEditableFeatures";
import UserReviews from "./UserReviews";
import WordCounter from "./WordCounter";
import CollapsibleCard from "./CollapsibleCard";
import AppointmentCard from "./AppointmentCard";

export interface ProfileData {
  _id?: string,
  fullName: string,
  username: string,
  gender?: string,
  bio?: string,
  conditions?: string[],
  accountType: string | null,
  birthday?: Date | string,
  phone: string,
  email: string,
  picture?: string,
  experience?: number,
  speciality?: string,
  education?: {
    institution: string,
    areaOfStudy: string,
    startDate: Date,
    endDate?: Date,
  }[],
  rating?: number,
}

const Profile: React.FC<{ user: ProfileData | null }> = ({ user }) => {
  const { currentUser } = useAppContext() as any;
  const isCurrent = user && currentUser._id === user._id;
  const isCurrentLawEnforcer = currentUser.accountType === USER.ACCOUNT_TYPES.LAW_ENFORCER;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/guides" />
          </IonButtons>
          {(user && isCurrent && !isCurrentLawEnforcer) && (
            <IonButtons slot="end">
              <IonButton routerLink="/app/incidents" color="danger">
                <IonIcon slot="icon-only" icon={albums} />
              </IonButton>
            </IonButtons>
          )}
          <IonTitle size="small">Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!user ? (
          <LoaderFallback />
        ) : (
            <IonGrid>
              <IonRow>
                <UserDetails user={user as any} />
              </IonRow>
            </IonGrid>
          )}
      </IonContent>
    </IonPage>
  );
}

export default Profile;

function ContactCard({ user }: { user: ProfileData }) {
  const { currentUser } = useAppContext() as any;

  return (
    <CollapsibleCard headerText="Contact">
      <ContactInfo user={user} currentUserId={currentUser._id} />
    </CollapsibleCard>
  );
}

const messageSchema = Yup.object({
  body: Yup.string().required("Can't send an empty message."),
});

function UserDetails({ user }: { user: ProfileData }) {
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();

  const toggleModal = () => setShowModal(!showModal);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const newMessage = {
        sender: currentUser._id,
        recipient: user._id,
        ...values,
      };

      await sendMessage(newMessage, currentUser.token);
      setSubmitting(false);
      onSuccess("Message sent");
      toggleModal();
    } catch (error) {
      setSubmitting(false);
      onError(error.message);
    }
  };

  const isUser = user.accountType === USER.ACCOUNT_TYPES.USER;
  const isCurrent = user._id === currentUser._id;
  const isLawEnforcer = user.accountType === USER.ACCOUNT_TYPES.LAW_ENFORCER;

  return (
    <IonCol>
      <IonModal isOpen={showModal}>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={toggleModal} color="danger">Close</IonButton>
          </IonButtons>
          <IonTitle className="ion-text-capitalize">{user.fullName}</IonTitle>
        </IonToolbar>
        <IonRow className="h100">
          <IonCol className="ion-align-self-center">
            <IonText>
              <h1>Send new message</h1>
            </IonText>
            <Formik
              validationSchema={messageSchema}
              onSubmit={handleSubmit}
              initialValues={{}}
            >{({
              handleChange,
              handleBlur,
              errors,
              touched,
              isValid,
              isSubmitting
            }: any) => (
                <Form noValidate>
                  <IonItem className={touched.password && errors.password ? "has-error" : ""}>
                    <IonLabel position="floating">Your message</IonLabel>
                    <IonTextarea name="body" rows={4}
                      onIonChange={handleChange} onIonBlur={handleBlur} />
                  </IonItem>
                  <FormFieldFeedback {...{ errors, touched, fieldName: "body" }} />

                  <IonRow>
                    <IonCol>
                      <IonButton
                        color="dark"
                        expand="block"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                      >{isSubmitting ? "Sending..." : "Send"}</IonButton>
                    </IonCol>
                  </IonRow>
                </Form>
              )}</Formik>
          </IonCol>
        </IonRow>
      </IonModal>

      <ProfilePicture user={user} />
      <IonText className="ion-text-center">
        <FullName user={user} currentUserId={currentUser._id} />
        {!isUser && (
          <>
            {isLawEnforcer ? (
              <p className="ion-no-margin">
                <IonBadge color="dark">Police</IonBadge>
              </p>
            ) : (
                <Speciality user={user} currentUserId={currentUser._id} />
              )}
            <Experience user={user} currentUserId={currentUser._id} />
            <RatingSection user={user} />
          </>
        )}
      </IonText>
      <Bio user={user} currentUserId={currentUser._id} />

      {(!isUser && !isCurrent) && (
        <AppointmentCard />
      )}

      {(!isUser || isCurrent) && (
        <ContactCard user={user} />
      )}

      {!isUser && (
        <div>
          {!isCurrent && (
            <div className="d-flex ion-justify-content-center">
              <div>
                <IonButton color="dark" expand="block" onClick={toggleModal}>
                  Chat
                  <IonIcon slot="end" icon={chatboxEllipses} />
                </IonButton>
              </div>
              <FavoriteButton userId={user._id as string} />
            </div>
          )}

          <Education user={user} currentUserId={currentUser._id} />
        </div>
      )}

      {isCurrent && (
        <ContactButton />
      )}
    </IonCol>
  );
}

function FavoriteButton({ userId }: {
  userId: string,
}) {
  const [isFetching, setFetching] = useState(true);
  const [isFavorite, setFavorite] = useState(false);
  const { currentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  useEffect(() => {
    checkIfFavorited(userId, currentUser.token).then(({ data }) => {
      if (!isMounted) {
        return;
      }
      setFetching(false);
      if (data) {
        setFavorite(true);
      } else {
        setFavorite(false);
      }
    }).catch(error => onError(error.message));

    return () => {
      setMounted(false);
    }
  }, []);

  const handleToggle = async () => {
    setFetching(true);
    try {
      await favorite(userId, currentUser.token);
      if (isMounted) {
        setFavorite(!isFavorite);
      }
      onSuccess(`Successfully ${isFavorite ? 'unfavorited' : 'favorited'} user`);
    } catch (error) {
      onError(error.message);
    } finally {
      isMounted && setFetching(false);
    }
  };

  return (
    <IonButton
      onClick={handleToggle}
      color={isFavorite ? "danger" : "medium"}
      fill="clear"
    >
      {isFetching ? (
        <IonSpinner name="lines-small" />
      ) : (
          <IonIcon
            slot="icon-only"
            icon={isFavorite ? heartCircle : heartCircleOutline}
          />
        )}
    </IonButton>
  );
}

function RatingSection({ user }: {
  user: ProfileData
}) {
  const [showModal, setShowModal] = useState(false);
  const [showOwnReviews, setShowOwnReviews] = useState(false);
  const [isFetching, setFetching] = useState(true);
  const [isEditting, setEditting] = useState(false);
  const [review, setReview] = useState<{
    rating: number,
    feedback: string,
  } | null>(null);
  const { currentUser } = useAppContext() as any;
  const { onError, onSuccess } = useToastManager();
  const isCurrent = user._id === currentUser._id;

  const onRatingTap = () => isCurrent ?
    setShowOwnReviews(true) :
    setShowModal(true);

  const toggleEditting = () => setEditting(!isEditting);

  const closeModals = () => {
    setShowOwnReviews(false);
    setShowModal(false)
  };

  const modalSetup = async () => {
    try {
      const { data } = await getUserReview(user._id, currentUser.token);
      data && setReview(data);
      setFetching(false);
    } catch (error) {
      onError(error.message);
    }
  };

  const handleReviewSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const { data } = await addReview(user._id, currentUser.token, values);
      setSubmitting(false);
      setReview(data);
      setEditting(false);
      onSuccess("Review posted successfully");
    } catch (error) {
      onError(error.message);
      setSubmitting(false);
    }
  };

  return (
    <>
      <IonItem
        className="rating-container"
        onClick={onRatingTap}
        lines="none"
        button
      >
        <div style={{
          width: "100%"
        }}>
          <Centered>
            <div className="ion-text-center">
              <Rating userId={user._id as string} />
              <IonText color="medium">
                <small>Tap to {isCurrent ? "view" : "add/edit"}</small>
              </IonText>
            </div>
          </Centered>
        </div>
      </IonItem>
      {/* <div className="rating-container" onClick={onRatingTap}>
      </div> */}

      {/* Modal for own reviews */}
      <UserReviews isOpen={showOwnReviews} onClose={closeModals} />

      {/* Rating modal for visiting users */}
      <IonModal
        isOpen={showModal}
        onDidDismiss={closeModals}
        onDidPresent={modalSetup}
        cssClass="review-modal"
      >
        <IonPage>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={closeModals} color="danger">Close</IonButton>
            </IonButtons>
            <IonTitle size="small">Review to <strong>@{user.username}</strong></IonTitle>
          </IonToolbar>
          <IonContent>
            {(!review && isFetching) ? (
              <LoaderFallback fullHeight />
            ) : (
                <Centered fullHeight>
                  <div
                    className="p-relative ion-margin-horizontal"
                    style={{
                      width: "-webkit-fill-available"
                    }}
                  >
                    {review && (
                      <>
                        <EditFabButton
                          isEditting={isEditting}
                          onClick={toggleEditting}
                          style={{
                            "--offset-right": "-0.4em"
                          }}
                        />
                        {!isEditting && (
                          <IonCard>
                            <IonCardHeader>
                              <IonCardTitle>
                                <div className="rating-icons">
                                  <RatingStars rating={review.rating} />
                                </div>
                              </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                              <IonText color="medium">
                                <p>{review.feedback}</p>
                              </IonText>
                            </IonCardContent>
                          </IonCard>
                        )}
                      </>
                    )}
                    {(!review || isEditting) && (
                      <ReviewForm
                        review={{
                          rating: review?.rating || "",
                          feedback: review?.feedback || "",
                        }}
                        onSubmit={handleReviewSubmit}
                      />
                    )}
                  </div>
                </Centered>
              )}
          </IonContent>
        </IonPage>
      </IonModal>
    </>
  );
}

function RatingButtons({ value, onChange, count = 5 }: {
  value: number,
  onChange: any,
  count?: number,
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        const isAbove = (index + 1) > value;
        const onTap = () => onChange(index + 1);

        return (
          <IonIcon
            key={index}
            color={isAbove ? "medium" : "warning"}
            onClick={onTap}
            icon={star}
          />
        );
      })}
    </>
  );
}

const reviewSchema = Yup.object({
  rating: Yup.number().required("Please select a rating."),
  feedback: Yup.string().min(15, "Say some more.").max(150, "That's enough."),
});

function ReviewForm({ onSubmit, review }: {
  onSubmit: (...args: any[]) => any,
  review: any,
}) {
  return (
    <Formik
      validationSchema={reviewSchema}
      onSubmit={onSubmit}
      initialValues={review}
    >
      {({
        handleChange,
        handleBlur,
        setFieldValue,
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
      }) => (
          <Form noValidate>
            <div className="rating-icons">
              <RatingButtons
                value={values.rating}
                onChange={(val: number) => setFieldValue("rating", val)}
              />
              <FormFieldFeedback {...{ errors, touched, fieldName: "rating" }} />
            </div>

            <IonItem>
              <IonTextarea
                rows={2}
                name="feedback"
                value={values.feedback}
                placeholder="Feedback to user."
                onIonChange={handleChange}
                onIonBlur={handleBlur}
              />
            </IonItem>
            <WordCounter
              text={values.feedback}
              min={15}
              max={150}
            />
            <FormFieldFeedback {...{ errors, touched, fieldName: "feedback" }} />

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
        )}
    </Formik>
  );
}