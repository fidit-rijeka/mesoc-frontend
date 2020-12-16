import React from 'react';

const Heatmap = ({ data, selectedCell, fetchGraph }) => {

  const calculateOpacity = classification => {
    if(classification > 0.9) {
      return '1';
    } else if(classification > 0.8) {
      return '.91';
    } else if(classification > 0.7) {
      return '.82';
    } else if(classification > 0.6) {
      return '.73';
    } else if(classification > 0.5) {
      return '.64';
    } else if(classification > 0.4) {
      return '.55';
    } else if(classification > 0.3) {
      return '.46';
    } else if(classification > 0.2) {
      return '.37';
    } else if(classification > 0.1) {
      return '.28';
    } else {
      return '.19';
    }
  };

  return(
    <div className="heatmapWrapper">
      <span style={{ color: 'transparent' }}>.</span>
      {new Array(10).fill(0).map((_, i) => {
        return <span key={i} id={`numSpan${i + 1}`} className="numberSpan">{i + 1}</span>
      })}
      {new Array(3).fill(0).map((_, i) => {
        return <span key={i} id={`numSpanB${i + 1}`} className="numberSpan">{i + 1}</span>
      })}

      {data.map((cellLabel, index) => {
        return <span onClick={() => fetchGraph(index)} key={index} className="heatmapCell" style={{ background: `rgba(74, 101, 255, ${calculateOpacity(cellLabel.classification)})`, boxShadow: selectedCell === index && 'inset 0px 0px 0px 4px #ff7300' }}>
          <span>{`${parseInt(cellLabel.classification * 100)}%`}</span>
        </span>
      })}
    </div>
  );
};

export default Heatmap;