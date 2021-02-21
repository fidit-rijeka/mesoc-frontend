import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
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

function App() {

  // TODO:
  // Display cookie warning.

  const [authCookie, setAuthCookie, removeAuthCookie] = useCookies(null);
  const [userToken, setUserToken] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [userVerified, setUserVerified] = useState(false);

  useEffect(() => {
    authCookie.mesoc_local_user !== undefined && setUserToken(authCookie.mesoc_local_user);
    setAppReady(true);
  }, [])

  return (
    <React.Fragment>
      {appReady ? 
        <div className="App">
        <Route path='/'>
          <Navbar userToken={userToken} setUserToken={setUserToken} removeAuthCookie={removeAuthCookie}/>
        </Route>
        <Switch>
          <Route path='/browse'>
            <Browse />
          </Route>
          <Route path='/my-documents'>
            <MyDocuments userToken={userToken} userVerified={userVerified} />
          </Route>
          <Route path='/send-feedback'>
            <SendFeedback userToken={userToken} userVerified={userVerified} />
          </Route>
          <Route path='/sign-in'>
            <SignIn setUserToken={setUserToken} setAuthCookie={setAuthCookie} userVerified={userVerified} setUserVerified={setUserVerified} />
          </Route>
          <Route path='/create-account'>
            <SignUp />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/not-verified">
            <NotVerfied userToken={userToken} />
          </Route>
          <Route path="/verification">
            <VerificationProcess path='/verification/:uuidKey' userToken={userToken} userVerified={userVerified} />
          </Route>
          <Route path='/upload-document'>
            <UploadDocument userToken={userToken} userVerified={userVerified} />
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