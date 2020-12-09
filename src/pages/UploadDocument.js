import React, { useState } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Alert } from "reactstrap";

import Sidenav from '../components/sidenav';
import FileDropzone from '../components/fileDropzone';
import FilePreview from '../components/filePreview';

const UploadDocument = () => {

  const [invalid, setInvalid] = useState(null);
  const [customchk, setCustomchk] = useState(false);
  const [file, setFile] = useState([]);

  // TODO:
  // Update this function to communicate with backend
  // Finish validation
  const handleUpload = e => {
    e.preventDefault();
    setInvalid(null);
    console.log(file.length);
    if(e.target.language.value === 'Choose document language') {
      setInvalid('Please fill out all fields.');
      setTimeout(() => setInvalid(null), 5000);
      return;
    }
    if(file.length === 0) {
      setInvalid('Please upload your document.');
      setTimeout(() => setInvalid(null), 5000);
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

            {invalid && <Alert color="danger">{invalid}</Alert>}

            <form className="uplForm" onSubmit={handleUpload}>

              <div className="formField">
                <label className="ffLabel">Title</label>
                <input type="text" name="title" placeholder="Title of your document" className="form-control" />
              </div>
              {/* TODO:
              Make this list a bit more elegant.
              For example load cities from external json or make request from a server to make it customizable. */}
              <div className="formField">
                <label className="ffLabel">Language</label>
                <select name="language" className="form-control">
                  <option hidden disabled selected value="Choose document language">Choose document language</option>
                  <option value="bg">Bulgarian</option>
                  <option value="hr">Croatian</option>
                  <option value="cs">Czech</option>
                  <option value="da">Danish</option>
                  <option value="nl">Dutch</option>
                  <option value="en">English</option>
                  <option value="ek">Estonian</option>
                  <option value="fi">Finish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="el">Greek</option>
                  <option value="hu">Hungarian</option>
                  <option value="ga">Irish</option>
                  <option value="it">Italian</option>
                  <option value="lv">Latvian</option>
                  <option value="lt">Lithuanian</option>
                  <option value="mt">Maltese</option>
                  <option value="pl">Polish</option>
                  <option value="pt">Portuguese</option>
                  <option value="ro">Romanian</option>
                  <option value="sk">Slovak</option>
                  <option value="sl">Slovenian</option>
                  <option value="es">Spanish</option>
                  <option value="sv">Swedish</option>
                </select>
              </div>
              {/* TODO:
              Turn this into a select list with list of supported cities (find on slack) */}
              <div className="formField">
                <label className="ffLabel">City</label>
                <input type="text" name="city" placeholder="Choose a city" className="form-control" />
              </div>
              <div className="custom-control custom-checkbox mb-3 mt-3">
                <input type="checkbox" className="custom-control-input" id="CustomCheck1" onChange={() => false} checked={customchk} />
                <label className="custom-control-label fs952" onClick={() => { setCustomchk(!customchk); }} >I want my document to be private</label>
              </div>
              {/* TODO:
              Add dropzone for uploading documents here */}
              <FileDropzone setFile={setFile} setInvalid={setInvalid} />
              {file.length ? <FilePreview setFile={setFile} fileName={file[0].name} /> : null}
              
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