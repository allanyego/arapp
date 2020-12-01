import React, { useEffect, useState } from "react";
import { useIonViewWillLeave, useIonViewDidEnter } from "@ionic/react";

import { useAppContext } from "../../lib/context-lib";
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

export default MyProfile;