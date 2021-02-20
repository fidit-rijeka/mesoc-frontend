import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Row, Col, Button } from "reactstrap";
import axios from 'axios';

import Sidenav from '../components/sidenav';
import Heatmap from '../components/heatmap';
import Graph from '../components/graph';
import AnalysisLoader from '../components/analysisLoader';
import DocumentList from '../components/documentList';

let options = null;
let series = null;

const Analysis = ({ userToken, match }) => {

  const [cells, setCells] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellSim, setCellSim] = useState(null);
  const [vars, setVars] = useState(null);
  const [selectedVar, setSelectedVar] = useState(null);
  const [varSim, setVarSim] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.mesoc.dev/documents/${match.params.analysisKey}/heatmap/`, {
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
      })
      .catch(err => {
        console.log(err);
      });

    // setTimeout(() => {
    //   setCells(require('../testData/celije.json').cells);
    // }, 1000)
  }, []);

  const fetchGraph = async (cell) => {
    setVars(null);
    setCellSim(null);
    // If deselecting cell or clicking on "classification: 0" cell, clear cell data.
    if(selectedCell === cell || cells[cell].classification === 0) {
      setSelectedCell(null);
      return;
    }

    setSelectedCell(cell);
    console.log(cells[cell]);
    // TODO:
    // Fetch variable data based on input (selected cell).
    // Fetch similar by cell.
    let varsTemp = [];
    let labels = [];
    let percentages = [];
    await axios
      .get(`${cells[cell].variables}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
      .then(res => {
        console.log(res.data);
        //setVars(res.data);
        varsTemp = res.data;
        return res.data;
      })
      .then(res => {
        setData();
        console.log(res);
        //setVars(res);
      })

    // await axios
    //   .get(`${cells[cell].document}`, {
    //     headers: {
    //       Authorization: `Bearer ${userToken}`
    //     }
    //   })
    //   .then(res => {
    //     console.log(res.data);
    //     setCellSim(res.data);
    //   });

    // const varsTemp = require('../testData/varijable.json').vars;

    // setTimeout(() => {
    //   setData();
    //   //setVars(varsTemp);
    //   //setCellSim(require('../testData/simm.json').similar);
    // }, 1000)

    async function setData() {
      console.log(varsTemp);
      await varsTemp.forEach(element => {
        labels.push(element.name);
        percentages.push(parseInt(element.strength * 100));
      });

      // Settings for graph rendering.
      options = {
        chart: {
          id: 'mesoc-graph',
          events: {
            dataPointSelection: function(event, chartContext, config) {
              setVarSim(null);
              if(config.selectedDataPoints[0][0] !== config.dataPointIndex) {
                setSelectedVar(null);
                return;
              }
              setSelectedVar(config.dataPointIndex);
              console.log(vars[config.dataPointIndex]);
              // TODO:
              // Fetch similar by variable.
              setTimeout(() => setVarSim(require('../testData/simm.json').similar), 1000);
            }
          }
        },
        xaxis: {
          categories: labels,
          labels: {
            show: true,
            formatter: val => {
              if(val.length > 22) {
                //return `${val.slice(0, 20)}...`
                return val
              }
              return val;
            }
          }
        },
        yaxis: {
          labels: {
            formatter: val => `${val} %`
          }
        },
        dataLabels: {
          enabled: true,
          formatter: val => `${val} %`,
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#303030"]
          }
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'top'
            }
          }
        },
        colors: ['#5A74AC']
      };
      series = [{
        name: 'effect',
        data: percentages
      }];
      setVars(varsTemp);
    };

    //setData();
  };

  return(
    <div className="pageWrapper">
      <div className="sidenavArea">
        <Sidenav />
      </div>
      <div className="pageArea">
        {/* TODO:
        Create dynamic page header here to display document title or city. */}
        <Row>
          <Col xl="5" lg="12">
            <Card>
              <CardBody>
                <CardTitle>MESOC matrix</CardTitle>
                <CardSubtitle className="mb-3">Impact of variables per cell in a given document</CardSubtitle>
                {cells ?
                  <Heatmap
                    data={cells}
                    selectedCell={selectedCell}
                    fetchGraph={fetchGraph}
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
                  <Graph vars={vars} options={options} series={series} /> :
                  <div className="analysisEmpty" style={{ height: '550px' }}>No cell selected</div>
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
                {selectedCell !== null ?
                  <DocumentList docs={cellSim} /> :
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
                  <DocumentList docs={varSim} /> :
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