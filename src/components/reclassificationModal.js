import React, { useState } from 'react';
import { Modal } from "reactstrap";
import Heatmap from './heatmap';
import axios from 'axios'

const ReclassificationModal = ({ setModalOpen, modalOpen, userToken, cells, docId }) => {

  const [selectedCell, setSelectedCell] = useState(null);
  const [updatedCells, setUpdatedCells] = useState(null)

  const cellsUpdated = (newCells) => {
    setUpdatedCells(newCells)
  }

  const apply = async() => {
    const headers = {
      Authorization: `Bearer ${userToken}`
    }

    await axios.patch(
      `${process.env.REACT_APP_API_DOMAIN}/documents/${docId}/classification`,
      { cells: updatedCells },  // #TODO - API needs to be updated regarding this method. It should accept array
      { headers }               //         of objects, i.e. [{ cell: 1, classfication: 0.35 }]
    ).then(response => {
      console.log("Success", response)
    }).catch(error => {
      console.log("ERR", error.response)
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
          <p className="d-block mt-1 mb-0">Update cells in a way yout think is correct.</p>
        </div>
      </div>
      <div className="modal-body">
        <Heatmap
          data={cells}
          selectedCell={selectedCell}
          cellsUpdated={cellsUpdated}
          editable
        />
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