import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Row, Col, Button } from "reactstrap";
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

const Analysis = ({ userToken, match }) => {

  const [cells, setCells] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellSim, setCellSim] = useState(null);
  const [vars, setVars] = useState(null);
  const [selectedVar, setSelectedVar] = useState(null);
  const [varSim, setVarSim] = useState(null);
  const [cellSimLoading, setCellSimLoading] = useState(false);

  useEffect(() => {
    if(match.params.analysisType === 'location') {

      const latlong = match.params.analysisKey.split('_');

      axios
        .get(`https://api.mesoc.dev/aggregates/heatmap/?latitude=${latlong[0]}&longitude=${latlong[1]}&type=${latlong[2]}`)
        .then(async res => {
          console.log(res.data);
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
    // if(match.params.analysisType === 'location') {
    //   return;
    // }

    // Reset graph data and similar by cell data.
    if(match.params.analysisType !== 'location') {
      setVars(null);
    }
    setCellSim(null);

    // If deselecting cell or clicking on "classification: 0" cell, clear cell data and terminate function.
    if(selectedCell === cellIndex || cells[cellIndex].classification === 0) {
      setSelectedCell(null);
      return;
    }

    // Mark selected cell.
    setSelectedCell(cellIndex);
    setCellSimLoading(true);
    if(match.params.analysisType === 'location') {
      const latlong = match.params.analysisKey.split('_');
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
      await graphData.map(barData => {
        barData.strength = barData.strength * 100;
        barData.Strength = 0;
      })
      // Set graph data to state.
      setVars(graphData);
    }
  };

  const graphClick = async data => {
    setVarSim(null);

    // Create a copy of graph data.
    let newGraphData = [...vars];

    if(data.id === 'strength') {
      // Bar is being selected.
      await newGraphData.map(current => {
        if(current.Strength) {
          current.strength = current.Strength;
          current.Strength = 0;
        }
      });
      newGraphData[data.index].Strength = newGraphData[data.index].strength;
      newGraphData[data.index].strength = 0;

      setSelectedVar(data.id);

      // TODO: fetch similar by variable
      setTimeout(() => {
        setVarSim(require('../testData/simm.json').similar);
      }, 1000);
    } else {
      // Bar is being deselected.
      newGraphData[data.index].strength = newGraphData[data.index].Strength;
      newGraphData[data.index].Strength = 0;
      
      setSelectedVar(null);
    }
    // Set modified graph data to state.
    setVars(newGraphData);
  }

  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">
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
                {selectedCell !== null ?
                  match.params.analysisType !== 'location' ?
                    <Graph vars={vars} varClick={graphClick} /> :
                    <div className="analysisEmpty" style={{ height: '550px' }}>{match.params.analysisType === 'location' ? 'Feature coming soon' : 'No cell selected'}</div>:
                    <div className="analysisEmpty" style={{ height: '550px' }}>Feature coming soon</div>
                }
                {/* TODO:
                Fetch data and display variable decomposition screen (as a modal) on click of this button. */}
                <Button onClick={() => console.log(selectedVar)} color="secondary" className="ml-3" disabled={selectedVar === null}>See decomposition</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
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
                {selectedVar !== null ?
                  varSim.length ? 
                    <DocumentList docs={varSim} /> :
                    <div className="analysisEmpty" style={{ height: '200px' }}>No similar documents</div> :
                    <div className="analysisEmpty" style={{ height: '200px' }}>No variable selected</div>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default withRouter(Analysis);