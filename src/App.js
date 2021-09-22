import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import './assets/scss/theme.scss';
import './myScss/myMain.scss';

import Navbar from './components/navbar';
import Browse from './pages/Browse';
import MyDocuments from './pages/MyDocuments';
import SendFeedback from './pages/SendFeedback';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import UploadDocument from './pages/UploadDocument';
import Analysis from './pages/Analysis';
import AnalysisLoader from './components/analysisLoader';
import NotVerfied from './pages/NotVerified';
import VerificationProcess from './pages/VerificationProcess';
import ResetPassword from './pages/ResetPassword';

// (Feb 22 2021) => When app reads user verified status and stores it in state it stores it as a string, which creates a bug. Temporary fix. Fix it or write it better.
function toBool(val) {
  if (val === "true") {
    return true 
  } else {
    return false;
  }
}

function App() {

  const [authCookie, setAuthCookie, removeAuthCookie] = useCookies(null); // Stores the authToken

  const [userToken, setUserToken] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [verificationUUIDkey, setVerificationUUIDkey] = useState(null);

  useEffect(() => {
    if (authCookie.mesoc_local_user) {
      setUserToken(authCookie.mesoc_local_user);
      setUserVerified(toBool(authCookie.mesoc_local_user_verified));
    }
    setAppReady(true);
  }, [])

  return (
    <React.Fragment>
      {appReady ? 
        <div className="App">
        <Route path='/'>
          <Navbar userToken={userToken}
                  setUserToken={setUserToken}
                  removeAuthCookie={removeAuthCookie}
                  setUserVerified={setUserVerified} />
        </Route>
        <Switch>
          <Route path="/" exact >
            <Redirect to="/browse" />
          </Route>
          <Route path='/browse'>
            <Browse />
          </Route>
          <Route path='/my-documents'>
            <MyDocuments userToken={userToken}
                         userVerified={userVerified} />
          </Route>
          <Route path='/send-feedback'>
            <SendFeedback userToken={userToken}
                          userVerified={userVerified} />
          </Route>
          <Route path='/sign-in'>
            <SignIn setUserToken={setUserToken}
                    setAuthCookie={setAuthCookie}
                    userVerified={userVerified}
                    setUserVerified={setUserVerified}
                    verificationUUIDkey={verificationUUIDkey} />
          </Route>
          <Route path='/create-account'>
            <SignUp />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/not-verified">
            <NotVerfied userToken={userToken}
                        userVerified={userVerified} />
          </Route>
          <Route path="/verification/:uuidKey">
            <VerificationProcess userToken={userToken}
                                 userVerified={userVerified}
                                 verificationUUIDkey={verificationUUIDkey}
                                 setUserVerified={setUserVerified}
                                 setVerificationUUIDkey={setVerificationUUIDkey} />
          </Route>
          <Route path='/upload-document'>
            <UploadDocument userToken={userToken}
                            userVerified={userVerified} />
          </Route>
          <Route path="/password_reset/:token">
            <ResetPassword />
          </Route>
          <Route path='/:analysisType/:analysisKey'>
            <Analysis userToken={userToken} />
          </Route>
        </Switch>
      </div> :
      <AnalysisLoader height={'100vh'} />}
    </React.Fragment>
  );
}

export default App;