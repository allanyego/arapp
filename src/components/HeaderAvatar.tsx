import { IonAvatar } from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";

import userPicture from "../http/helpers/user-picture";
import { useAppContext } from "../lib/context-lib";
import LazyImage from "./LazyImage";

const HeaderAvatar: React.FC = () => {
  const history = useHistory();
  const { currentUser } = useAppContext() as any;

  const toProfile = () => history.push('/app/profile');

  return (
    <IonAvatar slot="start" className="header-avatar" onClick={toProfile}>
      <LazyImage src={userPicture(currentUser)} alt={currentUser.fullName} />
    </IonAvatar>
  );
};

export default HeaderAvatar;