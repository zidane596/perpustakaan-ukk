import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/auth.js';
import { Sidebar } from '../component/Sidebar.js';
import { Header } from '../component/Header.js';
import { EditBukupopup } from '../component/EditBukupopup.js';
import { DetailBukuPopup } from '../component/DetailBukupopup.js';

const DaftarBukuPetugas = () => {
    const { token, logout, isLogin } = useAuth();
    const [user, setUser] = useState({});
    const [buku, setBuku] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [DetailUser, setDetailUser] = useState(null);
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const queryFromUrl = searchParams.get("q") || "";

    const [query, setQuery] = useState(queryFromUrl);
    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error.message);
        }
    }, [token]);

    const fetchBuku = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/buku', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBuku(response.data);
        } catch (error) {
            console.error('Error fetching books:', error.message);
        }
    }, [token]);

    const filteredItems = buku.filter((item) =>
        item.Judul.toLowerCase().includes(queryFromUrl.toLowerCase())
    );

    const deleteBuku = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/buku/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            fetchBuku();
        } catch (error) {
            console.error('Error deleting book:', error.message);
        }
    };

    const saveUser = async (id, updatedData) => {
        try {
            await axios.put(`http://localhost:5000/api/user/${id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setSelectedUser(null);
            fetchUser();
        } catch (error) {
            console.error('Error updating user:', error.message);
        }
    };

    useEffect(() => {
        if (!isLogin) {
            navigate('/login');
        }
        fetchUser();
        fetchBuku();
        
    }, [isLogin, navigate, fetchUser, fetchBuku]);

    useEffect(() => {
            setSearchParams(query ? { q: query } : {});
        }, [query, setSearchParams]);

    return (
        <div className='flex flex-row h-screen w-screen '>
            <Sidebar />
            <div className="flex flex-col overflow-y-auto flex-1 bg-gray-50">
                <Header user={user} logout={logout}/>
                    <div className='flex flex-row items-center justify-between mx-6  rounded-lg'>
                        <Link className='bg-blue-500 text-white px-4 py-2 rounded-lg'>Tambah Buku</Link>
                            <input
                                type="text"
                                placeholder="Search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="border p-2 rounded-lg "
                            />
                    </div>
                <div className="flex-1 flex-col mx-6 my-4 rounded-lg shadow-md bg-white">
                        <table className="min-w-full divide-y divide-gray-200 ">
                            <thead className="bg-blue-500">
                                <tr>
                                    <th className="text-xs text-left text-white font-medium uppercase tracking-wider px-6 py-3 ">BukuID</th>
                                    <th className="text-xs text-left text-white font-medium uppercase tracking-wider px-6 py-3">Judul</th>
                                    <th className="text-xs text-left text-white font-medium uppercase tracking-wider px-6 py-3">Penulis</th>
                                    <th className="text-xs text-left text-white font-medium uppercase tracking-wider px-6 py-3 ">Penerbit</th>
                                    <th className="text-xs text-left text-white font-medium uppercase tracking-wider px-6 py-3 ">Tahun</th>
                                    <th className="text-xs text-left text-white font-medium uppercase tracking-wider px-6 py-3 ">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((book, index) => (
                                    <tr key={book.BukuID}>
                                        <td className="px-6 py-3 text-left text-sm whitespace-nowrap">{index + 1}</td>
                                        <td className="px-6 py-3 text-left text-sm whitespace-nowrap">{book.Judul}</td>
                                        <td className="px-6 py-3 text-left text-sm whitespace-nowrap">{book.Penulis}</td>
                                        <td className="px-6 py-3 text-left text-sm whitespace-nowrap">{book.Penerbit}</td>
                                        <td className="px-6 py-3 text-left text-sm whitespace-nowrap">{book.TahunTerbit}</td>
                                        <td className=''>
                                            <div className="dropdown">
                                                <button className="py-1 px-2 text-sm border-2 border-blue-500 rounded-xl">Aksi</button>
                                                <div className="dropdown-content">
                                                    <button onClick={() => setSelectedUser(book)}>Edit</button>
                                                    <button onClick={() => setDetailUser(book)}>Detail</button>
                                                    <button onClick={() => deleteBuku(book.BukuID)}>Hapus</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-gray-600 text-center">Tidak ada data buku tersedia.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                </div>
                {selectedUser && (
                    <EditBukupopup 
                    buku={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSave={saveUser}
                     />
                )}
                {DetailUser && (
                    <DetailBukuPopup 
                    buku={DetailUser}
                    onClose={() => setDetailUser(null)}
                     />
                )}
            </div>
        </div>
    ); 
};

export default DaftarBukuPetugas;
