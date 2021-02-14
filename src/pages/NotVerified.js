import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const SignIn = ({ history, setUserToken, setAuthCookie }) => {

  const [err, setErr] = useState(null);
  const [wait, setWait] = useState(false);

  return(
    <div className="signInWrapper">
      <div className="account-pages my-5 pt-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={5} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-soft-primary">
                  <Row>
                    <Col className="col-12">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Verify your account!</h5>
                        <p>Before continuing, you need to verify your account.</p>
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
                  <Link to={`browse`} className="btn btn-primary wawes-effect waves-light mr-3">
                        Go back
                  </Link>
                  <Link to={`placeholder`} className="btn btn-primary wawes-effect waves-light">
                        Re-send verification mail
                  </Link>
                  <div className="p-2">
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