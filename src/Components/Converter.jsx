import React, { useState } from "react";
import * as XLSX from "xlsx";
import './Converter.css';

export default function ExcelToTextConverter() {
  const [textData, setTextData] = useState("");
  const [converted, setConverted] = useState(false);
  const [fileName, setFileName] = useState("");  // New state to store the file name

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);  // Set the file name in state
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        // Remove the header row (first row) and process the remaining rows
        const processedText = jsonData.slice(1) // Skips the first row
          .map(row => row.map(cell => (cell ? String(cell).trim() : "")).join(""))
          .join("\n");
        
        setTextData(processedText);
        setConverted(true);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownload = () => {
    if (!converted) return;
    const blob = new Blob([textData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "converted.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancel = () => {
    setTextData("");
    setConverted(false);
    setFileName("");  // Reset file name on cancel
  };

  return (
    <div className=" body flex flex-col items-center space-y-4 p-6">
      <header>
        <h1>Excel - Text Converter</h1>
      </header>
      <div className="file-upload-container">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          id="fileInput"
          className="hidden-input"
        />
        <center>
          <label htmlFor="fileInput" className="custom-file-button">
            Choose File
          </label>
        </center>
      </div>
      
      {/* Display the uploaded file name */}
      {fileName && (
        <div className="file-name-display text-gray-700 mt-2" style={{textAlign: "center", margin: "0 0 20px 0"}}>
          <strong>Uploaded File:</strong> {fileName}
        </div>
      )}
      
      <textarea
        className="w-full h-40 p-2 border rounded-md text-display"
        value={textData}
        readOnly
        placeholder="Upload file to view the data..."
      />
      
      <center>
      <div className="flex space-x-4" id="Btn">
        <button
          onClick={handleDownload}
          disabled={!converted}
          className={`px-4 py-2 rounded-md text-white ${converted ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400"}`}
          id="download"
        >
          Download
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-md"
          id="cancel"
        >
          Cancel
        </button>
      </div>
      </center>
    </div>
  );
}
