import React from 'react';
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Browse;