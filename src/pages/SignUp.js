import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container, Label } from "reactstrap";
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import SweetAlert from 'react-bootstrap-sweetalert';

import logo from '../images/mesocLogoBlue.png';

const SignUp = props => {

  const [err, setErr] = useState(null);
  const [succ, setSucc] = useState(false);
  const [wait, setWait] = useState(false);
  const [danger, setDanger] = useState(false);

  // TODO
  // Update this function to comunicate with backend.
  const handleValidSubmit = e => {
    if(e.target.password.value !== e.target.repeatPassword.value) {
      setErr('Passwords don\'t match. Please try again.');
      return;
    }
    setWait(true);
    // TODO
    // setTimeout is only temporary, needs to be replaced with call to a backend server
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
          Please click on the link that has just been sent to your email account to verify your email and continue the registration process.
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
                        <AvField name="email" label="Email" className="form-control" type="email" required />
                      </div>

                      <div className="form-group">
                        <AvField name="password" label="Password" className="form-control" type="password" required />
                      </div>

                      <div className="form-group">
                        <AvField name="repeatPassword" label="Repeat password" className="form-control" type="password" required />
                      </div>

                      <AvGroup check>
                        <Label check>
                          <AvInput type="checkbox" name="agree" required />
                          <span className="fs95">I agree that you can store my e-mail address.<br/></span>
                          <a href="http://localhost:4001" target="_blank" className="font-weight-medium text-primary fs95">Read more</a>
                        </Label>
                      </AvGroup>

                      {/* TODO
                      Add react-google-recaptcha here */}

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