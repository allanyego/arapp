import React, { useState, useEffect, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { IonApp, IonAlert } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { BackButtonEvent } from "@ionic/core";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import "./App.css";
import { getObject, setObject } from './lib/storage';
import { STORAGE_KEY } from './http/constants';
import ToastManager from './components/ToastManager';
import useMounted from './lib/mount-lib';
import { Capacitor, Plugins } from '@capacitor/core';
import LoaderFallback from './components/LoaderFallback';
import { AppContext, useAppContext } from './lib/context-lib';
import SuspenseFallback from './components/SuspenseFallback';
import { ProfileData } from './components/Profile';

const Home = React.lazy(() => import("./pages/Home"));
const SignIn = React.lazy(() => import("./pages/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const Main = React.lazy(() => import("./pages/Main"));

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [authenticating, setAuthenticating] = useState(true);
  const { isMounted, setMounted } = useMounted();

  // Ensure state is updated if the component unmounts
  // and pulls storage data
  const _setCurrentUser = async (currUser: ProfileData) => {
    if (!currUser) {
      return setCurrentUser(currUser);
    }

    const newDetails = {
      ...currentUser,
      ...currUser,
    };
    await setObject(STORAGE_KEY, {
      currentUser: newDetails,
    });

    isMounted && setCurrentUser(newDetails);
  };

  useEffect(() => {
    getObject(STORAGE_KEY).then(data => {
      if (!isMounted) {
        return;
      }

      if (data && data.currentUser) {
        setCurrentUser(data.currentUser);
      }

      setAuthenticating(false);
    });

    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <IonApp>
      <AppContext.Provider value={{
        currentUser,
        setCurrentUser: _setCurrentUser,
        notifications,
        setNotifications,
        socket,
        setSocket,
      }}>
        <ToastManager />
        <IonReactRouter>
          {authenticating ? (
            <LoaderFallback />
          ) : (
              <Routes />
            )}
        </IonReactRouter>
      </AppContext.Provider>
    </IonApp>
  );
};

function redirect(path: string) {
  return <Redirect to={path} />
}

export default App;

function Routes() {
  const [isAlertOpen, setAlertOpen] = useState(false);
  const { currentUser } = useAppContext() as any;
  const { isMounted, setMounted } = useMounted();

  const closeAlert = () => setAlertOpen(false);

  const hardwareBackBtnHandler = (ev: BackButtonEvent) => {
    ev.detail.register(5, () => {
      const path = window.location.pathname;
      const isFirstPage = path === "/" || path === "/app/guides";
      if (window.history.length === 1 || isFirstPage) {
        isMounted && setAlertOpen(true);
      } else {
        window.history.back();
      }
    });
  };

  useEffect(() => {
    if (Capacitor.isNative) {
      document.addEventListener("ionBackButton" as any, hardwareBackBtnHandler);
    }

    return () => {
      document.removeEventListener("ionBackButton" as any, hardwareBackBtnHandler);
      setMounted(false);
    }
  }, []);

  return (
    <>
      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={closeAlert}
        cssClass="exit-app-alert"
        header={"Leaving?"}
        message="Are you you sure you want to leave?"
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'danger',
            handler: () => true
          },
          {
            text: 'Yes',
            handler: Plugins.App.exitApp
          }
        ]}
      />
      <Suspense fallback={<SuspenseFallback />}>
        <Switch>
          <Route path="/" render={() => !currentUser ?
            <Home /> : redirect("/app")} exact />

          <Route path="/sign-in" component={SignInWrapper} exact />

          <Route path="/sign-up" render={() => !currentUser ?
            <SignUp /> : redirect("/app")} exact />

          <Route path="/app" render={() => currentUser ? <Main /> : redirect("/sign-in")} />

          <Route render={() => <Redirect to="/" />} exact />
        </Switch>
      </Suspense>
    </>
  );
}

function SignInWrapper() {
  const { currentUser } = useAppContext() as any;

  if (currentUser) {
    return <Redirect to="/app" />
  }

  return (<SignIn />);
}