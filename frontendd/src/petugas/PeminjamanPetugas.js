import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from '../component/Sidebar';
import { useAuth } from '../context/auth';
import { Header } from '../component/Header';

const PeminjamanPetugas = () => {
    const { token, isLogin, logout, isRole } = useAuth();
    const [user, setUser] = useState({});
    const [borrowData, setBorrowData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            setError('Error fetching user: ' + error.message);
        }
    }, [token]);

    const fetchBorrow = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/borrow', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBorrowData(response.data);
        } catch (error) {
            setError('Error fetching borrow data: ' + error.message);
        }
    }, [token]);

    useEffect(() => {
        if (!isLogin || isRole !== "Petugas") {
            return navigate('/login');
        }
        fetchUser();
        fetchBorrow();
    }, [isLogin,isRole, navigate, fetchUser, fetchBorrow]);

    return (
        <div className='flex flex-row'>
            <Sidebar />
            <div className='flex flex-1 flex-col bg-gray-50 h-screen'>
                <Header user={user} logout={logout} />
                <div className="m-6 bg-white max-w-full h-full shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-y-auto max-h-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">Judul Buku</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">Tanggal Peminjaman</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">Tanggal Pengembalian</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider rounded-tr-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {borrowData.length > 0 ? (
                                    borrowData.map((peminjaman, index) => (
                                        <tr key={peminjaman.ID}>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm ">{index + 1}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm ">{peminjaman.User.Username}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm ">{peminjaman.Buku.Judul}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm ">{peminjaman.TanggalPeminjaman}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm ">
                                            <p>{peminjaman.TanggalPengembalian && peminjaman.TanggalPengembalian !== "0000-00-00" 
    ? peminjaman.TanggalPengembalian 
    : '-'}</p>
                                            </td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{peminjaman.StatusPeminjaman}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-gray-600 text-center p-4">
                                            Tidak ada data peminjaman tersedia.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default PeminjamanPetugas;



