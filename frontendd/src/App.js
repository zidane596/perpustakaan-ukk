import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login/login.js';
import Registrasi from './login/registrasi.js';
import Dashboard from './admin/dashboard.js';
import DaftarBuku from './admin/daftarbuku.js';
import Peminjaman from './admin/peminjaman.js';
import DaftarAkun from './admin/DaftarAkun.js';
import DashboardUser from './user/dashboardUser.js';
import PeminjamanUser from './user/PeminjamanUser.js';
import KoleksiUser from './user/KoleksiUser.js';
import AkunUser from './user/AkunUser.js';
import AkunPetugas from './admin/akunpetugas.js';
import DaftarBukuu from './user/DaftarBukuUser.js';
import DaftarKategori from './admin/kategori.js';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrasi" element={<Registrasi />} />
      
      {/* Admin /> */}
      <Route path="/beranda-admin" element={<Dashboard />} />
      <Route path="/peminjaman-admin" element={<Peminjaman />} />
      <Route path="/daftar-buku-admin" element={<DaftarBuku />} />
      <Route path="/daftar-user-admin" element={<DaftarAkun />} />
      <Route path="/daftar-kategori-admin" element={<DaftarKategori />} />


      {/* Petugas /> */}
      <Route path="/akun-petugas" element={<AkunPetugas />} />

      {/* User /> */}
      <Route path="/beranda" element={<DashboardUser />} />
      <Route path="/daftar-buku" element={<DaftarBukuu />} />
      <Route path="/peminjaman" element={<PeminjamanUser />} />
      <Route path="/koleksi-buku" element={<KoleksiUser />} />
      <Route path="/akun" element={<AkunUser />} />
    </Routes>
  );
};

export default App;

