import { IonButton, IonButtons, IonCol, IonItem, IonModal, IonRow, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { star, starHalf } from "ionicons/icons";


import { getUserRating } from "../http/reviews";
import { useAppContext } from "../lib/context-lib";
import useToastManager from "../lib/toast-manager";
import Centered from "./Centered";
import useMounted from "../lib/mount-lib";

const Rating: React.FC<{
  userId: string,
}> = ({ userId }) => {
  const [isFetching, setFetching] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const { isMounted, setMounted } = useMounted();
  const { currentUser } = useAppContext() as any;
  const { onError } = useToastManager();

  const _fetchRating = async () => {
    try {
      const { data } = await getUserRating(userId, currentUser.token);
      if (data.length && isMounted) {
        setRating(data[0].rating);
      }
    } catch (error) {
      onError(error.message);
    } finally {
      isMounted && setFetching(false);
    }
  };

  useEffect(() => {
    _fetchRating().then();
    return () => setMounted(false);
  }, []);

  return isFetching ? (
    <Centered>
      <IonSpinner name="dots" />
    </Centered>
  ) : (
      <p className="ion-no-margin">
        {rating ? (
          <RatingStars rating={rating} />
        ) : (
            <IonText>No ratings</IonText>
          )}
      </p>
    );
}

export default Rating;

export function RatingStars({ rating }: { rating: number }) {
  return (
    <>
      {([...Array(Math.floor(rating)).keys()]).map(key => <IonIcon color="warning" key={key} icon={star} />)}
      {((rating % 1) >= 0.5) && (<IonIcon icon={starHalf} />)}
    </>
  );
}