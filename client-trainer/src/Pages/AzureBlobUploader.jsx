import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AzureBlobUploader = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("User object:", user); // Log the user object to verify its structure

    if (user && user.generalDetails && user.generalDetails.email) {
      setFolderName(user.generalDetails.email);
      console.log("Folder name set to:", user.generalDetails.email); // Log the folder name
    } else {
      console.log("Folder name not set, user email is missing."); // Log if folder name is not set
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !folderName) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", folderName);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/filestorage/upload-to-blob", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus(`File uploaded successfully: ${response.data.url}`);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Upload File to Azure Blob Storage</h2>

      <div style={{ marginBottom: "10px" }}>
        <input type="file" onChange={handleFileChange} />
      </div>

      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload File"}
      </button>

      {uploadStatus && <p style={{ color: "green", marginTop: "20px" }}>{uploadStatus}</p>}
      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
};

export default AzureBlobUploader;
