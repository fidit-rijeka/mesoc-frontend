import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

import logo from '../images/mesocLogoBlue.png';

const VerificationProcess = ({ match, history, userToken, userVerified }) => {

  const [succ, setSucc] = useState(false);
  const [danger, setDanger] = useState(false);

  useEffect(() => {
    // TODO => (Maybe this is extra work and doesn't need to be modified) Only do this if used is not logged in
    /*if (!userToken && !userVerified) {*/
      axios
      .get(`https://api.mesoc.dev/account/verification/confirmation`, {
        // body
        "uuid": `${match.params.uuidKey}`
      }, {
        /*headers: {
          Authorization: `Bearer ${userToken}`
        }*/
      })
      .then(res => {
        console.log(res.data);
        setSucc(); 
        
      })
      .catch(err => {
        console.log(err);
        setDanger(true);
      })
   /* }*/
  }, []);
  
  return(
    <div className="signInWrapper">

      {succ &&
        <SweetAlert
          title="Success!"
          success
          confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
          onConfirm={() => {history.push('/browse')}}
        >
          Your account has been verified. Press the button below to expore MESOC.
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
          {/*<Row className="justify-content-center">
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
                  <Link to={`placeholder`} className="btn btn-primary btn-block wawes-effect waves-light">
                        Verify account
                  </Link>
                  <div className="p-2">
                  </div>
                </div>
                </CardBody>
              </Card>
            </Col>
          </Row>*/}
        </Container>
      </div>
    </div>
  );
};

export default withRouter(VerificationProcess);