import React, { useEffect, useState } from "react";
import { useParams, useHistory, Route } from "react-router";
import { useIonViewWillLeave, IonRouterOutlet, useIonViewDidEnter, IonPage } from "@ionic/react";

import { getById } from "../../http/users";
import { useAppContext } from "../../lib/context-lib";
import useToastManager from "../../lib/toast-manager";
import AProfile, { ProfileData } from "../../components/Profile";
import useMounted from "../../lib/mount-lib";

const MyProfile: React.FC = () => {
  let [user, setUser] = useState<ProfileData | null>(null);
  const { currentUser } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();

  useEffect(() => {
    isMounted && setUser(currentUser);
  }, [currentUser, isMounted]);

  useIonViewDidEnter(() => {
    isMounted && setUser(currentUser);
  });

  useIonViewWillLeave(() => {
    setMounted(false);
  });

  return (
    <IonPage>
      <AProfile user={user} />
    </IonPage>
  );
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<any>();
  let [user, setUser] = useState<ProfileData | null>(null);
  const history = useHistory();
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();
  const { currentUser } = useAppContext() as any;

  console.log("Hey user profile", userId);
  const fetchUser = async () => {
    try {
      const { data } = await getById(userId, currentUser.token);
      if (!isMounted) {
        return;
      }
      data ?
        setUser(data) :
        history.replace("/app/profile");
    } catch (error) {
      onError(error.message)
    }
  };

  useIonViewDidEnter(fetchUser);

  useIonViewWillLeave(() => {
    setMounted(false);
  });

  return (
    <IonPage>
      <AProfile user={user} />
    </IonPage>
  );
}

const Profile: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path="/app/profile" component={MyProfile} exact />
        <Route path="/app/profile/:userId" component={UserProfile} exact />
      </IonRouterOutlet>
    </IonPage>
  );
};

export default Profile;