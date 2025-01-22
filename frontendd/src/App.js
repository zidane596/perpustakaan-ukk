import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './user/login.js';
import Dashboard from './user/dashboard.js'; // Pastikan file ini ada

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
