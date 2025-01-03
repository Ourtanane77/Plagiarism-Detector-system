import React, { useState } from "react";
import { Upload, FileUp, FileText, AlertCircle } from "lucide-react";

const PDFUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState(null);

  const validateFile = (file) => {
    if (!file) return "No file selected";
    if (file.type !== "application/pdf") return "Please upload a PDF file";
    if (file.size > 10 * 1024 * 1024)
      return "File size should be less than 10MB";
    return null;
  };

  const handleFileSelection = (file) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setFile(null);
      return;
    }
    setFileError(null);
    setFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileSelection(files?.[0]);
  };

  const handleFileInput = (e) => {
    handleFileSelection(e.target.files?.[0]);
  };

  const handleSubmit = async () => {
    if (file) {
      try {
        await onUpload(file);
      } catch (error) {
        setFileError("Failed to upload file. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-[480px] mt-60 mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">
          <FileText className="inline-block mr-2 mb-1" />
          PDF Document Analyzer
        </h1>
        <p className="text-gray-600">Upload your PDF for instant analysis</p>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center space-y-4 transition-colors
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${file ? "bg-green-50 border-green-300" : ""}
          ${fileError ? "border-red-300 bg-red-50" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex justify-center">
          <Upload
            className={`w-12 h-12 ${
              file
                ? "text-green-500"
                : fileError
                ? "text-red-500"
                : "text-gray-400"
            }`}
          />
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 inline-flex items-center">
              <FileUp className="w-6 h-6 mr-2" />
              Choose PDF
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileInput}
            />
          </label>
          <p className="text-lg text-gray-500">
            or drag and drop your file here
          </p>
        </div>

        {file && (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <FileText className="w-4 h-4" />
            <span>{file.name}</span>
          </div>
        )}

        {fileError && (
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{fileError}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2
          ${
            file && !fileError
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        disabled={!file || !!fileError}
      >
        <Upload className="w-6 h-6" />
        <span>Analyze Document</span>
      </button>
    </div>
  );
};

export default PDFUploader;
