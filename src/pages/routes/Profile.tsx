import React, { useEffect, useState } from "react";
import { useParams, useHistory, useRouteMatch, Route } from "react-router";
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

  return <AProfile user={user} />
}

const UserProfile: React.FC = () => {
  const { userId } = useParams();
  let [user, setUser] = useState<ProfileData | null>(null);
  const history = useHistory();
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();

  useIonViewDidEnter(() => {
    getById(userId).then(({ data }: any) => {
      if (!isMounted) {
        return;
      }

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

  return <AProfile user={user} />
}

const Profile: React.FC = () => {
  const { path } = useRouteMatch();
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route path={`${path}`} component={MyProfile} exact />
        <Route path={`${path}/:userId`} component={UserProfile} exact />
      </IonRouterOutlet>
    </IonPage>
  );
};

export default Profile;