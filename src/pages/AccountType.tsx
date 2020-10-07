import React, { useState } from 'react';
import { IonPage, IonContent, IonText, IonCard, IonCardContent, IonIcon, IonSpinner } from '@ionic/react';
import { personOutline, person } from 'ionicons/icons';
import { useAppContext } from '../lib/context-lib';
import { useHistory } from 'react-router';
import { editUser } from '../http/users';
import { USER } from '../http/constants';
import useToastManager from '../lib/toast-hook';

const accountTypes = [
  {
    accountType: USER.ACCOUNT_TYPES.USER,
    icon: person,
  },
  {
    accountType: USER.ACCOUNT_TYPES.COUNSELLOR,
    icon: personOutline,
  },
];

export default function AccountType() {
  const [settingUp, setSettingUp] = useState(false);

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
            {accountTypes.map(type => <AccountTypeCard {...{ settingUp, setSettingUp }} {...type} />)}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

type AccountTypeProps = {
  accountType: string,
  icon: any,
  settingUp: boolean,
  setSettingUp: any,
};

function AccountTypeCard({ accountType, icon, settingUp, setSettingUp }: AccountTypeProps) {
  const [loading, setLoading] = useState(false);
  const { currentUser, setCurrentUser } = useAppContext() as any;
  const history = useHistory();
  const { onError, onSuccess } = useToastManager();

  const setAccountType = settingUp ? null : async () => {
    setSettingUp(true);
    try {
      await editUser(currentUser._id, currentUser.token, {
        accountType,
      });

      setCurrentUser({
        ...currentUser,
        accountType
      });

      setLoading(false);
      onSuccess("Account type set.");
      history.push("/app/profile")
    } catch (error) {
      setLoading(false);
      setSettingUp(false);
      onError(error.message);
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