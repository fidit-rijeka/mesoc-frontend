import React, { useState } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import InfoModal from '../components/infoModal';
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const NotVerfied = ({ userToken }) => {

  const [err, setErr] = useState(null);
  const [wait, setWait] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalText, setModalText] = useState(null);

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
      .then(res => {
        console.log(`User resend verificationklink sent.`)
        console.log(res)
      })
      .catch(err => {
        console.log(`Error occured when trying to send user verification link. Error log should show up below.`)
        console.log(err)
      })
  };

  // Opens when user clicks resend button
  const openModal = (type, selected) => {
    setModalType(type);
    setModalText("For this document we weren't able to produce any results.");
    setInfoModalOpen(true);
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