import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Hanya gunakan Routes dan Route
import Login from './login/login.js';
import Registrasi from './login/registrasi.js';
import Dashboard from './admin/dashboard.js';
import DaftarBuku from './admin/daftarbuku.js';
import Peminjaman from './admin/peminjaman.js';
import DaftarAkun from './admin/DaftarAkun.js';
import AddBuku from './admin/addbuku.js';
import DashboardPetugas from './petugas/dashboardPetugas.js';
import DashboardUser from './user/dashboardUser.js';
import PeminjamanUser from './user/PeminjamanUser.js';
import KoleksiUser from './user/KoleksiUser.js';
import AkunUser from './user/AkunUser.js';
import PeminjamanPetugas from './petugas/PeminjamanPetugas.js';
import DaftarBukuPetugas from './petugas/daftarbukuPetugas.js';
import AkunPetugas from './petugas/akunpetugas.js';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrasi" element={<Registrasi />} />
      
      {/* Admin /> */}
      <Route path="/beranda-admin" element={<Dashboard />} />
      <Route path="/peminjaman-admin" element={<Peminjaman />} />
      <Route path="/daftar-buku-admin" element={<DaftarBuku />} />
      <Route path="/add-buku-admin" element={<AddBuku />} />
      <Route path="/daftar-user-admin" element={<DaftarAkun />} />


      {/* Petugas /> */}
      <Route path="/beranda-petugas" element={<DashboardPetugas />} />
      <Route path="/peminjaman-petugas" element={<PeminjamanPetugas />} />
      <Route path="/daftar-buku-petugas" element={<DaftarBukuPetugas />} />
      <Route path="/akun-petugas" element={<AkunPetugas />} />

      {/* User /> */}
      <Route path="/beranda" element={<DashboardUser />} />
      <Route path="/peminjaman" element={<PeminjamanUser />} />
      <Route path="/koleksi-buku" element={<KoleksiUser />} />
      <Route path="/akun" element={<AkunUser />} />
    </Routes>
  );
};

export default App;

