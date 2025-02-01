import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth.js';  
import { Sidebar } from '../component/Sidebar.js';
import { useNavigate } from 'react-router-dom';  

const DashboardUser = () => {
    const { token, isLogin, isRole, logout } = useAuth(); 
    const [user, setUser] = useState({});
    const [buku, setBuku] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            navigate('/login');
        } else if (isRole !== 'User') {
            logout();  // Logout if not a Petugas
            navigate('/login');
        } else {
            // Fetch user and books when valid login with Petugas role
            const fetchUser = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data); 
                } catch (error) {
                    console.error('Error fetching user:', error.message);
                }
            };

            const fetchBuku = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/buku', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setBuku(response.data);
                } catch (error) {
                    console.error('Error fetching books:', error.message);
                }
            };

            fetchUser();
            fetchBuku();
        }
    }, [isLogin, isRole, token, logout, navigate]);

    return (
        <div className='flex flex-row h-screen w-screen'>
            <Sidebar />
            <div className="flex flex-col flex-1 bg-blue-100">
                <div className="flex items-center justify-between rounded-lg m-6 p-4 bg-white shadow-md">
                    <div className="flex flex-col text-2xl font-semibold text-gray-800">
                        {user.Username}
                        <span className='text-gray-500 text-sm'>{user.Email}</span>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
                        Logout
                    </button>
                </div>
                <div className="flex-1 p-6 bg-gray-50">
                    {buku.length > 0 ? (
                        <table className="table-fixed w-full">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Judul</th>
                                    <th className="px-4 py-2">Pengarang</th>
                                    <th className="px-4 py-2">Tahun</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buku.map((book) => (
                                    <tr key={book.ID}>
                                        <td className="border px-4 py-2">{book.Judul}</td>
                                        <td className="border px-4 py-2">{book.Penulis}</td>
                                        <td className="border px-4 py-2">{book.TahunTerbit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-600 text-center">Tidak ada data buku tersedia.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardUser;
