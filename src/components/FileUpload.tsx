import React from 'react';
import './FileUpload.css';

interface FileUploadProps {
  file: File | null;
  onFileUpload: (file: File) => void;
  label?: string;
  id?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  file, 
  onFileUpload, 
  label = 'Choose Excel File',
  id = 'file-input'
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      onFileUpload(uploadedFile);
    }
  };

  return (
    <div className="upload-section">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        id={id}
      />
      <label htmlFor={id} className="file-label">
        {file ? file.name : label}
      </label>
    </div>
  );
};

export default FileUpload;
