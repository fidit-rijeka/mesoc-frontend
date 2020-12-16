import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';

import logo from '../images/mesocLogoBlue.png';

const SignIn = props => {

  const [err, setErr] = useState(null);
  const [wait, setWait] = useState(false);

  const handleValidSubmit = e => {
    setWait(true);
    // TODO:
    // Make call to backend server here. Submit all data.
    // Display message to user acordingly to backend response (success / failure)
    setTimeout(() => {
      if(e.target.email.value === 'a@a.a' && e.target.password.value=== '123') {
        props.history.push('/my-documents');
      } else {
        setWait(false);
        setErr('Wrong credentials. Please try again.');
      }
    }, 1500);
  };

  return(
    <div className="signInWrapper">
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

                      <div className="mt-3">
                        <button className="btn btn-primary btn-block wawes-effect waves-light" type="submit">Sign in</button>
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

export default SignIn;