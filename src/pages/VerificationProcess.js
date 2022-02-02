import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';
import AnalysisLoader from '../components/analysisLoader';

const VerificationProcess = ({ match, history, userToken, userVerified, verificationUUIDkey, setVerificationUUIDkey, setUserVerified }) => {

  const [succ, setSucc] = useState(false);
  const [info, setInfo] = useState(false);
  const [danger, setDanger] = useState(false);

  useEffect(() => {
    if(userToken === null) {
      setVerificationUUIDkey(match.params.uuidKey);
      history.push('/sign-in');
      return;
    }
    if(userVerified) {
      setInfo(true);
      setVerificationUUIDkey(null);
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_DOMAIN}/account/verification/confirmation/`, {
        uuid: match.params.uuidKey
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      .then(res => {
        setSucc(true);
        setVerificationUUIDkey(null);
        setUserVerified(true);
      })
      .catch(err => {
        setDanger(true);
        setVerificationUUIDkey(null);
      });
  }, []);
  
  return(
    <div className="signInWrapper">

      {succ &&
        <SweetAlert
          title="Success!"
          success
          confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
          onConfirm={() => {history.push('/my-documents')}}
        >
          Your account has been verified. Press the button below to expore MESOC.
        </SweetAlert>
      }
      {info &&
        <SweetAlert
          title="Already verified."
          info
          confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
          onConfirm={() => {history.push('/my-documents')}}
        >
          You are already verified. You may proceed with exploring MESOC.
        </SweetAlert>
      }
      {danger &&
        <SweetAlert
          title="Oops!"
          danger
          onConfirm={() => {history.push('/browse')}}
        >
          Something went wrong. Please try again.
        </SweetAlert>
      }

      {!succ && !danger && !info && <AnalysisLoader height={'100vh'} />}
    </div>
  );
};

export default withRouter(VerificationProcess);