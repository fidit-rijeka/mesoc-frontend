import React from 'react';
import { Modal } from "reactstrap";
import axios from 'axios';

const InfoModal = ({text, modalOpen, setModalOpen, type, docId, userToken}) => {

  const moveToFailed = () => {
    setModalOpen(false);
    // TODO:
    // Finish and test this request with test data.
    axios
      .patch(`https://api.mesoc.dev/documents/${docId}`, {
        state: 'dismissed'
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
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