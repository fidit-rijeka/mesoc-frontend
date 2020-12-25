import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Alert, Input } from "reactstrap";

import Sidenav from '../components/sidenav';

const SendFeedback = ({ userToken }) => {

  const [textAreaBadge, setTextAreaBadge] = useState(false);
  const [textCount, setTextCount] = useState(0);

  const handleSubmit = e => {
    const eventTarget = e.target;
    e.preventDefault();

    // TODO:
    // Submit data to backend.
    console.log(eventTarget.subject.value, eventTarget.messageBody.value);
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
      <Card>
          <CardBody>
            <CardTitle>Send feedback</CardTitle>
            <CardSubtitle className="mb-3">Help us improve MESOC toolkit application.</CardSubtitle>

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

export default SendFeedback;