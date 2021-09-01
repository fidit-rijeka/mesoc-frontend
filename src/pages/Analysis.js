import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Row, Col, Button, Modal } from "reactstrap";
import axios from 'axios';

import Sidenav from '../components/sidenav';
import Heatmap from '../components/heatmap';
import Graph from '../components/graph';
import AnalysisLoader from '../components/analysisLoader';
import DocumentList from '../components/documentList';

const compare = (a, b) => {
  const varA = a.strength;
  const varB= b.strength;

  let comparison = 0;
  if(varA > varB) {
    comparison = 1;
  } else if(varA < varB) {
    comparison = -1;
  }

  return comparison;
};

const KeywordsModal = ({ isOpen, setIsOpen, data }) => {

  useEffect(() => {
    console.log(data.keywords);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">Impact keywords</h5>
      </div>
      <div className="modal-body">
        <p>
          {
            data.keywords &&
              data.keywords.map((each, index) => ( <span>{each}, </span> ))
          }
        </p>
      </div>
      <div className="modal-footer">
        <button onClick={() => setIsOpen(false)} className="btn btn-secondary wawes-effect">Close</button>
      </div>
    </Modal>
  )
};

const Analysis = ({ userToken, match }) => {

  const [cells, setCells] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellSim, setCellSim] = useState(null);
  const [vars, setVars] = useState(null);
  const [selectedVar, setSelectedVar] = useState(null);
  const [varSim, setVarSim] = useState(null);
  const [cellSimLoading, setCellSimLoading] = useState(false);
  const [varSimLoading, setVarSimLoading] = useState(false);
  const [isKeywordsModal, setIsKeywordsModal] = useState(false);

  useEffect(() => {
    if(match.params.analysisType === 'location') {

      const latlong = match.params.analysisKey.split('_');

      axios
        .get(`https://api.mesoc.dev/aggregates/heatmap/?latitude=${latlong[0]}&longitude=${latlong[1]}&type=${latlong[2]}`)
        .then(async res => {
          console.log(res);
          let heatData = await [...Array(30).keys()].map(x => {return {order: x, classification: 0.0}});
          await res.data.map(resItem => {
            heatData[resItem.order] = resItem;
          });
          setCells(heatData);
        })
    }
    else {
      axios
        .get(`https://api.mesoc.dev/documents/${match.params.analysisKey.split('_')[0]}/heatmap/`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then(async res => {
          let heatData = await [...Array(30).keys()].map(x => {return {order: x, classification: 0.0}});
          await res.data.map(resItem => {
            heatData[resItem.order] = resItem;
          });
          setCells(heatData);
        });
    }
  }, []);

  const heatmapClick = async cellIndex => {
    // If analyzing location, do nothing
    if(match.params.analysisKey === 'all') {
      return;
    }

    // Reset graph data and similar by cell data.
    setVars(null);
    setCellSim(null);

    // If deselecting cell or clicking on "classification: 0" cell, clear cell data and terminate function.
    if(selectedCell === cellIndex || cells[cellIndex].classification === 0) {
      setSelectedCell(null);
      return;
    }

    const latlong = match.params.analysisKey.split('_');

    // Mark selected cell.
    setSelectedCell(cellIndex);
    setCellSimLoading(true);
    if(match.params.analysisType === 'location') {
      axios
        .get(`https://api.mesoc.dev/aggregates/similar/cell/?latitude=${latlong[0]}&longitude=${latlong[1]}&cell=${cellIndex}`)
        .then(res => {
          setCellSim(res.data);
          setCellSimLoading(false);
        })
    } else {
      axios
        .get(cells[cellIndex].similar_documents, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then(res => {
          setCellSim(res.data);
          setCellSimLoading(false);
        });
    }

    if (match.params.analysisType !== 'location') {
      // Fetch graph data.
      let graphData = await (await axios.get(cells[cellIndex].variables, { headers: { Authorization: `Bearer ${userToken}` } })).data;
      // Sort graph data by strength.
      await graphData.sort(compare);
      // Modify graph data for displaying.
      await graphData.map(barData => { barData.strength = Math.round(barData.strength * 100) });
      // Set graph data to state.
      setVars(graphData);
    } else {
      let cellNum;
      if(cellIndex.toString().length === 1)
        cellNum = 0;
      else if(Number(cellIndex.toString().charAt(0)) === 1)
        cellNum = 1;
      else
        cellNum = 2;

      const result = await (await axios.get(`https://api.mesoc.dev/aggregates/impact/?type=${latlong[2]}&latitude=${latlong[0]}&longitude=${latlong[1]}&column=${cellNum}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })).data;
      await result.sort(compare);
      await result.map(barData => { barData.strength = Math.round(barData.strength * 100) });
      console.log(result);
      setVars(result);
    }
  };

  const graphClick = async varIndex => {
    setVarSim(null);

    if(selectedVar === varIndex || vars[varIndex].strength === 0) {
      setSelectedVar(null);
      return;
    }

    const latlong = match.params.analysisKey.split('_');

    setVarSimLoading(true);
    setSelectedVar(varIndex);

    let cellNum;
      if(selectedCell.toString().length === 1)
        cellNum = 0;
      else if(Number(selectedCell.toString().charAt(0)) === 1)
        cellNum = 1;
      else
        cellNum = 2;

    const result = await axios.get(`https://api.mesoc.dev/aggregates/similar/cell/?latitude=${latlong[0]}&longitude=${latlong[1]}&cell=${cellNum}`)
    setVarSim(result.data);
    console.log(result.data);
    setVarSimLoading(false)

    // // Create a copy of graph data.
    // let newGraphData = [...vars];

    // if(data.id === 'strength') {
    //   // Bar is being selected.
    //   await newGraphData.map(current => {
    //     if(current.Strength) {
    //       current.strength = current.Strength;
    //       current.Strength = 0;
    //     }
    //   });
    //   newGraphData[data.index].Strength = newGraphData[data.index].strength;
    //   newGraphData[data.index].strength = 0;

    //   setSelectedVar(data.id);

    //   // TODO: fetch similar by variable
    //   setTimeout(() => {
    //     setVarSim(require('../testData/simm.json').similar);
    //   }, 1000);
    // } else {
    //   // Bar is being deselected.
    //   newGraphData[data.index].strength = newGraphData[data.index].Strength;
    //   newGraphData[data.index].Strength = 0;
      
    //   setSelectedVar(null);
    // }
    // // Set modified graph data to state.
    // setVars(newGraphData);
  };

  const displayImpactKeywords = () => {};

  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">

        <KeywordsModal
          isOpen={isKeywordsModal}
          setIsOpen={setIsKeywordsModal}
          data={(selectedVar !== null && vars !== null) ? vars[selectedVar] : {}}
        />

        <Row>
          <Col xl="5" lg="12">
            <Card>
              <CardBody>
                <CardTitle>MESOC matrix</CardTitle>
                <CardSubtitle className="mb-3">{
                  match.params.analysisType === 'location' ?
                    `Location: ${match.params.analysisKey.split('_')[3]}, ${match.params.analysisKey.split('_')[4]}` :
                    `${match.params.analysisKey.split('_')[1]}, ${match.params.analysisKey.split('_')[2]}, ${match.params.analysisKey.split('_')[3]}`
                }</CardSubtitle>
                {cells ?
                  <Heatmap
                    data={cells}
                    selectedCell={selectedCell}
                    heatmapClick={heatmapClick}
                  /> :
                  <AnalysisLoader height='590px' />
                }
              </CardBody>
            </Card>
          </Col>
          <Col xl="7" lg="12">
            <Card>
              <CardBody>
                <CardTitle>MESOC Graph</CardTitle>
                <CardSubtitle className="mb-3">Distribution of variables impacting selected cell</CardSubtitle>
                {/* {selectedCell !== null ?
                  match.params.analysisType !== 'location' ?
                    <Graph vars={vars} varClick={graphClick} /> :
                    <div className="analysisEmpty" style={{ height: '550px' }}>{match.params.analysisType === 'location' ? 'Feature coming soon' : 'No cell selected'}</div>:
                  <div className="analysisEmpty" style={{ height: '550px' }}>Feature coming soon</div>
                } */}
                {selectedCell !== null ?
                  <Graph vars={vars} varClick={graphClick} selectedVar={selectedVar} /> :
                  <div className="analysisEmpty" style={{ height: '550px' }}>No cell selected</div>
                }
                {/* TODO:
                Fetch data and display variable decomposition screen (as a modal) on click of this button. */}
                {/* <Button onClick={() => console.log(selectedVar)} color="secondary" className="ml-3" disabled={selectedVar === null}>See decomposition</Button> */}
                <Button onClick={() => setIsKeywordsModal(true)} color="secondary" disabled={selectedVar === null}>See keywords</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {
          match.params.analysisKey !== 'all' &&
            <Row>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Similar documents</CardTitle>
                    <CardSubtitle className="mb-3">Document similarity by selected cell</CardSubtitle>
                    {
                      selectedCell !== null ?
                      (cellSimLoading ?
                        <AnalysisLoader height="200px" /> :
                        (cellSim.length ?
                          <DocumentList docs={cellSim} /> :
                          <div className="analysisEmpty" style={{ height: '200px' }}>No similar documents</div>)) :
                      <div className="analysisEmpty" style={{ height: '200px' }}>No cell selected</div>
                    }
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6">
                <Card>
                  <CardBody>
                    <CardTitle>Similar documents</CardTitle>
                    <CardSubtitle className="mb-3">Document similarity by selected variable</CardSubtitle>
                    {
                      selectedVar !== null ?
                      (varSimLoading ?
                        <AnalysisLoader height="200px" /> :
                        (varSim.length ?
                          <DocumentList docs={varSim} /> :
                          <div className="analysisEmpty" style={{ height: '200px' }}>No similar documents</div>)) :
                      <div className="analysisEmpty" style={{ height: '200px' }}>No cell selected</div>
                    }
                    {/* {
                      selectedVar !== null ?
                    }
                    {
                      selectedVar !== null ?
                        varSim.length ? 
                          <DocumentList docs={varSim} /> :
                          <div className="analysisEmpty" style={{ height: '200px' }}>No similar documents</div> :
                        <div className="analysisEmpty" style={{ height: '200px' }}>No variable selected</div>
                    } */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
        }
      </div>
    </div>
  );
};

export default withRouter(Analysis);