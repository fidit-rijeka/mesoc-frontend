import React from 'react';

import Sidenav from '../components/sidenav'

const Analysis = () => {
  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">Analysis page</div>
    </div>
  );
};

export default Analysis;