import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Hanya gunakan Routes dan Route
import Login from './user/login.js';
import Registrasi from './user/registrasi.js';
import Dashboard from './user/dashboard.js';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrasi" element={<Registrasi />} />
      <Route path="/beranda" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
