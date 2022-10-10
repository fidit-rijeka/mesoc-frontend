import React from 'react';

const Heatmap = ({ data, selectedCell, heatmapClick }) => {

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
    } else if(classification !== 0) {
      return '.19';
    } else {
      return '.09';
    }
  };

  return(
    <div className="heatmapWrapper">
      <span style={{ color: 'transparent' }}>.</span>
      <span id="numSpan1" className="numberSpan">Heritage</span>
      <span id="numSpan2" className="numberSpan">Archives</span>
      <span id="numSpan3" className="numberSpan">Libraries</span>
      <span id="numSpan4" className="numberSpan">Book and Press</span>
      <span id="numSpan5" className="numberSpan">Visual Arts</span>
      <span id="numSpan6" className="numberSpan">Performing Arts</span>
      <span id="numSpan7" className="numberSpan">Audiovisual and Multimedia</span>
      <span id="numSpan8" className="numberSpan">Architecture</span>
      <span id="numSpan9" className="numberSpan">Advertising</span>
      <span id="numSpan10" className="numberSpan">Art crafts</span>

      <span id="numSpanB1" className="numberSpan">Health and Wellbeing</span>
      <span id="numSpanB2" className="numberSpan">Urban and Terrotorial Renovation</span>
      <span id="numSpanB3" className="numberSpan">Social Cohesion</span>

      {data.map((cellLabel, index) => {
        return <span onClick={() => heatmapClick(index)} key={index} className="heatmapCell" style={{ background: `rgba(74, 101, 255, ${calculateOpacity(cellLabel.classification)})`, boxShadow: selectedCell === index && 'inset 0px 0px 0px 4px #ff7300' }}>
          <span>{`${parseInt(cellLabel.classification * 100)}%`}</span>
        </span>
      })}
    </div>
  );
};

export default Heatmap;