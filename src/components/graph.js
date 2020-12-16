import React from 'react';
import ReactApexChart from 'react-apexcharts';

import AnalysisLoader from './analysisLoader';

const Graph = ({ vars, options, series }) => {
  return(
    <React.Fragment>
      {vars ?
        <ReactApexChart options={options} series={series} type="bar" height="535" /> :
        <AnalysisLoader height='550px' />
      }
    </React.Fragment>
  );
};

export default Graph;