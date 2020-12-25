import React, { useState, useEffect } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Table, Card, CardBody, CardTitle, CardSubtitle, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from 'classnames';

import Sidenav from '../components/sidenav';
import InfoModal from '../components/infoModal';
import AnalysisLoader from '../components/analysisLoader';

const MyDocuments = ({ userToken }) => {

  const [activeTab, setActiveTab] = useState('1');
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [docsData, setDocsData] = useState(null);
  const [docIndex, setDocIndex] = useState(null);

  useEffect(() => {
    if(userToken === null) {
      return;
    }

    // TODO:
    // Fetch documents data here and put that data into state
    setTimeout(() => {
      setDocsData([
        {
          id: 'doc1',
          title: 'Text About Wine',
          uploaded: '21/12/2021',
          language: 'English',
          location: 'Milano, Italy',
          status: 'finished'
        },
        {
          id: 'doc12',
          title: 'Text about something really important',
          uploaded: '21/12/2021',
          language: 'English',
          location: 'Milano, Italy',
          status: 'processing'
        },
        {
          id: 'doc123',
          title: 'Example',
          uploaded: '21/12/2021',
          language: 'English',
          location: 'Milano, Italy',
          status: 'failed',
          info: 'For your document we produced no results.'
        }
      ])
    }, 1000);
  }, []);

  // First argument: if in "Active documents" -> 'reject'
  //                 if in "Deleted documents" -> 'inform'
  // Second argument: index of rendered document
  const openModal = (type, selected) => {
    setDocIndex(selected);
    setModalType(type);
    setModalText(docsData[selected].info);
    setInfoModalOpen(true);
  };

  const switchTab = index => {
    setDocsData(null);
    setActiveTab(index);
    if(index === '1') {
      setTimeout(() => {
        setDocsData([
          {
            id: 'doc1',
            title: 'Text About Wine',
            uploaded: '21/12/2021',
            language: 'English',
            location: 'Milano, Italy',
            status: 'finished'
          },
          {
            id: 'doc12',
            title: 'Text about something really important',
            uploaded: '21/12/2021',
            language: 'English',
            location: 'Milano, Italy',
            status: 'processing'
          },
          {
            id: 'doc123',
            title: 'Example',
            uploaded: '21/12/2021',
            language: 'English',
            location: 'Milano, Italy',
            status: 'failed',
            info: 'For your document we produced no results.'
          }
        ])
      }, 1000);
    } else {
      setTimeout(() => {
        setDocsData([
          {
            id: 'doc1234',
            title: 'Text About Wine',
            uploaded: '21/12/2021',
            language: 'English',
            location: 'Milano, Italy',
            status: 'failed',
            info: 'For your document we produced no results.'
          }
        ])
      }, 1000);
    }
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

        <InfoModal type={modalType} text={modalText} modalOpen={infoModalOpen} setModalOpen={setInfoModalOpen} docIndex={docIndex} />

        <Card>
          <CardBody>
            <CardTitle>My documents</CardTitle>
            <CardSubtitle className="mb-3">Here you can find all of your documents you have uploaded over time.</CardSubtitle>

            <Nav tabs className="nav-tabs-custom">
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({
                    active: activeTab === '1'
                  })}
                  onClick={() => switchTab('1')}
                >
                  <span className="d-none d-sm-block">Active documents</span>
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
                  <span className="d-none d-sm-block">Failed documents</span>
                </NavLink>
              </NavItem>
            </Nav>

            {/* TODO:
            Fetch and display tables from backend server.
            Create view for "you haven't uploaded any documents" and "you haven't deleted any documents" */}

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                {docsData !== null ?
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
                            <td>{doc.uploaded}</td>
                            <td>{doc.language}</td>
                            <td>{doc.location}</td>
                            <td>
                              {doc.status === 'finished' ?
                                <Link to={`document/${doc.id}`} className="btn btn-primary wawes-effect waves-light">Open</Link> :
                                doc.status === 'processing' ?
                                  <button className="btn btn-primary wawes-effect waves-light" disabled>Processing</button> :
                                  <button onClick={() => openModal('reject', index)} className="btn btn-danger wawes-effect waves-light">Failed</button>
                              }
                            </td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
                  </div> :
                  <AnalysisLoader height="200px" />
                }
              </TabPane>
              <TabPane tabId="2">
                {docsData !== null ?
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
                            <td>{doc.uploaded}</td>
                            <td>{doc.language}</td>
                            <td>{doc.location}</td>
                            <td>
                              <button onClick={() => openModal('inform', index)} className="btn btn-info wawes-effect waves-light">Info</button>
                            </td>
                          </tr>
                        })}
                      </tbody>
                    </Table>
                  </div> :
                  <AnalysisLoader height="200px" />
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