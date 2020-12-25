import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container, Label } from "reactstrap";
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import SweetAlert from 'react-bootstrap-sweetalert';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const SignUp = props => {

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
    if(!capCheck) {
      setErr('Please confirm that you are not a robot.');
      return;
    }

    // TODO:
    // Send data to backend. Display message acordingly to backend response
    setWait(true);
    // axios
    //   .post('http://localhost:7000/users/', {
    //     email: e.target.email.value,
    //     password: e.target.password.value
    //   }, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*"
    //     }
    //   })
    //   .then(response => {
    //     console.log(response);
    //     setWait(false);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     setWait(false);
    //   });

    setTimeout(() => {
      setWait(false);
      //setDanger(true);
      setSucc(true);
    }, 1500);
  };

  return(
    <div className="signInWrapper">
      {succ &&
        <SweetAlert
          title="A verification link has been sent to your email account."
          success
          confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
          onConfirm={() => {props.history.push('/browse')}}
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
      <div className="account-pages my-5 pt-sm-5">
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
                        <img src={logo} alt="" className="rounded-circle" height="34" />
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
                          <span className="fs95">By checking this box, you are acknowledging that you have read, understood, and accept our <a href="#" target="_blank" className="font-weight-medium text-primary fs95">Terms & Conditions</a> and <a href="#" target="_blank" className="font-weight-medium text-primary fs95">Privacy Policy</a>, and that you consent to our use of your personal data as described in our <a href="#" target="_blank" className="font-weight-medium text-primary fs95">Privacy Policy</a>. Also you grant us the permission to process, analyze and store uploaded documents.</span>
                        </Label>
                      </AvGroup>

                      {/* TODO:
                      Add official mesoc recaptcha here */}
                      <ReCAPTCHA
                        sitekey="6LcMGQ8aAAAAANsNdayJ6eaZx0q-U8wz3v-4pBBS"
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

export default SignUp;