import React, { useState } from 'react';
import { Modal } from "reactstrap";
import axios from 'axios';

const InfoModal = ({text, modalOpen, setModalOpen, type, docId, userToken, action = null, actionCompleted = null}) => {
  const [processing, setProcessing] = useState(false);

  const moveToFailed = () => {
    setModalOpen(false);
    // TODO:
    // Finish and test this request with test data.
    axios
      .patch(`${docId}`, {
        state: 'dismissed'
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })
  };

  const submitAction = () => {
    setProcessing(true)

    // Delete document action.
    if (action === 'deleteDocument') {
      axios.delete(docId, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }).then(() => {
        setProcessing(false)
        actionCompleted(true)
      }).catch(() => {
        setProcessing(false)
      })
    }
  }

  return(
    <Modal
      isOpen={modalOpen}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">
          {action ? 'Are you sure?' : 'Document info'}
        </h5>
      </div>
      <div className="modal-body">
        <p>{text}</p>
      </div>
      <div className="modal-footer">
        {
          action ? (
              <div className='actions'>
                <button onClick={moveToFailed} className="btn btn-secondary wawes-effect">Close</button>
                <button onClick={submitAction} className="btn btn-primary wawes-effect ml-3" disabled={processing}>
                  {processing ? 'Hold on...' : 'Submit'}
                </button>
              </div>
            ) : (
              type === 'reject'
                ? <button onClick={moveToFailed} className="btn btn-secondary wawes-effect">Close</button>
                : <button onClick={() => setModalOpen(false)} className="btn btn-secondary wawes-effect">Close</button>
            )
        }
      </div>
    </Modal>
  );
};

export default InfoModal;