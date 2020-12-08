import React from 'react';

import Sidenav from '../components/sidenav';

const Browse = () => {
  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">Browse page</div>
    </div>
  );
};

export default Browse;