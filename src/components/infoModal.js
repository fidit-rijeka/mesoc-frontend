import React from 'react';
import { Modal } from "reactstrap";

const InfoModal = ({text, modalOpen, setModalOpen, type}) => {
  return(
    <Modal
      isOpen={modalOpen}
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">Document info</h5>
      </div>
      <div className="modal-body">
        <p>{text}</p>
      </div>
      <div className="modal-footer">
        {/* TODO
        Create functionality to move doc to "failed" when necessary. */}
        <button onClick={() => setModalOpen(false)} className="btn btn-secondary wawes-effect">Close</button>
      </div>
    </Modal>
  );
};

export default InfoModal;