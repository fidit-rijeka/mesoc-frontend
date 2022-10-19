import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Alert, Input } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

import Sidenav from '../components/sidenav';

const SendFeedback = ({ userToken, history, userVerified }) => {

  const [textAreaBadge, setTextAreaBadge] = useState(false);
  const [textCount, setTextCount] = useState(0);

  const [succ, setSucc] = useState(false);
  const [danger, setDanger] = useState(false);
  const [wait, setWait] = useState(false);

  // USER MANAGEMENT
  // If not authenticated, redirect to sign in.
  if(userToken === null) {
    return <Redirect to="/sign-in" />
  }
  // If not verified, redirect to sign in
  if(userToken && !userVerified) {
    return <Redirect to="/not-verified" />
  }

  const handleSubmit = e => {
    const eventTarget = e.target;
    e.preventDefault();

    setWait(true);

    axios
      .post(`${process.env.REACT_APP_API_DOMAIN}/feedback/`, {
        subject: eventTarget.subject.value,
        message: eventTarget.messageBody.value
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      .then(res => {
        setSucc(true);
        setWait(false);
      })
      .catch(err => {
        setDanger(true);
        setWait(false);
      });
  };

  const textareachange = e => {
    var count = e.target.value.length;

		if(count > 0) {
      setTextAreaBadge(true);
		} else {
      setTextAreaBadge(false);
    }

		setTextCount(e.target.value.length);
	};

  // If not authenticated, redirect to sign in.
  if(userToken === null) {
    return <Redirect to="/sign-in" />
  }

  // TODO:
  // add -> If not verified, redirect to sign in

  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">
        {succ &&
          <SweetAlert
            title="Success."
            success
            confirmBtnBsStyle="btn btn-primary wawes-effect waves-light"
            onConfirm={() => {history.push('/my-documents')}}
          >
            Thank you for your feedback!
          </SweetAlert>
        }
        {danger &&
          <SweetAlert
            title="Oops!"
            danger
            onConfirm={() => { setDanger(false) }}
          >
            Something went wrong.
          </SweetAlert>
        }
        <Card>
          <CardBody>
            <CardTitle>Send feedback</CardTitle>
            <CardSubtitle className="mb-3">Help us improve MESOC toolkit application.</CardSubtitle>

            {wait && <Alert color="secondary">Please wait.</Alert>}

            {/*<form className="uplForm" onSubmit={handleSubmit}>*/}
            <AvForm className="feedbackForm" onValidSubmit={handleSubmit}>
              <AvField
                name="subject"
                placeholder="Subject"
                className="form-control mb-2"
                type="text"
                maxLength="50"
                required
              />

              <AvField
                onChange={(e) => { textareachange(e) }}
                name="messageBody"
                placeholder="Message body"
                className="form-control mb-2"
                type="textarea"
                maxLength="1200"
                rows="10"
                required
              />

              {/*<input type="text" name="subject" maxLength="50" placeholder="Subject" className="form-control mb-2" required />*/}
              {/*<Input
                type="textarea"
                id="textarea"
                onChange={(e) => { textareachange(e) }}
                minLength="120"
                maxLength="1200"
                rows="10"
                placeholder="Message body"
                name="messageBody"
                required
              />*/}
              {textAreaBadge ? (
                <span className="badgecount badge badge-success">
                  {" "}
                  {textCount} / 1200{" "}
                </span>
              ) : null}

              <div className="mt-3 btnFix">
                <button className="btn btn-primary btn-block wawes-effect waves-light" type="submit">Submit</button>
              </div>
            </AvForm>
            {/*</form>*/}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default withRouter(SendFeedback);