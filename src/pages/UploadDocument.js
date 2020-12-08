import React, { useState } from 'react';
import { Table, Card, CardBody, CardTitle, CardSubtitle, Alert, Nav, NavItem, NavLink, TabContent, TabPane, Modal } from "reactstrap";

import Sidenav from '../components/sidenav';

const UploadDocument = () => {

  const [invalid, setInvalid] = useState(false);
  const [customchk, setCustomchk] = useState(false);

  // TODO
  // Update this function to communicate with backend
  // Finish validation
  const handleUpload = e => {
    e.preventDefault();
    setInvalid(false);
    if(e.target.title.value === '') {
      setInvalid(true);
      setTimeout(() => setInvalid(false), 5000);
      return;
    }
  };

  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">
        <Card>
          <CardBody>
            <CardTitle>Upload document</CardTitle>
            <CardSubtitle className="mb-3">Submit new document for MESOC analysis.</CardSubtitle>

            {invalid && <Alert color="danger">Please fill out all fields.</Alert>}

            <form className="uplForm" onSubmit={handleUpload}>

              <div className="formField">
                <label className="ffLabel">Title</label>
                <input type="text" name="title" placeholder="Title of your document" className="form-control" />
              </div>
              <div className="formField">
                <label className="ffLabel">Language</label>
                <input type="text" name="title" placeholder="Language of your document" className="form-control" />
              </div>
              {/* TODO
              Turn this into a select list with list of supported cities (find on slack) */}
              <div className="formField">
                <label className="ffLabel">City</label>
                <input type="text" name="title" placeholder="Choose a city" className="form-control" />
              </div>
              {/* TODO
              Turn this into a select list with list of supported languages (find on slack) */}
              <div className="custom-control custom-checkbox mb-3 mt-3">
                <input type="checkbox" className="custom-control-input" id="CustomCheck1" onChange={() => false} checked={customchk} />
                <label className="custom-control-label fs952" onClick={() => { setCustomchk(!customchk); }} >I want my document to be private</label>
              </div>
              {/* TODO
              Add dropzone for uploading documents here */}
              
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

export default UploadDocument;