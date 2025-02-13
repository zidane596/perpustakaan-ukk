import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const Login = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const { login, isLogin, isRole } = useAuth();

  useEffect(() => {
    if (isLogin) {
        if (isRole === 'Admin' || isRole === 'Petugas') {
            navigate('/beranda-admin');  // Arahkan ke halaman admin
        } else if (isRole === 'User') {
            navigate('/beranda');  // Arahkan ke halaman user
        }
    }
}, [isLogin, isRole, navigate]);


  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validasi inputan
    if (!Username || !Password) {
      setIsValid(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { Username, Password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setLoading(false);

      const { token } = response.data;
      if (token) {
        login(token);
        navigate('/beranda');
      } else {
        setIsValid(false); 
      }
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        alert('Username atau password salah');
      } else {
        alert('Terjadi kesalahan pada server');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center text-white p-10">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang Di Perpustakaan Digital</h1>
        <p className="text-lg">Akses ribuan buku dari berbagai genre dan bidang...</p>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-10">
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-center mb-6 text-blue-600">MASUK</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-blue-100 rounded-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full bg-blue-100 rounded-full p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={handleShowPasswordChange}
                />
                <label htmlFor="showPassword" className="text-gray-600 text-sm">Tampilkan sandi</label>
              </div>
            </div>

            {isValid === false && (
              <p className="text-red-500 text-center">Username atau password salah.</p>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded-full hover:from-blue-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'MASUK'}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Belum punya akun? <a href="/registrasi" className="text-blue-500 hover:underline">Daftar</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
