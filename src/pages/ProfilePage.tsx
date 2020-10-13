import React, { useState, useEffect } from "react";

import { useParams, useHistory, useRouteMatch, Route, Switch } from "react-router";
import { getById } from "../http/users";
import { useAppContext } from "../lib/context-lib";
import useToastManager from "../lib/toast-hook";
import Profile, { ProfileData } from "../components/Profile";
import { useIonViewWillEnter, useIonViewWillLeave, IonRouterOutlet, useIonViewDidEnter, useIonViewDidLeave } from "@ionic/react";
import useMounted from "../lib/mount-lib";

const MyProfile: React.FC = () => {
  let [user, setUser] = useState<ProfileData | null>(null);
  const { currentUser } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();

  useIonViewDidEnter(() => {
    isMounted && setUser(currentUser);
  });

  useIonViewWillLeave(() => {
    setMounted(false);
  });

  return <Profile user={user} />
}

const UserProfile: React.FC = () => {
  const { userId } = useParams();
  let [user, setUser] = useState<ProfileData | null>(null);
  const history = useHistory();
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  useIonViewDidEnter(() => {
    isMounted && getById(userId).then(({ data }: any) => {
      if (data) {
        setUser(data);
      } else {
        onError("No user by that id found");
        history.replace("/app/profile");
      }
    }).catch(error => onError(error.message));
  });

  useIonViewWillLeave(() => {
    setMounted(false);
  });

  return <Profile user={user} />
}

const ProfilePage: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={MyProfile} exact />
      <Route path={`${path}/:userId`} component={UserProfile} exact />
    </Switch>
  );
};

export default ProfilePage;