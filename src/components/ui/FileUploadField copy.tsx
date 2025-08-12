
// File: src/components/ui/SimpleFileUploadField.tsx
import React, { useState, DragEvent } from "react";
import dropFile from "../../assets/icons/dropFile.svg";

interface SimpleFileUploadFieldProps {
  label: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onChange?: (file: File) => void;
}

const SimpleFileUploadField: React.FC<SimpleFileUploadFieldProps> = ({ 
  label, 
  multiple = false,
  onFilesSelected,
  onChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (files: FileList) => {
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      setSelectedFiles(filesArray);
      if (onFilesSelected) {
        onFilesSelected(filesArray);
      } else if (onChange) {
        onChange(files[0]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      handleFileChange(e.currentTarget.files);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      {label && <label className="block font-medium mb-1">{label}</label>}
      <div
        className={`border-dashed border-2 p-6 rounded-lg text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label htmlFor="simple-file-upload" className="cursor-pointer block">
          <i className="text-gray-400 mb-4 flex items-center w-full justify-center">
            <img src={dropFile} alt="dropFile" />
          </i>
          <p className="text-gray-400">
            {multiple ? "Drop files here or click to upload multiple images." : "Drop file here or click to upload."}
          </p>
        </label>
        <input
          id="simple-file-upload"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          multiple={multiple}
        />
        {selectedFiles.length > 0 && (
          <div className="text-sm text-green-600 mt-2">
            <p>Selected {selectedFiles.length} files:</p>
            <ul className="list-disc list-inside">
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleFileUploadField;