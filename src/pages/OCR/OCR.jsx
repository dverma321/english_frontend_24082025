import React, { useState } from "react";
import axios from "axios";

// Choose API URL based on environment
const apiUrl = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_PROD_API_URL;

const token = localStorage.getItem("jwtoken");
const isAdmin = localStorage.getItem("isAdmin") === "true";

const OCR = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/ocr/ocr`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setText(res.data.text);
    } catch (err) {
      console.error(err);
      alert("Error extracting text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "120px", fontFamily: "Arial" }}>
      <h2>📷 OCR Extractor (Hindi + English)</h2>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Extract Text
      </button>

      {loading && <p>Processing image... please wait ⏳</p>}

      {text && (
        <div style={{ marginTop: "20px" }}>
          <h3>Extracted Text:</h3>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              borderRadius: "5px",
              whiteSpace: "pre-wrap",
            }}
          >
            {text}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OCR;
