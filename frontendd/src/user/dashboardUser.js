import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth.js';
import { Sidebar } from '../component/Sidebar.js';
import { Header } from '../component/Header.js';
import { useNavigate } from 'react-router-dom';

const DashboardUser = () => {
    const { token, isLogin, isRole, logout } = useAuth();
    const [user, setUser] = useState({});
    const [countBorrow, setCountBorrow] = useState(0);
    const [historyBorrow, setHistoryBorrow] = useState([]);
    const navigate = useNavigate();

    const fetchCountBorrow = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/countborrow', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCountBorrow(response.data.count || 0);
        } catch (error) {
            console.error('Error fetching count borrow:', error.message);
        }
    }, [token]);

    const fetchHistoryBorrow = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/historyborrow', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter hanya yang statusnya selesai
            const filteredHistory = response.data.filter(item => item.Status === 'Selesai');
            setHistoryBorrow(filteredHistory);
        } catch (error) {
            console.error('Error fetching history borrow:', error.message);
        }
    }, [token]);

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error.message);
        }
    }, [token]);

    useEffect(() => {
        if (!isLogin || isRole !== 'User') {
            logout();
            navigate('/login');
            return;
        }
        fetchUser();
        fetchCountBorrow();
        fetchHistoryBorrow();
    }, [fetchUser, fetchCountBorrow, fetchHistoryBorrow, isLogin, isRole, logout, navigate]);

    return (
        <div className='flex flex-row h-screen w-screen'>
            <Sidebar />
            <div className="flex flex-col flex-1 bg-gray-50">
                <Header user={user} logout={logout} />
                <div className="flex flex-col p-6 gap-4">
                    <div className='flex flex-row justify-between gap-4'>
                        <div className="flex flex-col items-start bg-white shadow rounded-lg p-4 w-1/4">
                            <p className="text-gray-800 font-medium">Jumlah Peminjaman: </p>
                            <span className='text-2xl font-semibold'>{countBorrow}</span>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6 mt-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Riwayat Peminjaman (Selesai)</h2>
                        {historyBorrow.length > 0 ? (
                            <table className="table-fixed w-full">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Judul Buku</th>
                                        <th className="px-4 py-2">Tanggal Peminjaman</th>
                                        <th className="px-4 py-2">Tanggal Pengembalian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyBorrow.map((history) => (
                                        <tr key={history.ID}>
                                            <td className="border px-4 py-2">{history.JudulBuku}</td>
                                            <td className="border px-4 py-2">{history.TanggalPinjam}</td>
                                            <td className="border px-4 py-2">{history.TanggalKembali}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-600 text-center">Tidak ada riwayat peminjaman selesai tersedia.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardUser;
