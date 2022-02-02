import React from 'react';

import AnalysisLoader from './analysisLoader';

const Bar = ({ data, selectedVar, varClick, index }) => {
  return (
    <div
      className="graphBar"
      style={{
        background: `linear-gradient(90deg, #9CAAFF ${data.strength}%, #EFF1FF ${data.strength}%)`,
        boxShadow: selectedVar === index && 'inset 0px 0px 0px 4px #ff7300'
      }}
      onClick={() => varClick(index)}
    >
      {data.strength}% - {data.impact}
    </div>
  )
};

const Graph = ({ vars, varClick, selectedVar }) => {
  return(
    <>
      {vars ?
        <div className="graphWrapper">
          {
            vars.map((each, index) => (
              <Bar key={index} data={each} index={index} varClick={varClick} selectedVar={selectedVar} />
            ))
          }
        </div> :
        <AnalysisLoader height='550px' />
      }
    </>
  );
};

export default Graph;
