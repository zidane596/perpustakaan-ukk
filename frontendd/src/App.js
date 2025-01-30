import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Hanya gunakan Routes dan Route
import Login from './user/login.js';
import Registrasi from './user/registrasi.js';
import Dashboard from './user/dashboard.js';
import DaftarBuku from './user/daftarbuku.js';
import AddBuku from './user/addbuku.js';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrasi" element={<Registrasi />} />
      <Route path="/beranda" element={<Dashboard />} />
      <Route path="/daftar-buku" element={<DaftarBuku />} />
      <Route path="/add-buku" element={<AddBuku />} />
    </Routes>
  );
};

export default App;
