import React, { useState } from "react";
import { useParams, useHistory } from "react-router";
import { useIonViewWillLeave, useIonViewDidEnter } from "@ionic/react";

import { getById } from "../../http/users";
import { useAppContext } from "../../lib/context-lib";
import useToastManager from "../../lib/toast-manager";
import AProfile, { ProfileData } from "../../components/Profile";
import useMounted from "../../lib/mount-lib";

const UserProfile: React.FC = () => {
  const { userId } = useParams<any>();
  let [user, setUser] = useState<ProfileData | null>(null);
  const history = useHistory();
  const { onError } = useToastManager();
  const { isMounted, setMounted } = useMounted();
  const { currentUser } = useAppContext() as any;

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

  return <AProfile user={user} />
}

export default UserProfile;