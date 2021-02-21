import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const SignIn = ({ history, setUserToken, setAuthCookie, setUserVerified }) => {

  const [err, setErr] = useState(null);
  const [wait, setWait] = useState(false);

  const handleValidSubmit = e => {
    setWait(true);

    axios
      .post('https://api.mesoc.dev/account/login/', {
        username: e.target.email.value,
        password: e.target.password.value
      }, {auth: {
        username: 'api',
        password: '!kAkYk3T'
      }})
      .then(res => {
        console.log(`User data retrieved. Token: ${res.data.token}, Verified: ${res.data.verified}.`);
        setAuthCookie('mesoc_local_user', res.data.token);
        setUserToken(res.data.token);
        setUserVerified(res.data.verified);
        history.push('/my-documents');
      })
      .catch(err => {
        setWait(false);
        setErr(err.response.data.non_field_errors);
      });
  };

  return(
    <div className="signInWrapper">
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
                        <p>Please sign in to continue to MESOC.</p>
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
                        <AvField onInput={() => setErr(null)} name="email" label="Email" className="form-control" type="email" defaultValue="erik55jermanis@gmail.com" required />
                      </div>

                      <div className="form-group">
                        <AvField onInput={() => setErr(null)} name="password" label="Password" className="form-control" type="password" defaultValue="erikMesoc@123" required />
                      </div>

                      <div className="mt-3">
                        <button className="btn btn-primary btn-block wawes-effect waves-light" type="submit">Sign in</button>
                      </div>

                      <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock mr-1"></i> Forgot password?</Link>
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

export default withRouter(SignIn);