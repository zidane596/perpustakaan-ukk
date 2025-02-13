import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router";
import { Sidebar } from "../component/Sidebar.js";
import { Header } from "../component/Header.js";
import { AddKategoriPopup } from "../component/addkategori.js";
import { EditKategori } from "../component/editkategori.js";

const DaftarKategori = () => {
    const { token, logout, isLogin, isRole } = useAuth();
    const [user, setUser] = useState({});
    const [kategori, setKategori] = useState([]);
    const [addingKategori, setAddingKategori] = useState(false);
    const [editkategori, seteditKategori] = useState(null);
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

    const fetchKategori = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/kategoribuku", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setKategori(response.data);
        } catch (error) {
            setError(error.message);
        }
    }, [token]);

    const handleAddKategori = async (data) => {
        try {
            await axios.post(`http://localhost:5000/api/kategoribuku`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchKategori();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditKategori = async (id, namaBaru) => {
        try {
            await axios.put(`http://localhost:5000/api/kategoribuku/${id}`,
                { NamaKategori: namaBaru }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchKategori();
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        if (!isLogin || (isRole !== 'Admin' && isRole !== 'Petugas')) {
            navigate("/login");
            return;
        }
        fetchUser();
        fetchKategori();
    }, [fetchUser, fetchKategori, navigate, isLogin, isRole]);

    return (
        <div className="flex flex-row bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col h-screen">
                <Header user={user} logout={logout} />
                <div className="flex flex-row items-center justify-between mx-6 rounded-lg">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setAddingKategori(true)}>Tambah Kategori</button>
                </div>
                <div className="my-4 mx-6 bg-white rounded-lg shadow-md max-w-full h-full overflow-hidden">
                    <div className="overflow-x-auto max-h-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {kategori.length > 0 ? (
                                    kategori.map((item, index) => (
                                        <tr key={item.KategoriID}>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{index + 1}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{item.NamaKategori}</td>
                                            <td className="pt-1 flex justify-center gap-2 whitespace-nowrap text-sm flex-row">
                                                <button className="py-1 px-2 border-2 border-green-500 text-sm text-green-500 rounded-xl" onClick={() => seteditKategori(item.KategoriID)}>Edit</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-3 text-gray-500">Tidak ada kategori tersedia.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {addingKategori && (
                    <AddKategoriPopup
                        onClose={() => setAddingKategori(false)}
                        onAdd={handleAddKategori}
                    />
                )}
                {editkategori && (
                    <EditKategori
                        isOpen={editkategori}
                        onClose={() => seteditKategori(null)}
                        onSave={(namaBaru) => handleEditKategori(editkategori, namaBaru)}
                        kategori={kategori.find((item) => item.KategoriID === editkategori)}
                    />
                )}

            </div>
        </div>
    );
};

export default DaftarKategori;

