import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../component/Header';
import { Sidebar } from '../component/Sidebar';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router';

const PeminjamanUser = () => {
    const { token, logout, isLogin, isRole } = useAuth();
    const [user, setUser] = useState('');
    const [borrow, setBorrow] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/user", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            setError(error.message);
        }
    }, [token]);

    const fetchBorrow = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/borrow/${user.UserID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBorrow(response.data);
        } catch (error) {
            setError(error.message);
        }
    }, [token, user.UserID]);

    useEffect(() => {
        if (!isLogin) {
            navigate('/login');
        }
        if (isRole !== 'User') {
            navigate('/login');
        }
        fetchUser();
        fetchBorrow();
    }, [isLogin, isRole, navigate, fetchUser, fetchBorrow]);

    return (
        <div className='flex flow-row'>
            <Sidebar />
            <div className='flex flex-col flex-1 h-screen overflow-y-auto bg-gray-50'>
                <Header user={user} logout={logout} />
                <div className="m-6 bg-white max-w-full h-full rounded-lg shadow-md">
                    <div className="overflow-y-auto max-h-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider rounded-tl-lg">No</th>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider">Buku</th>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider">Tanggal Pinjam</th>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider rounded-tr-lg">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {borrow.length > 0 ? (
                                    borrow.map((borrows, index) => (
                                        <tr key={borrows.id}>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{index + 1}</div>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{borrows.Buku.Judul}</div>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{borrows.TanggalPeminjaman}</div>
                                            </td>
                                            <td className="whitespace-nowrap">
                                                <button className='px-3 py-2 rounded-xl text-green-400 text-sm border-green-400 border-2'>Kembalikan</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-600 p-10">
                                            Belum ada data peminjaman
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

export default PeminjamanUser;

