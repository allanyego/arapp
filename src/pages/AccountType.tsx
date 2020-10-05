import React, { useState } from 'react';
import { IonPage, IonContent, IonText, IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/react';
import { businessOutline, personOutline, person } from 'ionicons/icons';
import { useAppContext } from '../lib/context-lib';
import { useHistory } from 'react-router';
import { editUser } from '../http/users';

const accountTypes = [
  {
    accountType: "professional",
    icon: person,
  },
  {
    accountType: "patient",
    icon: personOutline,
  },
  {
    accountType: "institution",
    icon: businessOutline,
  },
];

export default function AccountType() {
  const { currentUser } = useAppContext() as any;
  const history = useHistory();
  const [settingUp, setSettingUp] = useState(false);

  if (!currentUser) {
    history.push("/sign-in");
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="d-flex ion-justify-content-center ion-align-items-center" style={{
          height: '100%'
        }}>
          <div className="ion-text-center">
            <IonText>
              <h1>Select account type</h1>
            </IonText>
            {accountTypes.map(type => <AccountTypeCard {...{ settingUp, setSettingUp, userId: currentUser._id }} {...type} />)}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

type AccountTypeProps = {
  accountType: string,
  icon: any,
  userId: any,
  settingUp: boolean,
  setSettingUp: any,
};

function AccountTypeCard({ accountType, icon, userId, settingUp, setSettingUp }: AccountTypeProps) {
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const history = useHistory();

  const setAccountType = settingUp ? null : async () => {
    setSettingUp(true);
    try {
      await editUser(userId, currentUser.token, {
        accountType,
      });

      setCurrentUser({
        ...currentUser,
        accountType
      });

      setLoading(false);
      history.push("/app/profile")
    } catch (error) {
      setLoading(false);
      setSettingUp(false);
    }
  };
  return (
    <IonCard button onClick={setAccountType as any}>
      <IonCardContent>
        <div>
          {loading ? <IonSpinner name="crescent" /> : <IonIcon icon={icon} />}
        </div>
        <IonText>
          <p>{accountType}</p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
}