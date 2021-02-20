import React, { useState } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Row, Col, CardBody, Card, Container } from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const NotVerfied = ({ userToken, history }) => {

  const [wait, setWait] = useState(false);
  const [succ, setSucc] = useState(false);
  const [danger, setDanger] = useState(false);

  // If not authenticated, redirect to sign in.
  if(userToken === null) {
    return <Redirect to="/sign-in" />
  }

  const resendVerificationLink = () => {
    // TODO: (Feb 20, 2021) => CORS error. Test when it gets fixed.
    // TODO: (Feb 20, 2021) => modal should be added on button press.
    axios
      .post(`https://api.mesoc.dev/account/verification/`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      .then(res => setSucc(true))
      .catch(err => setDanger(true));
  };

  return(
    <div className="signInWrapper">
      {succ &&
        <SweetAlert
          title="Success!"
          success
          confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
          onConfirm={() => {history.push('/browse')}}
        >
          Verification link has been sent to your account.
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
                    <Col className="col-12">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Verify your account!</h5>
                        <p>Before continuing, you need to verify your account. Please go to your email and click on the verification link.</p>
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
                  <button onClick={() => resendVerificationLink()} className="btn btn-primary wawes-effect waves-light">Resend verification link</button>
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

export default withRouter(NotVerfied);