import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

import AnalysisLoader from './analysisLoader';

const Graph = ({ vars, varClick }) => {
  return(
    <React.Fragment>
      {vars ?
        <div style={{ width: '100%', height: '535px' }}>
          <ResponsiveBar
            data={vars}
            keys={[ 'strength', 'Strength' ]}
            indexBy="name"
            layout="vertical"
            minValue={0}
            maxValue={100}
            margin={{ top: 30, right: 30, bottom: 40, left: 30 }}
            padding={0.5}
            colors={['#4e84ad', '#2f546d']}
            borderWidth={1}
            borderColor="#000000"
            labelTextColor={'#ffffff'}
            onClick={varClick}
            animate={false}
          />
        </div> :
        <AnalysisLoader height='550px' />
      }
    </React.Fragment>
  );
};

export default Graph;