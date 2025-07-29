import React, { useState, DragEvent } from "react";
import { useField, useFormikContext, ErrorMessage } from "formik";
import dropFile from "../../assets/icons/dropFile.svg";

interface FileUploadFieldProps {
  label: string;
  name: string;
  required?: boolean;
  maskImage?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onChange?: (file: File) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ 
  label, 
  name, 
  required,
  maskImage,
  multiple = false,
  onFilesSelected,
  onChange
}) => {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      if (onFilesSelected) {
        onFilesSelected(filesArray);
      } else if (onChange) {
        onChange(files[0]);
      } else if (multiple) {
        setFieldValue(name, filesArray);
      } else {
        setFieldValue(name, files[0]);
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      if (onFilesSelected) {
        onFilesSelected(filesArray);
      } else if (onChange) {
        onChange(files[0]);
      } else if (multiple) {
        setFieldValue(name, filesArray);
      } else {
        setFieldValue(name, files[0]);
      }
    }
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
      <label className="block font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`border-dashed border-2 p-6 rounded-lg text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {maskImage ? (
          <div className="flex flex-col items-center">
            <img 
              src={maskImage} 
              alt="Preview" 
              className="max-h-40 mb-4"
            />
            <label htmlFor={name} className="cursor-pointer text-blue-500 underline">
              Change Image
            </label>
          </div>
        ) : (
          <label htmlFor={name} className="cursor-pointer block">
            <i className="text-gray-400 mb-4 flex items-center w-full justify-center">
              <img src={dropFile} alt="dropFile" />
            </i>
            <p className="text-gray-400">
              {multiple ? "Drop files here or click to upload multiple images." : "Drop file here or click to upload."}
            </p>
          </label>
        )}

        <input
          id={name}
          name={name}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          multiple={multiple}
        />

        {field.value && !maskImage && (
          <div className="text-sm text-green-600 mt-2">
            {Array.isArray(field.value) ? (
              <div>
                <p>Selected {field.value.length} files:</p>
                <ul className="list-disc list-inside">
                  {field.value.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            ) : (
              typeof field.value === 'object' && <p>Selected: {field.value.name}</p>
            )}
          </div>
        )}
      </div>

      <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
    </div>
  );
};

export default FileUploadField;