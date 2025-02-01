import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Hanya gunakan Routes dan Route
import Login from './login/login.js';
import Registrasi from './login/registrasi.js';
import Dashboard from './admin/dashboard.js';
import DaftarBuku from './admin/daftarbuku.js';
import AddBuku from './admin/addbuku.js';
import DashboardPetugas from './petugas/dashboardPetugas.js';
import DashboardUser from './user/dashboardUser.js';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrasi" element={<Registrasi />} />
      
      {/* Admin /> */}
      <Route path="/beranda-admin" element={<Dashboard />} />
      <Route path="/daftar-buku-admin" element={<DaftarBuku />} />
      <Route path="/add-buku-admin" element={<AddBuku />} />


      {/* Petugas /> */}
      <Route path="/beranda-petugas" element={<DashboardPetugas />} />

      {/* User /> */}
      <Route path="/beranda" element={<DashboardUser />} />
    </Routes>
  );
};

export default App;
