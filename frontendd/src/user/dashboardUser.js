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

    useEffect(() => {
        if (!isLogin || isRole !== 'User') {
            logout();
            navigate('/login');
            return;
        }

        const fetchCountBorrow = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/countborrowbyid', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCountBorrow(response.data.count || 0);
            } catch (error) {
                console.error('Error fetching count borrow:', error.message);
            }
        };

        const fetchHistoryBorrow = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/borrow/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistoryBorrow(response.data);
            } catch (error) {
                console.error('Error fetching history borrow:', error.message);
            }
        };

        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        };

        fetchUser();
        fetchCountBorrow();
        fetchHistoryBorrow();
    }, [isLogin, isRole, logout, navigate, token]);

    return (
        <div className='flex h-screen bg-gray-100'>
            <Sidebar />
            <div className='flex flex-1 flex-col overflow-y-auto'>
                <Header user={user} logout={logout} />
                <main className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center bg-blue-600 text-white rounded-lg p-6 shadow-md">
                            <p className="text-lg font-medium">Jumlah Peminjaman</p>
                            <span className='text-4xl font-bold mt-2'>{countBorrow}</span>
                        </div>
                        <div className="flex flex-col items-center bg-blue-600 text-white rounded-lg p-6 shadow-md">
                            <p className="text-lg font-medium">Jumlah Peminjaman</p>
                            <span className='text-4xl font-bold mt-2'>{countBorrow}</span>
                        </div>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6 mt-6 overflow-y-auto max-h-screen">
                        <h2 className="text-2xl sticky top-0 font-semibold text-gray-800 mb-4 border-b pb-2">Riwayat Peminjaman (Selesai)</h2>
                        {historyBorrow.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full text-left border-collapse">
                                    <thead className="bg-blue-500 text-white sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-xs text-center text-white font-medium uppercase tracking-wider">No</th>
                                            <th className="px-6 py-3 text-xs text-center text-white font-medium uppercase tracking-wider">Judul Buku</th>
                                            <th className="px-6 py-3 text-xs text-center text-white font-medium uppercase tracking-wider">Tanggal Peminjaman</th>
                                            <th className="px-6 py-3 text-xs text-center text-white font-medium uppercase tracking-wider">Tanggal Pengembalian</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {historyBorrow.map((history, index) => (
                                            <tr key={history.ID}>
                                                <td className="px-6 py-3 text-center whitespace-nowrap text-sm">{index + 1}</td>
                                                <td className="px-6 py-3 text-center whitespace-nowrap text-sm">{history.Buku.Judul}</td>
                                                <td className="px-6 py-3 text-center whitespace-nowrap text-sm">{history.TanggalPeminjaman}</td>
                                                <td className="px-6 py-3 text-center whitespace-nowrap text-sm">{history.TanggalPengembalian}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center">Tidak ada riwayat peminjaman selesai tersedia.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardUser;