import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from '../component/Sidebar';
import { useAuth } from '../context/auth';
import { Header } from '../component/Header';

const KoleksiUser = () => {
    const { token, isLogin, logout, isRole } = useAuth();
    const [user, setUser] = useState({});
    const [koleksiData, setKoleksiData] = useState([]);
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

    const fetchKoleksi = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/koleksi', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKoleksiData(response.data);
        } catch (error) {
            setError('Error fetching collection data: ' + error.message);
        }
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/koleksi/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKoleksiData((prevData) => prevData.filter((koleksi) => koleksi.ID !== id));
        } catch (error) {
            setError('Error deleting collection: ' + error.message);
        }
    };

    useEffect(() => {
        if (!isLogin || isRole !== "User") {
            return navigate('/login');
        }
        fetchUser();
        fetchKoleksi();
    }, [isLogin, isRole, navigate, fetchUser, fetchKoleksi]);

    return (
        <div className='flex flex-row'>
            <Sidebar />
            <div className='flex flex-1 flex-col bg-gray-50 h-screen overflow-y-auto'>
                <Header user={user} logout={logout} />
                <div className="m-6 bg-white max-w-full h-full shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-y-auto max-h-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">Judul Buku</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">Penulis</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">Penerbit</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider">Tahun Terbit</th>
                                    <th className="px-6 py-3 text-xs text-left text-white font-medium uppercase tracking-wider rounded-tr-lg">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {koleksiData.length > 0 ? (
                                    koleksiData.map((koleksi, index) => (
                                        <tr key={koleksi.ID}>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{index + 1}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{koleksi.Buku.Judul}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm">{koleksi.Buku.Penulis}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm">{koleksi.Buku.Penerbit}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm">{koleksi.Buku.TahunTerbit}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handleDelete(koleksi.ID)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-gray-600 text-center p-4">
                                            Tidak ada data koleksi tersedia.
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

export default KoleksiUser;

