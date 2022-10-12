import React, { useState } from 'react';
import { Modal } from "reactstrap";

const FiltersModal = ({ modalOpen, setModalOpen, docsData, setDocsData }) => {
  const cancel = () => {
    setModalOpen(false)
  }

  const apply = () => {
    console.log("Apply filters ", docsData)
    setModalOpen(false)

    // Set new filtered docs..
    setDocsData([])
  }

  return(
    <Modal
      isOpen={modalOpen}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">Filter results</h5>
      </div>
      <div className="modal-body">
        <p>Here are going some filters...</p>
      </div>
      <div className="modal-footer">
        <button onClick={cancel} className="btn btn-secondary wawes-effect">
          Cancel
        </button>

        <button onClick={apply} className="btn btn-primary wawes-effect ml-3">
          Apply Filters
        </button>
      </div>
    </Modal>
  );
};

export default FiltersModal;