import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Row, Col, Button, Modal } from "reactstrap";
import axios from 'axios';

import Sidenav from '../components/sidenav';
import Heatmap from '../components/heatmap';
import Graph from '../components/graph';
import AnalysisLoader from '../components/analysisLoader';
import DocumentList from '../components/documentList';

import ReclassificationModal from '../components/reclassificationModal'

const compare = (a, b) => {
  const varA = a.strength;
  const varB= b.strength;

  let comparison = 0;
  if(varA < varB) {
    comparison = 1;
  } else if(varA < varB) {
    comparison = -1;
  }

  return comparison;
};

const KeywordsModal = ({ isOpen, setIsOpen, data }) => {

  /*useEffect(() => {
    console.log(data.keywords);
  }, []);*/

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
              data.keywords.map((each, index) => ( <span key={`kw_${index}`}>{each}, </span> ))
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

  const [geoCellLoading, setGeoCellLoading] = useState(true);
  const [geoCell, setGeoCell] = useState(null)

  const [classModalOpen, setClassModalOpen] = useState(false);
  const [docId, setDocId] = useState(null)

  const fetchLocationDocuments = async () => {
    const address = match.params.analysisType === 'location'
      ? match.params.analysisKey.split('_')[3]
      : match.params.analysisKey.split('_')[2]

    const headers = { Authorization: `Bearer ${userToken}` }
    let location_id = null
    let documents = []

    if (!address) { return }

    // Get location id.
    await axios
      .get(
        `${process.env.REACT_APP_API_DOMAIN}/locations?address=${address}`,
        { headers }
      ).then(response => {
        location_id   = response.data.length > 0
          ? response.data.find(i => i.address === address).location_id
          : null
      })

      if (!location_id) { return }

      //  Get documents related to location.
      await axios
        .get(
          `${process.env.REACT_APP_API_DOMAIN}/aggregates/location/documents?location_id=${location_id}`,
          { headers }
        ).then(response => { documents = response.data })

      setGeoCell(documents)
      setGeoCellLoading(false)
  }

  useEffect(() => {
    setDocId(match.params.analysisKey.split('_')[0])

    if (match.params.analysisKey !== 'all') {
      fetchLocationDocuments()
    }

    if(match.params.analysisType === 'location') {

      const latlong = match.params.analysisKey.split('_');

      const url = latlong[0] === 'all' ?
        `${process.env.REACT_APP_API_DOMAIN}/aggregates/heatmap/` :
        `${process.env.REACT_APP_API_DOMAIN}/aggregates/heatmap/?latitude=${latlong[0]}&longitude=${latlong[1]}&type=${latlong[2]}`;

      axios
        .get(url)
        .then(async res => {
          let heatData = await [...Array(30).keys()].map(x => {return {cell: x, classification: 0.0}});
          await res.data.forEach(resItem => {
            heatData[resItem.cell] = resItem;
          });
          setCells(heatData);
        })
    }
    else {
      axios
        .get(`${process.env.REACT_APP_API_DOMAIN}/documents/${match.params.analysisKey.split('_')[0]}/heatmap/`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        })
        .then(async res => {
          let heatData = await [...Array(30).keys()].map(x => {return {cell: x, classification: 0.0}});
          await res.data.forEach(resItem => {
            heatData[resItem.cell] = resItem;
          });
          setCells(heatData);
        });
    }
  }, []);

  const showClassificationModal = () => {
    setClassModalOpen(true)
  }

  const heatmapClick = async cellIndex => {
    const latlong = match.params.analysisKey.split('_');

    if(match.params.analysisKey === 'all') {
      setVars(null);
      setSelectedVar(null);
      if(selectedCell === cellIndex || cells[cellIndex].classification === 0) {
        setSelectedCell(null);
        return;
      }
      let cellNum;
      if(cellIndex.toString().length === 1)
        cellNum = 0;
      else if(Number(cellIndex.toString().charAt(0)) === 1)
        cellNum = 1;
      else
        cellNum = 2;
      setSelectedCell(cellIndex);
      const graphData = (await axios.get(`${process.env.REACT_APP_API_DOMAIN}/aggregates/impact/?column=${cellNum}`)).data;
      // Sort graph data by strength.
      await graphData.sort(compare);
      // Modify graph data for displaying.
      await graphData.forEach(barData => { barData.strength = Math.round(barData.strength * 100) });
      // Set graph data to state.
      // setVars(graphData);
      setVars(graphData.sort((a,b) => b.strength - a.strength))
      return;
    }

    // Reset graph data and similar by cell data.
    setVars(null);
    setCellSim(null);
    setSelectedVar(null);

    // If deselecting cell or clicking on "classification: 0" cell, clear cell data and terminate function.
    if(selectedCell === cellIndex || cells[cellIndex].classification === 0) {
      setSelectedCell(null);
      return;
    }

    // Mark selected cell.
    setSelectedCell(cellIndex);
    setCellSimLoading(true);
    if(match.params.analysisType === 'location') {
      if (cells[cellIndex] && cells[cellIndex].similar_documents) {
        axios
          .get(cells[cellIndex].similar_documents)
          .then(res => {
            setCellSim(res.data);
            setCellSimLoading(false);
          })
      } else {
        setCellSim([]);
        setCellSimLoading(false);
      }
    } else {
      if (cells[cellIndex] && cells[cellIndex].similar_documents) {
        axios
          .get(cells[cellIndex].similar_documents, {
            headers: {
              Authorization: `Bearer ${userToken}`
            }
          })
          .then(res => {
            setCellSim([]);
            setCellSimLoading(false);
          });
      }
    }

    if (match.params.analysisType !== 'location') {
      // Fetch graph data.
      //let graphData = await (await axios.get(cells[cellIndex].variables, { headers: { Authorization: `Bearer ${userToken}` } })).data;
      let cellNum;
      if(cellIndex.toString().length === 1)
        cellNum = 0;
      else if(Number(cellIndex.toString().charAt(0)) === 1)
        cellNum = 1;
      else
        cellNum = 2;
      let graphData = await (await axios.get(`${process.env.REACT_APP_API_DOMAIN}/documents/${match.params.analysisKey.split('_')[0]}/impacts/?column=${cellNum}`, { headers: { Authorization: `Bearer ${userToken}` } })).data;
      // Sort graph data by strength.
      await graphData.sort(compare);
      // Modify graph data for displaying.
      await graphData.forEach(barData => { barData.strength = Math.round(barData.strength * 100) });
      // Set graph data to state.
      const sorted = graphData.sort((a,b) => b.strength - a.strength)
      setVars(sorted);
    } else {
      let cellNum;
      if(cellIndex.toString().length === 1)
        cellNum = 0;
      else if(Number(cellIndex.toString().charAt(0)) === 1)
        cellNum = 1;
      else
        cellNum = 2;

      const result = await (await axios.get(`${process.env.REACT_APP_API_DOMAIN}/aggregates/impact/?type=${latlong[2]}&latitude=${latlong[0]}&longitude=${latlong[1]}&column=${cellNum}`)).data;
      await result.sort(compare);
      await result.forEach(barData => { barData.strength = Math.round(barData.strength * 100) });
      setVars(result.sort((a,b) => b.strength - a.strength));
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

    if(latlong[0] === 'all' || vars[varIndex].similar_documents === undefined) {
      setVarSim([])
      setVarSimLoading(false)
      return;
    }

    if(match.params.analysisType === 'document') {
      const result = await axios.get(vars[varIndex].similar_documents, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setVarSim(result.data);
      setVarSimLoading(false);
      return;
    }

    const result = await axios.get(vars[varIndex].similar_documents);
    setVarSim(result.data);
    setVarSimLoading(false);
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

        <ReclassificationModal
          setModalOpen={setClassModalOpen}
          modalOpen={classModalOpen}
          userToken={userToken}
          cells={cells}
          docId={docId}
        />

        <Row>
          <Col lg="6">
            <Card>
              <CardBody>
                <CardTitle>MESOC matrix</CardTitle>
                <CardSubtitle className="mb-3">
                  {
                  match.params.analysisType === 'location' ?
                    `Location: ${match.params.analysisKey.split('_')[3] || 'All cities'}` :
                    `${match.params.analysisKey.split('_')[1]}, ${match.params.analysisKey.split('_')[2]}`
                }</CardSubtitle>
                {cells
                  ? <div>
                    <Heatmap
                      data={cells}
                      selectedCell={selectedCell}
                      heatmapClick={heatmapClick}
                    />

                    { match.params.analysisType === 'document' && <div className='mt-4 text-right'>
                      <button type="button" className="btn btn-secondary" onClick={showClassificationModal}>
                        Reclassify
                      </button>
                    </div> }
                  </div>
                  : <AnalysisLoader height='590px' />
                }
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card>
              <CardBody>
                <CardTitle>MESOC Impacts</CardTitle>
                <CardSubtitle className="mb-3">Impacts detected in selected cell's column</CardSubtitle>
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
              <Col lg="12">
                <Card>
                  <CardBody>
                    <CardTitle>Geo-referenced documents</CardTitle>
                    <CardSubtitle className="mb-3">Document list by geographic reference.</CardSubtitle>
                    {
                      geoCellLoading ?
                        <AnalysisLoader height="200px" /> :
                        (geoCell && geoCell.length > 0 ?
                          <DocumentList docs={geoCell} /> :
                          <div className="analysisEmpty" style={{ height: '200px' }}>
                              No similar documents
                          </div>)
                    }
                  </CardBody>
                </Card>
              </Col>
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
                    <CardSubtitle className="mb-3">Document similarity by selected impact</CardSubtitle>
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