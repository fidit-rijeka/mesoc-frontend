import React, { useState } from 'react';

const Heatmap = ({ data, selectedCell, heatmapClick, editable = false, cellsUpdated = null, reclassifiable = false }) => {

  const [marked, setMarked] = useState([])

  const [tempData, setTempData] = useState([
    ...(data.map(item => ({
      ...item,
      classification_perc: parseInt(item.classification * 100),
      editor_active: false
    })))
  ])

  const setEditorActiveState = (value, index) => {
    // On blur out.
    if (!value) {

    }

    const val = tempData.map((td, i) => ({
      ...td,
      editor_active: index === i && value,
      classification: (!value && index === i) ? parseFloat(td.classification_perc / 100) : td.classification
    }))

    setTempData(val)
    cellsUpdated(val);
  }

  const handleChange = (event, index) => {
    const val = tempData.map((td, i) => ({
      ...td,
      classification_perc: index === i ? event.target.value : td.classification_perc
    }))

    setTempData(val)
  }

  const markCell = (index) => {
    const markedCopy = [...marked]
    const isMarked = markedCopy.includes(index)

    // Remove from array if exists.
    if (isMarked) {
      const i = markedCopy.indexOf(index);

      if (i > -1) {
        markedCopy.splice(i, 1);
      }
    } else {
      // Add to array.
      markedCopy.push(index)
    }

    setMarked(markedCopy)
    cellsUpdated(markedCopy)
  }

  const getTableTemplate = (cellLabel, index) => {
    if (editable) {
      return (
        <span
          key={`input_${index}`}
          className="heatmapCell inputElement"
          style={{ background: `rgba(74, 101, 255, ${calculateOpacity(cellLabel.classification)})`, boxShadow: selectedCell === index && 'inset 0px 0px 0px 4px #ff7300' }}
        >
          <input
            value={
              tempData[index].editor_active
              ? tempData[index].classification_perc
              : `${tempData[index].classification_perc}%`
            }
            onChange={(e) => handleChange(e, index)}
            onFocus={() => setEditorActiveState(true, index)}
            onBlur={() => setEditorActiveState(false, index)}
            type={tempData[index].editor_active ? 'number' : 'text'}
          />
        </span>
      )
    }

    if (reclassifiable) {
      return (
        <span
          onClick={() => markCell(index)}
          key={index}
          className={`heatmapCell ${marked.includes(index) ? 'marked' : ''}`}
          style={{ background: `rgba(74, 101, 255, ${calculateOpacity(cellLabel.classification)})`, boxShadow: selectedCell === index && 'inset 0px 0px 0px 4px #ff7300' }}
        >
          <span>{`${parseInt(cellLabel.classification * 100)}%`}</span>
        </span>
      )
    }

    else {
      return (
        <span onClick={() => heatmapClick(index)} key={index} className="heatmapCell" style={{ background: `rgba(74, 101, 255, ${calculateOpacity(cellLabel.classification)})`, boxShadow: selectedCell === index && 'inset 0px 0px 0px 4px #ff7300' }}>
          <span>{`${parseInt(cellLabel.classification * 100)}%`}</span>
        </span>
      )
    }
  }

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
        return getTableTemplate(cellLabel, index)
      })}
    </div>
  );
};

export default Heatmap;