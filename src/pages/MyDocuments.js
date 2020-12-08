import React, { useState, useEffect } from 'react';
import { Table, Card, CardBody, CardTitle, CardSubtitle, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from 'classnames';

import Sidenav from '../components/sidenav';
import InfoModal from '../components/infoModal';

// TODO
// Display "you have to sign in to use this part of application" message when not signed in

const MyDocuments = () => {

  const [activeTab, setActiveTab] = useState('1');
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalText, setModalText] = useState(null);
  const [docsData, setDocsData] = useState(['For your data we produced no results.', 'Your document was rejected and will now be moved to "failed documents" tab']);

  useEffect(() => {
    // TODO
    // Fetch documents data here and put that data into state (if signed in)
    // Use setDocsDatafunction
  }, []);

  // First argument: if in "Active documents" -> 'reject'
  //                 if in "Deleted documents" -> 'inform'
  // Second argument: index of rendered document
  const openModal = (type, selected) => {
    setModalType(type);
    setModalText(docsData[selected]);
    setInfoModalOpen(true);
  };

  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">

        <InfoModal type={modalType} text={modalText} modalOpen={infoModalOpen} setModalOpen={setInfoModalOpen} />

        <InfoModal type={modalType} text={modalText} modalOpen={infoModalOpen} setModalOpen={setInfoModalOpen} />

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
                  onClick={() => setActiveTab('1')}
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
                  onClick={() => setActiveTab('2')}
                >
                  <span className="d-none d-sm-block">Failed documents</span>
                </NavLink>
              </NavItem>
            </Nav>

            {/* TODO
            Fetch and display tables from backend server.
            Create view for "you haven't uploaded any documents" and "you haven't deleted any documents" */}

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
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
                      <tr>
                        <th scope="row">1</th>
                        <td>Text about wine</td>
                        <td>21/12/2021</td>
                        <td>English</td>
                        <td>Malta</td>
                        <td>
                          <button className="btn btn-primary wawes-effect waves-light">Open</button>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Text about something...</td>
                        <td>21/12/2021</td>
                        <td>English</td>
                        <td>Rijeka, Croatia</td>
                        <td>
                          <button className="btn btn-primary wawes-effect waves-light" disabled>Procesing</button>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>Text about wine</td>
                        <td>21/12/2021</td>
                        <td>English</td>
                        <td>Malta</td>
                        <td>
                          <button onClick={() => openModal('reject', 1)} className="btn btn-danger wawes-effect waves-light">Failed</button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </TabPane>
              <TabPane tabId="2">
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
                      <tr>
                        <th scope="row">1</th>
                        <td>Test file</td>
                        <td>21/12/2021</td>
                        <td>English</td>
                        <td>Malta</td>
                        <td>
                          <button onClick={() => openModal('inform', 0)} className="btn btn-info wawes-effect waves-light">Info</button>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MyDocuments;