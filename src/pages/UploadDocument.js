import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Alert, FormGroup, Label, Input } from "reactstrap";
import { AvForm, AvField } from 'availity-reactstrap-validation';
import Select from 'react-select';
import SweetAlert from 'react-bootstrap-sweetalert';
import axios from 'axios';

import Sidenav from '../components/sidenav';
import FileDropzone from '../components/fileDropzone';
import FilePreview from '../components/filePreview';

let locTimeout = null;

const UploadDocument = ({ userToken, history, userVerified }) => {

  const [invalidLanguage, setInvalidLanguage] = useState(null)
  const [invalidLocation, setInvalidLocation] = useState(null)
  const [invalidType, setInvalidType] = useState(null)
  const [invalidUpload, setInvalidUpload] = useState(null)

  const [invalid, setInvalid] = useState(null);

  const [langOptions, setLangOptions] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);

  const [locOptions, setLocOptions] = useState([]);
  const [selectedLoc, setSelectedLoc] = useState(null);
  const [fullLocData, setFullLocData] = useState([]);
  const [locLoading, setLocLoading] = useState(false);

  const [typeOptions, setTypeOptions] = useState([
    { label: 'Scientific', value: 'scientific' },
    { label: 'Pilot', value: 'pilot' }
  ]);
  const [selectedType, setSelectedType] = useState(null);

  const [file, setFile] = useState([]);

  const [succ, setSucc] = useState(false);
  const [danger, setDanger] = useState(false);
  const [wait, setWait] = useState(false);

  const [textAreaBadge, setTextAreaBadge] = useState(false);
  const [textCount, setTextCount] = useState(0);

  useEffect(() => {
    console.log(userToken);
    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}/languages`, {headers: {
        Authorization: `Bearer ${userToken}`
      }})
      .then(async res => {
        let langsToAdd = [];
        await res.data.forEach(lang => {
          langsToAdd.push({ label: lang.name, value: lang.url });
        });
        setLangOptions(langsToAdd);
      });
  }, []);

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

    let isInvalidForm = false

    // form validations
    if(eventTarget.language.value === '') {
      setInvalidLanguage('This field is invalid.')
      isInvalidForm = true
    }

    if(eventTarget.location.value === '') {
      setInvalidLocation('This field is invalid.')
      isInvalidForm = true
    }
    if(eventTarget.type.value === '') {
      setInvalidType('This field is invalid.')
      isInvalidForm = true
    }

    if(file.length === 0) {
      setInvalidUpload('Please upload your document.')
      isInvalidForm = true
    }

    // Break if invalid.
    if (isInvalidForm) {
      return
    }

    console.log(eventTarget.title.value);
    console.log(eventTarget.language.value);
    console.log(eventTarget.location.value);
    console.log(file[0]);

    setWait(true);

    let formData = new FormData();
    formData.append('title', eventTarget.title.value);
    formData.append('language', eventTarget.language.value);
    formData.append('location', eventTarget.location.value);
    formData.append('type', eventTarget.type.value);
    formData.append('abstract', eventTarget.documentAbstract.value);
    formData.append('file', file[0]);

    axios
      .post(`${process.env.REACT_APP_API_DOMAIN}/documents/`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        setWait(false);
        setSucc(true);
      })
      .catch(err => {
        console.log(err.response);
        setWait(false);
        if(err.response.data.title[0]) {
          setInvalid(err.response.data.title[0]);
        } else if(err.response.data.language[0]) {
          setInvalid(err.response.data.language[0]);
        } else if(err.response.data.location[0]) {
          setInvalid(err.response.data.location[0]);
        } else if(err.response.data.file[0]) {
          setInvalid(err.response.data.file[0]);
        } else {
          setDanger(true);
        }
      });
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
      if(locSearch !== null) {
        axios
        .get(`${process.env.REACT_APP_API_DOMAIN}/locations?address=${parameter}`, {headers: {
          Authorization: `Bearer ${userToken}`
        }})
        .then(async res => {
          let locsToAdd = [];
          setFullLocData(res.data);
          await res.data.forEach(loc => {
            locsToAdd.push({ label: loc.address, value: loc.address });
          });
          console.log(res.data);
          console.log(locsToAdd);
          setLocOptions(locsToAdd);
          setLocLoading(false);
        });
      }
    }, 600);
  };

  const langSelecChg = input => {
    setInvalid(null);
    setInvalidLanguage(null)
    setSelectedLang(input);
  };

  const locSelecChg = input => {
    setInvalid(null);
    setInvalidLocation(null)
    setSelectedLoc(input);
  };

  const typeSelecChg = input => {
    setInvalid(null);
    setInvalidType(null)
    setSelectedType(input);
  };

  const textareachange = e => {
    var count = e.target.value.length;
    setInvalid(null);

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

            {/*<form className="uplForm" onSubmit={handleSubmit}>*/}
            <AvForm className="uplForm" onValidSubmit={e => handleSubmit(e)}>

              <FormGroup className="select2-container formField">
                <AvField
                  onInput={() => setInvalid(null)}
                  name="title"
                  label="Title"
                  placeholder="Title of your document"
                  className="form-control"
                  type="text"
                  required
                />
              </FormGroup>

              <FormGroup className="ajax-select select2-container formField">
                <Label>Language</Label>
                <Select
                  name="language"
                  value={selectedLang}
                  onChange={event => langSelecChg(event)}
                  options={langOptions}
                />
                {invalidLanguage && (<div class="invalid-feedback d-block">{invalidLanguage}</div>)}
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
                {invalidLocation && (<div class="invalid-feedback d-block">{invalidLocation}</div>)}
              </FormGroup>

              <FormGroup className="ajax-select select2-container formField">
                <Label>Type</Label>
                <Select
                  name="type"
                  value={selectedType}
                  onChange={event => typeSelecChg(event)}
                  options={typeOptions}
                />
                {invalidType && (<div class="invalid-feedback d-block">{invalidType}</div>)}
              </FormGroup>

              <FormGroup className="ajax-select select2-container formField">
                <AvField
                  onChange={(e) => { textareachange(e) }}
                  placeholder="Document abstract"
                  name="documentAbstract"
                  label="Acstract"
                  className="form-control"
                  type="textarea"
                  minLength="1"
                  maxLength="1000"
                  rows="10"
                  required
                />

                {/*<Label>Abstract</Label>
                <Input
                  type="textarea"
                  id="textarea"
                  onChange={(e) => { textareachange(e) }}
                  minLength="1"
                  maxLength="1000"
                  rows="10"
                  placeholder="Document abstract"
                  name="documentAbstract"
                />*/}
                {textAreaBadge ? (
                  <span className="badgecount badge badge-success">
                    {" "}
                    {textCount} / 1000{" "}
                  </span>
                ) : null}
              </FormGroup>

              <FileDropzone setFile={setFile} setInvalid={setInvalidUpload} />
              {file.length ? <FilePreview setFile={setFile} fileName={file[0].name} /> : null}
              {invalidUpload && (<div class="invalid-feedback d-block">{invalidUpload}</div>)}

              <div className="mt-3 btnFix">
                <button className="btn btn-primary btn-block wawes-effect waves-light" type="submit">Submit</button>
              </div>
            {/*</form>*/}
            </AvForm>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default withRouter(UploadDocument);