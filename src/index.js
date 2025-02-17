import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ExcelToTextConverter from './Components/Converter';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ExcelToTextConverter />
  </React.StrictMode>
);


reportWebVitals();
