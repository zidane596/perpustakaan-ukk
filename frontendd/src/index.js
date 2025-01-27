import React from 'react';
import ReactDOM from 'react-dom/client'; // Menggunakan createRoot dari react-dom/client
import { BrowserRouter as Router } from 'react-router-dom'; // Tambahkan BrowserRouter di sini
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); // createRoot digunakan di sini
root.render(
  <React.StrictMode>
    <Router> {/* Membungkus App dengan BrowserRouter */}
      <App />
    </Router>
  </React.StrictMode>
);

reportWebVitals();
