import React from 'react';
import { Modal } from "reactstrap";

const InfoModal = ({text, modalOpen, setModalOpen, type, docIndex}) => {

  const moveToFailed = () => {
    setModalOpen(false);
    // TODO:
    // Add axios request to move document to failed group (use docIndex).
  };

  return(
    <Modal
      isOpen={modalOpen}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">Document info</h5>
      </div>
      <div className="modal-body">
        <p>{text}</p>
      </div>
      <div className="modal-footer">
        {type === 'reject' ?
          <button onClick={moveToFailed} className="btn btn-secondary wawes-effect">Close</button> :
          <button onClick={() => setModalOpen(false)} className="btn btn-secondary wawes-effect">Close</button>
        }
      </div>
    </Modal>
  );
};

export default InfoModal;