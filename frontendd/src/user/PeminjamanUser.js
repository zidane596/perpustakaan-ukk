import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../component/Header';
import { Sidebar } from '../component/Sidebar';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router';
import { ReturnPopup } from '../component/Returnpopup.js';

const PeminjamanUser = () => {
    const { token, logout, isLogin, isRole } = useAuth();
    const [user, setUser] = useState('');
    const [borrow, setBorrow] = useState([]);
    const [returnPopupVisible, setReturnPopupVisible] = useState(false);
    const [selectedBorrow, setSelectedBorrow] = useState(null);
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
            const response = await axios.get(`http://localhost:5000/api/borrowbyid`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBorrow(response.data);
        } catch (error) {
            setError(error.message);
        }
    }, [token, user.UserID]);

    const handleReturn = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/return/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBorrow();
        } catch (error) {
            setError(error.message);
        }
    };

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
        <div className='flex flow-row h-screen'>
            <Sidebar />
            <div className='flex flex-col flex-1 h-screen overflow-y-auto bg-gray-50'>
                <Header user={user} logout={logout} />
                <div className="m-6 bg-white max-w-full h-full shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-y-auto max-h-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider rounded-tl-lg">No</th>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider">Buku</th>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider">Penulis</th>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider">Tanggal Pinjam</th>
                                    <th className="px-6 py-3 text-xs text-left font-medium text-white uppercase tracking-wider rounded-tr-lg">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {borrow.length > 0 ? (
                                    borrow.map((borrows, index) => (
                                        <tr key={borrows.id}>
                                            <td className="px-6 py-4 text-left text-sm whitespace-nowrap">{index + 1}</td>
                                            <td className="px-6 py-4 text-left text-sm whitespace-nowrap">{borrows.Buku.Judul}</td>
                                            <td className="px-6 py-4 text-left text-sm whitespace-nowrap">{borrows.Buku.Penulis}</td>
                                            <td className="px-6 py-4 text-left text-sm whitespace-nowrap">{borrows.TanggalPeminjaman}</td>
                                            <td className="whitespace-nowrap">
                                                <button className='px-3 py-2 rounded-xl text-green-400 text-sm border-green-400 border-2' onClick={() => { setReturnPopupVisible(true); setSelectedBorrow(borrows.BukuID); }}>Kembalikan</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-600 p-10">Belum ada data peminjaman</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {returnPopupVisible && (
                    <ReturnPopup
                        isOpen={returnPopupVisible}
                        onClose={() => setReturnPopupVisible(false)}
                        onConfirm={() => {
                            handleReturn(selectedBorrow);
                            setReturnPopupVisible(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default PeminjamanUser;

