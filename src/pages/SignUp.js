import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container, Label } from "reactstrap";
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const SignUp = ({ history }) => {

  const [err, setErr] = useState(null);
  const [succ, setSucc] = useState(false);
  const [wait, setWait] = useState(false);
  const [danger, setDanger] = useState(false);
  const [capCheck, setCapCheck] = useState(false);

  const handleValidSubmit = e => {
    // TODO:
    // Add all password validations (see api documentation).
    if(e.target.password.value !== e.target.repeatPassword.value) {
      setErr('Passwords don\'t match. Please try again.');
      return;
    }
    // if(!capCheck) {
    //   setErr('Please confirm that you are not a robot.');
    //   return;
    // }

    console.log(e.target.email.value);
    console.log(e.target.password.value);

    setWait(true);
    axios
      .post('https://api.mesoc.dev/account/', {
        email: e.target.email.value,
        password: e.target.password.value
      }, {auth: {
        username: 'api',
        password: '!kAkYk3T'
      }})
      .then(res => {
        setSucc(true);
        setWait(false);
      })
      .catch(err => {
        setWait(false);
        err.response.data.email && setErr(err.response.data.email);
        err.response.data.password && setErr(err.response.data.password);
        err.response.data.non_field_errors && setErr(err.response.data.non_field_errors);
      });
  };

  return(
    <div className="signInWrapper">
      {succ &&
        <SweetAlert
          title="A verification link has been sent to your email account."
          success
          confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
          onConfirm={() => {history.push('/browse')}}
        >
          Please click on the link that has just been sent to your email account to verify your email and continue the registration process. Be sure to check your spam folder.
        </SweetAlert>
      }
      {danger &&
        <SweetAlert
          title="Oops!"
          danger
          onConfirm={() => {setDanger(false)}}
        >
          Something went wrong.
        </SweetAlert>
      }
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={5} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-soft-primary">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome!</h5>
                        <p>Create your MESOC account.</p>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                <div>
                  <Link to="/browse">
                    <div className="avatar-md profile-user-wid mb-4">
                      <span className="avatar-title rounded-circle bg-light">
                        <img src={logo} alt="mesoc toolkit application logo" className="rounded-circle" height="34" />
                      </span>
                    </div>
                  </Link>
                  <div className="p-2">
                    <AvForm className="form-horizontal" onValidSubmit={e => handleValidSubmit(e)}>

                      {err && <Alert color="danger">{err}</Alert>}
                      {wait && <Alert color="secondary">Please wait.</Alert>}

                      <div className="form-group">
                        <AvField onInput={() => setErr(null)} name="email" label="Email" className="form-control" type="email" required />
                      </div>

                      <div className="form-group">
                        <AvField onInput={() => setErr(null)} name="password" label="Password" className="form-control" type="password" required />
                      </div>

                      <div className="form-group">
                        <AvField onInput={() => setErr(null)} name="repeatPassword" label="Repeat password" className="form-control" type="password" required />
                      </div>

                      {/* TODO:
                      Link these to actual Terms & Tonditions and Privacy policy */}
                      <AvGroup check>
                        <Label  className="mb-4" check>
                          <AvInput type="checkbox" name="agree" required />
                          <span className="fs95">By checking this box, you are acknowledging that you have read, understood, and accept our <a href={`${process.env.REACT_APP_HOME_URL}/terms`} target="_blank" className="font-weight-medium text-primary fs95">Terms & Conditions</a> and <a href={`${process.env.REACT_APP_HOME_URL}/privacy`} target="_blank" className="font-weight-medium text-primary fs95">Privacy Policy</a>, and that you consent to our use of your personal data as described in our <a href={`${process.env.REACT_APP_HOME_URL}/privacy`} target="_blank" className="font-weight-medium text-primary fs95">Privacy Policy</a>. Also you grant us the permission to process, analyze and store uploaded documents.</span>
                        </Label>
                      </AvGroup>

                      {/* TODO:
                      Add official mesoc recaptcha here */}
                      <ReCAPTCHA
                        sitekey={`${process.env.REACT_APP_RECAPTCHA_SITEKEY}`}
                        onChange={() => setCapCheck(true)}
                        onErrored={() => setCapCheck(false)}
                        onExpired={() => setCapCheck(false)}
                      />

                      <div className="mt-3">
                        <button className="btn btn-primary btn-block wawes-effect waves-light" type="submit">Create account</button>
                      </div>

                    </AvForm>
                  </div>
                </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default withRouter(SignUp);