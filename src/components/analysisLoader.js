import React from 'react'

const AnalysisLoader = ({ height }) => {
  return(
    <div className="analysisLoader" style={{ height: height }}>
      <i className="bx bx-loader-circle dataLoaderIcon"></i>
      <span className="dataLoaderText">Loading</span>
    </div>
  );
};

export default AnalysisLoader;