import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useNavigate, useSearchParams } from "react-router";
import { Sidebar } from "../component/Sidebar";
import { Header } from "../component/Header";
import { DetailBukuPopup } from "../component/DetailBukuUserpopup";

const DaftarBukuu = () => {
    const { token, isLogin } = useAuth();
    const [user, setUser] = useState({});
    const [buku, setBuku] = useState([]);
    const [error, setError] = useState(null);
    const [DetailBuku, setDetailBuku] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryFromUrl = searchParams.get("q") || "";
    const [query, setQuery] = useState(queryFromUrl);

    // Fetch user data
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

    // Fetch all books
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

    const filteredItems = buku.filter((item) =>
        item.Judul.toLowerCase().includes(queryFromUrl.toLowerCase())
    );

    useEffect(() => {
        if (!isLogin) {
            navigate("/login");
            return;
        }
        fetchUser();
        fetchBuku();
    }, [fetchUser, fetchBuku, navigate, isLogin]);

    useEffect(() => {
        setSearchParams(query ? { q: query } : {});
    }, [query, setSearchParams]);

    return (
        <div className="flex flex-row bg-gray-50">
            <Sidebar />
            <div className="flex flex-1 flex-col h-screen">
                <Header user={user} />
                <div className="flex flex-row items-center justify-between mx-6 rounded-lg">
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
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
                                            <td className="px-6 py-3 whitespace-nowrap text-sm">
                                                <button onClick={() => setDetailBuku(book)}>Detail</button>
                                                </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-3 text-gray-500">Tidak ada data buku.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {DetailBuku && (
                    <DetailBukuPopup
                    buku={DetailBuku}
                    onClose={()=> setDetailBuku(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default DaftarBukuu;
