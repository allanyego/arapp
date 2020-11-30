import { IonAvatar, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { business, person, shield } from "ionicons/icons";
import React from "react";
import { USER } from "../http/constants";
import userPicture from "../http/helpers/user-picture";
import LazyImage from "./LazyImage";
import { ProfileData } from "./Profile";
import Rating from "./Rating";

const UserListingItem: React.FC<{
  user: ProfileData
}> = ({ user }) => {
  const isFacility = user.accountType === USER.ACCOUNT_TYPES.HEALTH_FACILITY;
  const isCounsellor = user.accountType === USER.ACCOUNT_TYPES.COUNSELLOR;

  return (
    <IonItem routerLink={`/app/profile/${user._id}`} button detail>
      <IonAvatar slot="start">
        <LazyImage src={userPicture(user)} alt={user.fullName} />
      </IonAvatar>
      <IonLabel>
        <h2 className="ion-text-capitalize">{user.fullName}</h2>
        <p>{user.speciality || "---"}</p>
        <Rating userId={user._id as string} />
      </IonLabel>
      <IonIcon
        slot="end"
        icon={isFacility ?
          business : isCounsellor ?
            person : shield}
      />
    </IonItem>
  );
}

export default UserListingItem;