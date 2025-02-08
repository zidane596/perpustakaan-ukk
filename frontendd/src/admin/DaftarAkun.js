import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth.js";
import { useNavigate, useSearchParams } from "react-router";
import { Sidebar } from "../component/Sidebar.js";
import { Header } from "../component/Header.js";
import { EditAkunPopup } from "../component/EditAkunpopup.js";
import { AddAkunPopup } from "../component/AddAkunpopup.js";
import { DetailAkunPopup } from "../component/DetailAkunpopup.js";

const DaftarAkun = () => {
    const { token, logout, isLogin, isRole } = useAuth();
    const [user, setUser] = useState({});
    const [akun, setAkun] = useState([]);
    const [error, setError] = useState(null);
    const [selectedAkun, setSelectedAkun] = useState(null);
    const [isAddingAkun, setAddingAkun] = useState(false);
    const [DetailAkun, setDetailAkun] = useState(null);
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

    const fetchAkun = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/alluser", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAkun(response.data);
        } catch (error) {
            setError(error.message);
        }
    }, [token]);

    const deleteAkun = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchAkun();
        } catch (error) {
            setError(error.message);
        }
    };

    const addAkun = async (newData) => {
        try {
            await axios.post("http://localhost:5000/api/user", newData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAddingAkun(false);
            fetchAkun();
        } catch (error) {
            setError(error.message);
        }
    };

    const saveAkun = async (id, updatedData) => {
        try {
            await axios.put(`http://localhost:5000/api/user/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSelectedAkun(null);
            fetchAkun();
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredItems = akun.filter((item) =>
        item.Username.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (!isLogin || isRole !== "Admin") {
            navigate("/login");
            return;
        }
        fetchUser();
        fetchAkun();
    }, [fetchUser, fetchAkun, navigate, isLogin, isRole]);
    

    useEffect(() => {
        setSearchParams(query ? { q: query } : {});
    }, [query, setSearchParams]);

    return (
        <div className="flex flex-row bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col h-screen">
                <Header user={user} logout={logout} />
                <div className="flex flex-row items-center justify-between mx-6 rounded-lg">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setAddingAkun(true)}>Tambah Akun</button>
                    <input
                        type="text"
                        placeholder="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="border p-2 rounded-lg"
                    />
                </div>

                <div className="m-6 bg-white rounded-lg shadow-md max-w-full h-full overflow-hidden">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="overflow-x-auto max-h-full">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((user, index) => (
                                        <tr key={user.AkunID}>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{index + 1}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{user.Username}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{user.Email}</td>
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">{user.Role.RoleName}</td>
                                            <td className="flex items-center justify-center">
                                                <div className="gap-2 flex flex-row">
                                                    <button className="py-1 px-2 border-2 border-yellow-500 text-sm text-yellow-500 rounded-xl" onClick={() => setSelectedAkun(user)}>Edit</button>
                                                    <button className="py-1 px-2 border-2 border-blue-500 text-sm text-blue-500 rounded-xl" onClick={() => setDetailAkun(user)}>Detail</button>
                                                    <button className="py-1 px-2 border-2 border-red-500 text-sm text-red-500 rounded-xl" onClick={() => deleteAkun(user.AkunID)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-3 text-gray-500">Tidak ada data akun.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {selectedAkun && (
                    <EditAkunPopup
                        user={selectedAkun}
                        onClose={() => setSelectedAkun(null)}
                        onSave={saveAkun}
                    />
                )}
                {isAddingAkun && (
                    <AddAkunPopup
                        onClose={() => setAddingAkun(false)}
                        onSave={addAkun}
                    />
                )}
                {DetailAkun && (
                    <DetailAkunPopup
                        user={DetailAkun}
                        onClose={() => setDetailAkun(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default DaftarAkun;

