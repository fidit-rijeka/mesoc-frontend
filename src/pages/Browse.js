import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import { Card, CardBody, CardTitle, CardSubtitle, Row, Col, Button } from "reactstrap";

import Sidenav from '../components/sidenav';
import Map from '../components/map';

const Browse = () => {
  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">
        <Card>
          <CardBody>
            <CardTitle>MESOC world map</CardTitle>
            <CardSubtitle className="mb-3">Explore our MESOC data visualized on a world map.</CardSubtitle>
            <Map />
            { /* TODO: Add a small margin here (about 10px) */ }
            <p>To see our complete analytics, click the button below.</p>
            <Link to={`placeholder`} className="btn btn-primary wawes-effect waves-light">
              All cities
            </Link>            
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Browse;