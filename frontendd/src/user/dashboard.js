import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Sidebar } from '../component/Sidebar.js';

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [buku, setBuku] = useState([]);
    const token = localStorage.getItem('token');
    let decodedToken;

    if (token) {
        try {
            decodedToken = jwt_decode(token);
        } catch (error) {
            console.error('Invalid token:', error.message);
    //         window.location.href = '/login'; // Redirect jika token tidak valid
        }
    } else {
        console.error('Token tidak ditemukan');
        window.location.href = '/login'; // Redirect jika token kosong
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    const fetchUser = useCallback(async () => {
        if (!decodedToken || !decodedToken.UserID) return; // Cegah fetch jika token invalid
        try {
            const response = await axios.get(`http://localhost:5000/api/user/${decodedToken.UserID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [token, decodedToken]);

    const fetchBuku = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/buku', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setBuku(response.data);
        } catch (error) {
            console.error(error);
        }
    }, [token]);

    useEffect(() => {
        fetchUser();
        fetchBuku();
    }, [fetchUser, fetchBuku]);

    return (
        <div className='flex flex-row h-screen w-screen '>
            <Sidebar />
            <div className="flex flex-col flex-1 bg-blue-100">
                <div className="flex items-center justify-between rounded-lg m-6 p-4 bg-white shadow-md">
                    <div className="text-2xl font-semibold text-gray-800">{user.Username}</div>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
                        Logout
                    </button>
                </div>
                <div className="flex-1 p-6 bg-gray-50">
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
                                    <td className="border px-4 py-2">{book.Pengarang}</td>
                                    <td className="border px-4 py-2">{book.Tahun}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
