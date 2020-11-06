import React, { useState } from "react";
import { IonModal, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonText, IonCardContent, IonCardSubtitle, IonHeader } from "@ionic/react";
import moment from "moment";

import { useAppContext } from "../lib/context-lib";
import useToastManager from "../lib/toast-manager";
import { getUserReviews } from "../http/reviews";
import LoaderFallback from "./LoaderFallback";
import { RatingStars } from "./Rating";

const UserReviews: React.FC<{
  isOpen?: boolean,
  onClose: () => any,
}> = ({ isOpen = false, onClose }) => {
  const [reviews, setReviews] = useState<any[] | null>(null);
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const onDidPresent = async () => {
    try {
      const { data } = await getUserReviews(currentUser.token);
      console.log("Got your reviews");
      isOpen && setReviews(data);
    } catch (error) {
      onError(error.message);
    }
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      onDidPresent={onDidPresent}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={onClose} color="danger">Close</IonButton>
          </IonButtons>
          <IonTitle size="small">Reviews to you</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {!reviews ? (
          <LoaderFallback fullHeight />
        ) : (
            <div>
              {reviews.map((review: any) => (
                <ReviewCard {...{ review }} key={review._id} />
              ))}
            </div>
          )}
      </IonContent>
    </IonModal>
  );
};

export default UserReviews;

function ReviewCard({ review }: any) {
  return (
    <IonCard>
      <IonCardHeader
        className="ion-no-padding ion-padding-horizontal ion-padding-top"
      >
        <IonCardTitle>
          <RatingStars rating={review.rating} />
        </IonCardTitle>
        <IonCardSubtitle className="ion-no-margin">
          <small>
            <strong>
              By <IonText color="primary">
                {review.byUser.fullName}
              </IonText> {moment(review.updatedAt, "YYYYMMDD").fromNow()}
            </strong>
          </small>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {review.feedback || (
          <IonText color="medium">
            <i>No feedback</i>
          </IonText>
        )}
      </IonCardContent>
    </IonCard>
  );
}