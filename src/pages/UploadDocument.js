import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Alert } from "reactstrap";

import Sidenav from '../components/sidenav';
import FileDropzone from '../components/fileDropzone';
import FilePreview from '../components/filePreview';

const UploadDocument = ({ userToken }) => {

  const [invalid, setInvalid] = useState(null);
  const [file, setFile] = useState([]);

  const handleSubmit = e => {
    const eventTarget = e.target;
    e.preventDefault();

    console.log(file.length);

    // form validations
    if(eventTarget.title.value === '') {
      setInvalid('Please specify title of your document.');
      return;
    }
    if(eventTarget.language.value === 'Choose document language') {
      setInvalid('Please specify language of your document.');
      return;
    }
    if(eventTarget.city.value === 'Choose a city') {
      setInvalid('Please specify city.');
      return;
    }
    if(file.length === 0) {
      setInvalid('Please upload your document.');
      return;
    }

    // TODO:
    // Send data to backend
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
            <CardTitle>Upload document</CardTitle>
            <CardSubtitle className="mb-3">Submit new document for MESOC analysis.</CardSubtitle>

            {invalid && <Alert color="danger">{invalid}</Alert>}

            <form className="uplForm" onSubmit={handleSubmit}>

              <div className="formField">
                <label className="ffLabel">Title</label>
                <input onInput={() => setInvalid(null)} type="text" name="title" placeholder="Title of your document" className="form-control" />
              </div>
              {/* TODO:
              Fetch language list from backend.
              Find more elegant way of searching this dropdown. */}
              <div className="formField">
                <label className="ffLabel">Language</label>
                <select onInput={() => setInvalid(null)} name="language" className="form-control">
                  <option hidden disabled selected value="Choose document language">Choose document language</option>
                  <option value="bg">Bulgarian</option>
                  <option value="hr">Croatian</option>
                </select>
              </div>
              {/* TODO:
              Add state dropdown list here.
              Consult with team, maybe state and city should be in one list.
              Format: state, city */}

              {/* TODO:
              Fetch city list from backend
              Find more elegant way of searching this dropdown. */}
              <div className="formField">
                <label className="ffLabel">City</label>
                <select onInput={() => setInvalid(null)} name="city" className="form-control">
                  <option hidden disabled selected value="Choose a city">Choose a city</option>
                  <option value="city1">City example 1</option>
                  <option value="city2">Option 2</option>
                  <option value="city3">Some value</option>
                </select>
              </div>
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