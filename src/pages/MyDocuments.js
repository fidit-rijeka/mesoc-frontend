import React, { useState, useEffect } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Table, Card, CardBody, CardTitle, CardSubtitle, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from 'classnames';
import axios from 'axios';

import Sidenav from '../components/sidenav';
import InfoModal from '../components/infoModal';
import AnalysisLoader from '../components/analysisLoader';

const MyDocuments = ({ userToken }) => {

  const [activeTab, setActiveTab] = useState('1');
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [docsData, setDocsData] = useState(null);
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(userToken === null) {
      console.log("user token null")
      return;
    }

    // TODO:
    // Finish and test this request.
    console.log('ovo je use effect');
    console.log(userToken);
    axios
      .get(`https://api.mesoc.dev/documents?state=processing,processed,failed`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      .then(res => {
        console.log('ovo je then');
        console.log(res.data);
        setDocsData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log('ovo je catch');
        console.log(err);
        setLoading(false);
      })
  }, []);

  // First argument: if in "Active documents" -> 'reject'
  //                 if in "Deleted documents" -> 'inform'
  // Second argument: doc id of rendered document
  const openModal = (type, selected) => {
    setDocId(selected);
    setModalType(type);
    setModalText("For this document we weren't able to produce any results.");
    setInfoModalOpen(true);
  };

  const switchTab = index => {
    setLoading(true);
    setDocsData(null);
    setActiveTab(index);
    // TODO:
    // Finish and test this requests.
    if(index === '1') {
      axios
        .get(`https://api.mesoc.dev/documents?state=processing,processed,failed`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then(res => {
          setDocsData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      axios
        .get(`https://api.mesoc.dev/documents?state=dismissed`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then(res => {
          setDocsData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        })
    }
  };

  // If not authenticated, redirect to sign in.
  if(userToken === null) {
    return <Redirect to="/sign-in" />
  }
  

  // TODO:
  // add -> If not verified, redirect to sign in
  /*if(userToken === null) {
    return <Redirect to="/not-verified" />
  }*/

  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">

        <InfoModal type={modalType} text={modalText} modalOpen={infoModalOpen} setModalOpen={setInfoModalOpen} docId={docId} userToken={userToken} />

        <Card>
          <CardBody>
            <CardTitle>My documents</CardTitle>
            <CardSubtitle className="mb-3">Here you can find all of your documents you have uploaded over time.</CardSubtitle>

            <Nav tabs className="nav-tabs-custom hideOnMobile">
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: activeTab === '1'
                  })}
                  onClick={() => switchTab('1')}
                >
                  <span className="d-none d-sm-block">Active</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: activeTab === '2'
                  })}
                  onClick={() => switchTab('2')}
                >
                  <span className="d-none d-sm-block">Failed</span>
                </NavLink>
              </NavItem>
            </Nav>

            <button onClick={() => {activeTab === '1' ? switchTab('2') : switchTab('1')}} className="groupSwitch hideOnDesktop">Switch to active</button>

            {/* TODO:
            Fix Each child in a list should have a unique "key" prop warning */}

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                {loading ?
                  <AnalysisLoader height="200px" /> :
                  docsData.length !== 0 ?
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead className="thead-light">
                          <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Uploaded</th>
                            <th>Language</th>
                            <th>Location</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {docsData.map((doc, index) => {
                            return <tr key={doc.id}>
                              <th scope="row">{index + 1}</th>
                              <td>{doc.title}</td>
                              <td>{doc.uploaded_at}</td>
                              <td>{doc.language.name}</td>
                              <td>{`${doc.location.city}, ${doc.location.country}`}</td>
                              <td>
                                {doc.state === 'processed' ?
                                  <Link to={`document/${doc.id}`} className="btn btn-primary wawes-effect waves-light">Open</Link> :
                                  doc.state === 'processing' ?
                                    <button className="btn btn-primary wawes-effect waves-light" disabled>Processing</button> :
                                    <button onClick={() => openModal('reject', doc.url)} className="btn btn-danger wawes-effect waves-light">Failed</button>
                                }
                              </td>
                            </tr>
                          })}
                        </tbody>
                      </Table>
                    </div> : 
                    <div className="analysisEmpty" style={{ height: '200px' }}>You have no active documents</div>
                }
              </TabPane>
              <TabPane tabId="2">
                {loading ?
                  <AnalysisLoader height="200px" /> :
                  docsData.length !== 0 ?
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead className="thead-light">
                          <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Uploaded</th>
                            <th>Language</th>
                            <th>Location</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {docsData.map((doc, index) => {
                            return <tr key={doc.id}>
                              <th scope="row">{index + 1}</th>
                              <td>{doc.title}</td>
                              <td>{doc.uploaded_at}</td>
                              <td>{doc.language.name}</td>
                              <td>{`${doc.location.city}, ${doc.location.country}`}</td>
                              <td>
                                <button onClick={() => openModal('inform', doc.id)} className="btn btn-info wawes-effect waves-light">Info</button>
                              </td>
                            </tr>
                          })}
                        </tbody>
                      </Table>
                    </div> : 
                    <div className="analysisEmpty" style={{ height: '200px' }}>You have no failed documents</div>
                }
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default withRouter(MyDocuments);