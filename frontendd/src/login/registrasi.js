import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registrasi = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [Nama_Lengkap, setNama_Lengkap] = useState('');
  const [Alamat, setAlamat] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const addUser = async (event) => {
    event.preventDefault(); // Mencegah form submit default
    try {
      await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          Username,
          Password,
          Email,
          Nama_Lengkap,
          Alamat
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
        navigate('/login'); // Navigasi ke dashboard
    } catch (error) {
      console.error('Error during login:', error);
      alert('Terjadi kesalahan pada server.');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Bagian Kiri */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center text-white p-10" >
        <h1 className="text-4xl font-bold mb-4">Selamat Datang Di Perpustakaan Digital</h1>
        <p className="text-lg">
          Akses ribuan buku dari berbagai genre dan bidang. Bacalah kapan saja, di mana saja. Daftar atau masuk sekarang untuk menjelajahi dunia
          pengetahuan tak terbatas dan temukan buku favoritmu.
        </p>
      </div>

      {/* Bagian Kanan */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-10">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-center mb-6 text-blue-600">DAFTAR</h2>
          <form onSubmit={addUser}>
            {/* Input Username */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-blue-100 rounded-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span className="absolute left-3 top-3.5 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zm-9 9a6.75 6.75 0 0113.5 0v.75H6.75v-.75z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Input Email */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-blue-100 rounded-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="absolute left-3 top-3.5 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zm-9 9a6.75 6.75 0 0113.5 0v.75H6.75v-.75z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Input Namalengkap */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-blue-100 rounded-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={Nama_Lengkap}
                  onChange={(e) => setNama_Lengkap(e.target.value)}
                />
                <span className="absolute left-3 top-3.5 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zm-9 9a6.75 6.75 0 0113.5 0v.75H6.75v-.75z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Input Alamat */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="Text"
                  placeholder="Alamat"
                  className="w-full bg-blue-100 rounded-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={Alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
                <span className="absolute left-3 top-3.5 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9A3.75 3.75 0 1112 5.25 3.75 3.75 0 0115.75 9zm-9 9a6.75 6.75 0 0113.5 0v.75H6.75v-.75z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Input Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="w-full bg-blue-100 rounded-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="absolute left-3 top-3.5 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 9.75A6.75 6.75 0 0115 3c.7 0 1.37.1 2 .29m0 0l.01.01m-2-.3a6.733 6.733 0 011.15 10.84c-.4.5-.74.89-.74.89M8.25 15h-.38"
                    />
                  </svg>
                </span>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  className="mr-2"
                  checked={showPassword}
                  onChange={handleShowPasswordChange}
                />
                <label htmlFor="showPassword" className="text-gray-600 text-sm">
                  Tampilkan sandi
                </label>
              </div>
            </div>

            {/* Tombol Login */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-full hover:from-blue-600 hover:to-purple-700"
              >
                DAFTAR
              </button>
            </div>
          </form>

          {/* Link Daftar */}
          <p className="mt-4 text-center text-gray-600">
            sudah punya akun?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registrasi;
