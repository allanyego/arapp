import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AccountType from './pages/AccountType';
import Main from './pages/Main';
import { AppContext } from './lib/context-lib';
import "./App.css";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  return (
    <IonApp>
      <AppContext.Provider value={{
        currentUser,
        setCurrentUser,
      }}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/home" render={() => !currentUser ?
              <Home /> : redirect("/app")} exact={true} />
            <Route path="/sign-in" render={() => !currentUser ?
              <SignIn /> : redirect("/app")} exact={true} />
            <Route path="/sign-up" render={() => !currentUser ?
              <SignUp /> : redirect("/app")} exact={true} />
            <Route path="/app" render={() => currentUser ? <Main /> : redirect("/sign-in")} />
            <Route
              path="/account-type"
              exact
              render={() => currentUser ?
                currentUser!.accountType ? redirect("/app") : <AccountType />
                : redirect("/sign-in")}
            />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
        </IonReactRouter>
      </AppContext.Provider>
    </IonApp>
  );
};

function redirect(path: string) {
  return <Redirect to={path} />
}

export default App;
