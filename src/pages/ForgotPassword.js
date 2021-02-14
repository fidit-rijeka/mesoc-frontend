import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const ForgotPassword = ({ history }) => {

  const [err, setErr] = useState(null);
  const [wait, setWait] = useState(false);
  const [succ, setSucc] = useState(false);

  const handleValidSubmit = e => {
    setWait(true);
    console.log(e.target.email.value);

    axios
      .post(`https://api.mesoc.dev/account/password_reset/`, {
        email: e.target.email.value
      }, {
        auth: {
          username: 'api',
          password: '!kAkYk3T'
        }
      })
      .then(res => {
        setWait(false);
        setSucc(true);
        console.log(res);
      })
      .catch(err => {
        setWait(false);
        setErr('Oops! Something went wrong.');
        console.log(err.response);
      })
  };

  return(
    <div className="signInWrapper">
      {succ &&
        <SweetAlert
          title="A reset link has been sent to your email account."
          success
          confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
          onConfirm={() => {history.push('/sign-in')}}
        >
          Please click on the link that has just been sent to your email account to reset your password. Be sure to check your spam folder.
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
                        <h5 className="text-primary">Forgot password?</h5>
                        <p>Enter your e-mail address and we will send you link for password reset.</p>
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

                      <div className="mt-3">
                        <button className="btn btn-primary btn-block wawes-effect waves-light" type="submit">Submit</button>
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

export default withRouter(ForgotPassword);