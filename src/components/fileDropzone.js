import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileDropzone = ({ setFile, setInvalid }) => {

  const onDrop = useCallback(acceptedFiles => {
    if(acceptedFiles.length === 0) {
      setInvalid('Only .pdf files are supported.');
      setTimeout(() => setInvalid(null), 5000);
      return;
    }
    if(acceptedFiles.length > 1) {
      setInvalid('Please upload only one document.');
      setTimeout(() => setInvalid(null), 5000);
      return;
    }
    setFile(acceptedFiles);
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop, accept: '.pdf'});

  return(
    <div className="dropArea" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p className="dtActive">Drop here!</p> :
          <p className="dtPassive">Drag and drop your document or click to open file explorer.</p>
      }
    </div>
  );
};

export default FileDropzone;