import React, { useState, useEffect, useRef } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Table, Card, CardBody, CardTitle, CardSubtitle, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from 'classnames';
import axios from 'axios';
import dayjs from 'dayjs';

import Sidenav from '../components/sidenav';
import InfoModal from '../components/infoModal';
import FiltersModal from '../components/filtersModal';
import AnalysisLoader from '../components/analysisLoader';

const inactiveStatuses = [
  'active',     // This is like pending state.
  'processing',
  'dismissed'
]

const getBadgeClass = (status) => {
  let cls = 'badge border text-capitalize p-2 '

  if (inactiveStatuses.includes(status)) {
    cls += 'text-secondary'
  }

  if (status === 'processed') {
    cls += 'text-success'
  }

  if (status === 'failed') {
    cls += 'text-danger'
  }

  return cls
}

const MyDocuments = ({ userToken, userVerified }) => {

  const filtersRef = useRef(null);

  const [activeTab, setActiveTab] = useState('1');
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [docsData, setDocsData] = useState([]);
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true)
  const [allData, setAllData] = useState([])
  const [filtersTemp, setFiltersTemp] = useState(null)

  const getCustomizedData = (items) => {
    return items.map(item => ({
      ...item,
      language_id: item.language.name,
      location_id: item.location.address,
    }))
  }

  useEffect(() => {
    // TODO:
    // Finish and test this request.
    if (userToken && userVerified) {
      axios
      .get(`${process.env.REACT_APP_API_DOMAIN}/documents?state=active`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      .then(res => {
        console.log(getCustomizedData(res.data));
        setDocsData(getCustomizedData(res.data));

        if (initialLoad) {
          setAllData(getCustomizedData(res.data))
          setInitialLoad(false)
        }

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })
    }
  }, []);

  // First argument: if in "Active documents" -> 'reject'
  //                 if in "Deleted documents" -> 'inform'
  // Second argument: doc id of rendered document
  const openModal = (type, selected) => {
    setDocId(selected);
    setModalType(type);
    setModalText("By pressing submit you agree to delete your document from the system.");
    setInfoModalOpen(true);
  };

  const switchTab = index => {
    setInitialLoad(true)
    setLoading(true);
    setDocsData(null);
    setActiveTab(index);

    if(index === '1') {
      axios
        .get(`${process.env.REACT_APP_API_DOMAIN}/documents?state=active`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then(res => {
          setDocsData(getCustomizedData(res.data));
          filtersRef.current.reset(res.data)
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      axios
        .get(`${process.env.REACT_APP_API_DOMAIN}/documents?state=dismissed`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then(res => {
          setDocsData(getCustomizedData(res.data));
          filtersRef.current.reset(res.data)
          setLoading(false);
        })
        .catch(err => {
          console.log(err);
        })
    }
  };

  const actionCompleted = () => {
    switchTab(activeTab)
    setInfoModalOpen(false);
  }

  const showFiltersModal = () => {
    setFiltersModalOpen(true)
  }

  // USER MANAGEMENT
  // If not authenticated, redirect to sign in.
  if(userToken === null) {
    return <Redirect to="/sign-in" />
  }
  // If not verified, redirect to not verified page
  if(userToken && !userVerified) {
    return <Redirect to="/not-verified" />
  }

  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">

        <InfoModal
          type={modalType}
          text={modalText}
          modalOpen={infoModalOpen}
          setModalOpen={setInfoModalOpen}
          docId={docId}
          userToken={userToken}
          actionCompleted={actionCompleted}
          action="deleteDocument"
        />

        <FiltersModal
          ref={filtersRef}
          userToken={userToken}
          modalOpen={filtersModalOpen}
          setModalOpen={setFiltersModalOpen}
          docsData={docsData}
          setDocsData={setDocsData}
          allData={allData}
          filtersTemp={filtersTemp}
          setFiltersTemp={setFiltersTemp}
        />

        <Card>
          <CardBody>
            <div className='flexed'>
              <div>
                <CardTitle>My documents</CardTitle>
                <CardSubtitle className="mb-3">Here you can find all of your documents you have uploaded over time.</CardSubtitle>
              </div>

              <button onClick={showFiltersModal} className='btn btn-warning btn-filters'>
                Filter Results
              </button>
            </div>

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
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {docsData.map((doc, index) => {
                            return <tr key={`first_${index}`}>
                              <th scope="row">{index + 1}</th>
                              <td>{doc.title}</td>
                              <td>{dayjs(doc.uploaded_at).format('DD/MM/YYYY')}</td>
                              <td>{doc.language.name}</td>
                              <td>{doc.location.address}</td>
                              <td>
                                <span className={getBadgeClass(doc.state)}>
                                  {doc.state}
                                </span>
                              </td>
                              <td>
                                {
                                  inactiveStatuses.includes(doc.state)
                                    ? '-'
                                    : doc.state === 'processed'
                                      ? (<Link to={`document/${doc.url.split('/')[4]}_${doc.title.replace(/ /g,'').replace('#',' ')}_${doc.location.address}`} className="btn btn-primary wawes-effect waves-light">Open</Link>)
                                      : (
                                        <button
                                        onClick={() => openModal('reject', doc.url)}
                                        className="btn btn-danger wawes-effect waves-light"
                                      >
                                        Delete
                                      </button>)
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
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {docsData.map((doc, index) => {
                            return <tr key={`second_${index}`}>
                              <th scope="row">{index + 1}</th>
                              <td>{doc.title}</td>
                              <td>{dayjs(doc.uploaded_at).format('DD/MM/YYYY')}</td>
                              <td>{doc.language.name}</td>
                              <td>{doc.location.address}</td>
                              <td>
                                <span className={getBadgeClass(doc.state)}>
                                  {doc.state}
                                </span>
                              </td>
                              <td>
                                <button
                                  onClick={() => openModal('reject', doc.url)}
                                  className="btn btn-danger wawes-effect waves-light"
                                >
                                  Delete
                                </button>

                                {/*<button onClick={() => openModal('inform', doc.id)} className="btn btn-info wawes-effect waves-light">Info</button>*/}
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