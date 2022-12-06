import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const ResetPassword = ({ history, match }) => {

  const [err, setErr] = useState(null);
  const [wait, setWait] = useState(false);
  const [succ, setSucc] = useState(false);

  const handleValidSubmit = e => {
    if(e.target.password.value !== e.target.repeatPassword.value) {
      setErr('Passwords don\'t match. Please try again.');
      return;
    }
    
    setWait(true);

    axios
      .post(`${process.env.REACT_APP_API_DOMAIN}/account/password_reset/confirmation/`, {
        uuid: match.params.token,
        password: e.target.password.value
      }, {
        auth: {
          username: 'api',
          password: '!kAkYk3T'
        }
      })
      .then(res => {
        setWait(false);
        setSucc(true);
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
          title="Success!"
          success
          confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
          onConfirm={() => {history.push('/sign-in')}}
        >
          Your password has been successfuly updated.
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
                        <h5 className="text-primary">Reset password</h5>
                        <p>Create and confirm your new password.</p>
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
                        <AvField onInput={() => setErr(null)} name="password" label="Password" className="form-control" type="password" required />
                      </div>

                      <div className="form-group">
                        <AvField onInput={() => setErr(null)} name="repeatPassword" label="Repeat password" className="form-control" type="password" required />
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

export default withRouter(ResetPassword);