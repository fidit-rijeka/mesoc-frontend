import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Alert, Input } from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

import Sidenav from '../components/sidenav';

const SendFeedback = ({ userToken, history }) => {

  const [textAreaBadge, setTextAreaBadge] = useState(false);
  const [textCount, setTextCount] = useState(0);

  const [succ, setSucc] = useState(false);
  const [danger, setDanger] = useState(false);
  const [wait, setWait] = useState(false);

  const handleSubmit = e => {
    const eventTarget = e.target;
    e.preventDefault();

    setWait(true);
    // TODO:
    // Verify this request and uncomment it.

    // axios
    //   .post('https://docs.mesoc.dev/feedback/', {
    //     subject: e.target.subject.value,
    //     message: e.target.messageBody.value
    //   }, {
    //     headers: {
    //       Authorization: `Bearer ${userToken}`
    //     }
    //   })
    //   .then(res => {
    //     setSucc(true);
    //     setWait(false);
    //     history.push('/my-documents');
    //   })
    //   .catch(err => {
    //     setDanger(true);
    //     setWait(false);
    //   });

    setTimeout(() => {
      setSucc(true);
      setWait(false);
    }, 1000);
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

            <form className="uplForm" onSubmit={handleSubmit}>
              <input type="text" name="subject" placeholder="Subject" className="form-control mb-2" required />
              <Input
                type="textarea"
                id="textarea"
                onChange={(e) => { textareachange(e) }}
                maxLength="1200"
                rows="10"
                placeholder="Message body"
                name="messageBody"
                required
              />
              {textAreaBadge ? (
                <span className="badgecount badge badge-success">
                  {" "}
                  {textCount} / 1200{" "}
                </span>
              ) : null}
              
              <div className="mt-3 btnFix">
                <button className="btn btn-primary btn-block wawes-effect waves-light" type="submit">Submit</button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default withRouter(SendFeedback);