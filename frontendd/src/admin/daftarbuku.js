import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useNavigate, useSearchParams } from "react-router";
import { Sidebar } from "../component/Sidebar.js";
import { Header } from "../component/Header.js";
import { EditBukupopup } from "../component/EditBukupopup.js";
import { AddBukuPopup } from "../component/AddBukupopup.js"; 
import { DetailBukuPopup } from "../component/DetailBukupopup.js";

const DaftarBuku = () => {
    const { token, logout, isLogin, isRole} = useAuth();
    const [user, setUser] = useState({});
    const [buku, setBuku] = useState([]);
    const [error, setError] = useState(null);
    const [selectedBuku, setSelectedBuku] = useState(null);
    const [isAddingBuku, setIsAddingBuku] = useState(false);
    const [DetailBuku, setDetailBuku] = useState(null);
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const queryFromUrl = searchParams.get("q") || "";

    const [query, setQuery] = useState(queryFromUrl);

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

    const fetchBuku = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/buku", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBuku(response.data);
        } catch (error) {
            setError(error.message);
        }
    }, [token]);

    const deleteBuku = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/buku/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBuku();
        } catch (error) {
            setError(error.message);
        }
    };

    const saveBuku = async (id, updatedData) => {
        try {
            await axios.put(`http://localhost:5000/api/buku/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedBuku(null);
            fetchBuku();
        } catch (error) {
            setError(error.message);
        }
    };

    // Add new book
    const addBuku = async (data) => {
        try {
            await axios.post("http://localhost:5000/api/buku/add", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsAddingBuku(false);
            fetchBuku();
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredItems = buku.filter((item) =>
        item.Judul.toLowerCase().includes(queryFromUrl.toLowerCase())
    );

    useEffect(() => {
        if (!isLogin || (isRole !== 'Admin' && isRole !== 'Petugas')) {
            navigate("/login");
            return;
        }
        fetchUser();
        fetchBuku();
    }, [fetchUser, fetchBuku, navigate, isLogin, isRole]);

    useEffect(() => {
        setSearchParams(query ? { q: query } : {});
    }, [query, setSearchParams]);

    return (
        <div className="flex flex-row bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col h-screen">
                <Header user={user} logout={logout} />
                <div className="flex flex-row items-center justify-between mx-6 rounded-lg">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => setIsAddingBuku(true)}
                    >
                        Tambah Buku
                    </button>
                    <input
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="border p-2 rounded-lg"
                    />
                </div>

                <div className="m-6 bg-white rounded-lg shadow-md max-w-full h-full overflow-hidden">
                    {error && <p className="text-red-500 text-center">Error: {error}</p>}
                    <div className="overflow-x-auto max-h-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Judul</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Penulis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Penerbit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tahun</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {buku.length > 0 ? (
                                    filteredItems.map((book, index) => (
                                        <tr key={book.BukuID}>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{index + 1}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{book.Judul}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{book.Penulis}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{book.Penerbit}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{book.TahunTerbit}</td>
                                            <td className="flex justify-center items-center">
                                                <div className="pt-1 flex justify-center gap-2">
                                                    <button className="py-1 px-2 border-2 border-yellow-500 text-sm text-yellow-500 rounded-xl" onClick={() => setSelectedBuku(book)}>Edit</button>
                                                    <button className="py-1 px-2 border-2 border-blue-500 text-sm text-blue-500 rounded-xl" onClick={() => setDetailBuku(book)}>Detail</button>
                                                    <button className="py-1 px-2 border-2 border-red-500 text-sm text-red-500 rounded-xl" onClick={() => deleteBuku(book.BukuID)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-3 text-gray-500">Tidak ada data buku.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {selectedBuku && (
                <EditBukupopup
                    buku={selectedBuku}
                    onClose={() => setSelectedBuku(null)}
                    onSave={saveBuku}
                />
            )}
            {isAddingBuku && (
                <AddBukuPopup
                    onClose={() => setIsAddingBuku(false)} 
                    onSave={addBuku}
                />
            )}
                            {DetailBuku && (
                    <DetailBukuPopup
                        buku={DetailBuku}
                        onClose={() => setDetailBuku(null)}
                    />
                )}
        </div>
    );
};

export default DaftarBuku;

