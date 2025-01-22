import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  const handleValidation = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        Username,
        Password,
      });

      if (response.data.isValid) {
        setIsValid(true);
        navigate('/dashboard'); // Redirect ke dashboard jika berhasil login
      } else {
        setIsValid(false); // Jika login gagal
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col w-full md:w-3/5 h-auto md:h-1/2">
          <div>
            <div className="title flex flex-col mb-4">
              <span className="font-semibold font-['ubuntu'] text-4xl mb-1">Masuk</span>
              <span className="font-normal font-['ubuntu'] text-gray-500 text-l">
                Selamat datang kembali, silahkan mengisi Username dan Password Anda
              </span>
            </div>
            <div className="form-group flex flex-col">
              <label className="font-semibold mt-4 font-['ubuntu'] text-l mb-2">Username</label>
              <input
                type="text"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-blue-100 rounded-lg shadow-sm border border-gray-500 p-3 input font-['ubuntu']"
                placeholder="Username"
              />
              {isValid === false && (
                <span className="text-red-500">Username atau Password tidak valid</span>
              )}
            </div>
            <div className="form-group flex flex-col mt-4">
              <label className="font-semibold mt-4 font-['ubuntu'] text-l mb-2">Password</label>
              <input
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-blue-100 rounded-lg shadow-sm border border-gray-500 p-3 input font-['ubuntu']"
                placeholder="Password"
              />
            </div>
            <div className="mt-14 text-center">
              <button
                onClick={handleValidation}
                className="mb-3 btn w-full bg-blue-600 text-white font-semibold font-['ubuntu'] text-l rounded-lg shadow-sm p-3"
              >
                Masuk
              </button>
              <span className="font-['ubuntu'] text-gray-500 text-l">
                Masuk Sebagai Guru?
                <a href="/login-guru" className="text-blue-600 text-l font-['ubuntu']">
                  mampir sini
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
