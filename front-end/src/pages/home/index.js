import React, { useState } from "react";
import { PDFUploader, Loader, PDFReader } from "../../components";
import { apiClient } from "../../actions/api";
import axios from "axios";

const Home = () => {
  const [stage, setStage] = useState("upload");
  const [resultData, setResultData] = useState([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  const handleTryAgain = () => {
    setStage("upload");
    setResultData([]);
    setScore(0);
    setError(null);
  };
  
  const handleUpload = async (file) => {
    setStage("loading");
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://127.0.0.1:8000/api/plagiarism-detection/', formData);

      if (!response.status === 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Assuming the API returns data in the format you need
      // You might need to transform the data to match your expected format
      setResultData(response?.data || []);
      setScore(response?.data?.overal?.overal_score_pdf || 0);
      setStage("results");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to analyze document. Please try again.");
      setStage("upload");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-full mx-auto py-8 px-4">
        {stage === "upload" && (
          <>
            <PDFUploader onUpload={handleUpload} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center max-w-[480px] mx-auto">
                {error}
              </div>
            )}
          </>
        )}
        {stage === "loading" && <Loader />}
        {stage === "results" && <PDFReader onTryAgain={handleTryAgain} data={resultData} score={score} />}
      </div>
    </div>
  );
};

export default Home;