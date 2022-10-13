import React from 'react';
import { Modal } from "reactstrap";

const ReclassificationModal = ({ setModalOpen, modalOpen, userToken, cells }) => {

  const apply = () => {
    console.log("Apply changes", userToken, cells)
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
        <p>Display cells here....</p>
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