import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Alert, FormGroup, Label, Input } from "reactstrap";
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';

import Sidenav from '../components/sidenav';
import FileDropzone from '../components/fileDropzone';
import FilePreview from '../components/filePreview';

let langTimeout = null;
let locTimeout = null;

const UploadDocument = ({ userToken, history }) => {

  const [invalid, setInvalid] = useState(null);

  const [langOptions, setLangOptions] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [langLoading, setLangLoading] = useState(false);

  const [locOptions, setLocOptions] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  const [file, setFile] = useState([]);

  const [succ, setSucc] = useState(false);
  const [danger, setDanger] = useState(false);
  const [wait, setWait] = useState(false);

  const handleSubmit = e => {
    const eventTarget = e.target;
    e.preventDefault();

    // form validations
    if(eventTarget.title.value === '') {
      setInvalid('Please specify title of your document.');
      return;
    }
    if(eventTarget.language.value === '') {
      setInvalid('Please specify language of your document.');
      return;
    }
    if(eventTarget.location.value === '') {
      setInvalid('Please specify location.');
      return;
    }
    if(file.length === 0) {
      setInvalid('Please upload your document.');
      return;
    }

    setWait(true);

    // TODO:
    // Send data to backend and set succ/danger acordingly
    setTimeout(() => {
      setSucc(true);
      setWait(false);
    }, 1000);
  };

  const langSearch = parameter => {
    if(parameter === '') {
      setLangLoading(false);
      setLangOptions([]);
      clearTimeout(langTimeout);
      return;
    }

    setLangLoading(true);
    // Cancel any previous search attempts.
    clearTimeout(langTimeout);

    // Wait .6 seconds before starting a search
    // TODO:
    // Ask Anto if this is a correct way of doing this.
    langTimeout = setTimeout(() => {
      setTimeout(() => {
        // TODO:
        // Fetch language list based on params and set to state only if selectedLang !== null
        setLangOptions(
          [
            { label: 'Language 1', value: 'language1' },
            { label: 'Language 2', value: 'language2' },
            { label: 'Language 3', value: 'language3' }
          ]
        );
        setLangLoading(false);
      }, 1000);
    }, 600);
  };

  const langSelecChg = input => {
    setInvalid(null);
    setSelectedLang(input);
  };

  const locSearch = parameter => {
    if(parameter === '') {
      setLocLoading(false);
      setLocOptions([]);
      clearTimeout(locTimeout);
      return;
    }

    setLocLoading(true);
    // Cancel any previous search attempts.
    clearTimeout(locTimeout);

    // Wait .6 seconds before starting a search
    locTimeout = setTimeout(() => {
      setTimeout(() => {
        // TODO:
        // Fetch location list based on params and set to state only if selectedLoc !== null
        setLocOptions(
          [
            { label: 'Croatia, Rijeka', value: 'croatia rijeka' },
            { label: 'Milano, Italy', value: 'milano italy' }
          ]
        );
        setLocLoading(false);
      }, 1000);
    }, 600);
  };

  const locSelecChg = input => {
    setInvalid(null);
    setSelectedLoc(input);
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
            Your document is succesfuly submited to MESOC analysis. You will get notified by e-mail when we are done with processing your document.
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
            <CardTitle>Upload document</CardTitle>
            <CardSubtitle className="mb-3">Submit new document for MESOC analysis.</CardSubtitle>

            {invalid && <Alert color="danger">{invalid}</Alert>}
            {wait && <Alert color="secondary">Please wait.</Alert>}

            <form className="uplForm" onSubmit={handleSubmit}>

              <FormGroup className="select2-container formField">
                <Label>Title</Label>
                <Input onInput={() => setInvalid(null)} type="text" name="title" placeholder="Title of your document" className="form-control" />
              </FormGroup>

              <FormGroup className="ajax-select select2-container formField">
                <Label>Language</Label>
                <Select
                  name="language"
                  value={selectedLang}
                  onInputChange={event => langSearch(event)}
                  onChange={event => langSelecChg(event)}
                  options={langOptions}
                  isLoading={langLoading}
                />
              </FormGroup>

              <FormGroup className="ajax-select select2-container formField">
                <Label>Location</Label>
                <Select
                  name="location"
                  value={selectedLoc}
                  onInputChange={event => locSearch(event)}
                  onChange={event => locSelecChg(event)}
                  options={locOptions}
                  isLoading={locLoading}
                />
              </FormGroup>

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

export default withRouter(UploadDocument);