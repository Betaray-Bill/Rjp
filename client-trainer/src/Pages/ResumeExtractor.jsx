import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "@/utils/api";

const ResumeExtractor = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [modelStatus, setModelStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await api.get("/resumeextractor/check-connection");
      setConnectionStatus(response.data.message);
      setModelStatus(response.data.modelStatus);
    } catch (error) {
      setConnectionStatus("Failed to connect to Azure");
      setError(error.response ? error.response.data : error.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setExtractedData(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setExtractedData(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await api.post("/resumeextractor/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setExtractedData(response.data);
    } catch (error) {
      console.error("Error extracting resume data:", error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderExtractedFields = () => {
    if (!extractedData || !extractedData.fields) return null;
    
    return Object.entries(extractedData.fields).map(([key, value]) => (
      <div key={key} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>{key}</h3>
        <p>Content: {value.content}</p>
      </div>
    ));
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Resume Extractor</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h3>Connection Status</h3>
        <p>{connectionStatus || "Checking connection..."}</p>
        {modelStatus && <p>Model Status: {modelStatus}</p>}
      </div>

      <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
      <button onClick={handleSubmit} disabled={!file || isLoading}>
        {isLoading ? "Processing..." : "Upload Resume"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: "20px" }}>
          <h3>Error</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {extractedData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Extracted Resume Data</h2>
          {renderExtractedFields()}
          <h3>Raw Data</h3>
          <pre style={{ background: "#f4f4f4", padding: "10px", overflow: "auto", maxHeight: "400px" }}>
            {JSON.stringify(extractedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResumeExtractor;