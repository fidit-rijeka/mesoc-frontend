import React from 'react';

const FilePreview = ({ setFile, fileName }) => {
  return(
    <div className="filePreview">
      <span className="fileName">{fileName}</span>
      <button onClick={() => setFile([])} className="delFile">&times;</button>
    </div>
  );
};

export default FilePreview;