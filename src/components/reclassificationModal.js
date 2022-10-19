import React, { useState } from 'react';
import { Modal } from "reactstrap";
import Heatmap from './heatmap';
import axios from 'axios'

const ReclassificationModal = ({ setModalOpen, modalOpen, userToken, cells, docId }) => {
  const [serverError, setServerError] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [updatedCells, setUpdatedCells] = useState(null)
  const [markedCells, setMarkedCells] = useState([]);

  const cellsUpdated = (markedCopies) => {
    setMarkedCells(markedCopies)
  }

  const apply = async() => {
    setServerError(null)

    const headers = {
      Authorization: `Bearer ${userToken}`
    }

    await axios.patch(
      `${process.env.REACT_APP_API_DOMAIN}/documents/${docId}/classification/`,
      { cells: markedCells },  // #TODO - API needs to be updated regarding this method. It should accept array
      { headers }               //         of objects, i.e. [{ cell: 1, classfication: 0.35 }]
    ).then(() => {
      window.location.reload();
    }).catch(error => {
      const errors = error.response.data

      for (const property in errors) {
        setServerError(errors[property][0])
      }
    })
  }

  const cancel = () => {
    setModalOpen(false)
  }

  return(
    <Modal
      isOpen={modalOpen}
      centered
    >
      <div className="modal-header">
        <div>
          <h5 className="modal-title mt-0">Classification</h5>
          <p className="d-block mt-1 mb-0">Select cells you consider to be correct.</p>
        </div>
      </div>
      <div className="modal-body">
        <Heatmap
          data={cells}
          selectedCell={selectedCell}
          cellsUpdated={cellsUpdated}
          reclassifiable
        />

        { serverError && (
          <div className='alert alert-danger mt-3'>{serverError}</div>
        ) }
      </div>
      <div className="modal-footer">
        <button onClick={cancel} className="btn btn-secondary wawes-effect">
          Cancel
        </button>

        <button onClick={apply} className="btn btn-primary wawes-effect ml-3">
          Apply Changes
        </button>
      </div>
    </Modal>
  );
};

export default ReclassificationModal;