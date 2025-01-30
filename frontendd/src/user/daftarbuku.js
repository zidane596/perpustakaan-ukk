import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth.js';
import { Sidebar } from '../component/Sidebar.js';

const DaftarBuku = () => {
    const { token, logout, isLogin } = useAuth();
    const [user, setUser] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [buku, setBuku] = useState([]);
    const [allBuku, setAllBuku] = useState([]); // Store all books

    const navigate = useNavigate();
    const location = useLocation();

    const searchQueryFromUrl = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        if (searchQueryFromUrl) {
            setSearchQuery(searchQueryFromUrl);
        }
    }, [searchQueryFromUrl]);

    useEffect(() => {
        if (!isLogin) {
            navigate('/login');
        }
    }, [isLogin, navigate]);

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
            setAllBuku(response.data); // Store all books
        } catch (error) {
            console.error('Error fetching books:', error.message);
        }
    }, [token]);

    useEffect(() => {
        if (isLogin) {
            fetchUser();
            fetchBuku();
        }
    }, [isLogin, fetchUser, fetchBuku]);

    const seachBuku = async (e) => {
        e.preventDefault();
        navigate(`/daftar-buku?q=${searchQuery}`);

        // Filter books based on search query
        const filteredBuku = allBuku.filter(book =>
            book.Judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.Penulis.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.Penerbit.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setBuku(filteredBuku);
    };

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

    return (
        <div className='flex flex-row h-screen w-screen '>
            <Sidebar />
            <div className="flex flex-col overflow-y-auto flex-1 bg-blue-100">
            <div className="flex items-center justify-between rounded-lg m-6 p-4 bg-white shadow-md">
                    <div className="flex flex-col text-2xl font-semibold text-gray-800">
                        {user.Username}
                        <span className='text-gray-500 text-sm'>{user.Email}</span>
                    </div>
                    <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">
                        Logout
                    </button>
                </div>
                <div className="flex-1 flex-col m-6 p-4 rounded-lg shadow-md bg-gray-50">
                    <div className='flex flex-row items-center justify-between w-full gap-10  rounded-lg'>
                        <Link to="/add-buku" className='bg-blue-500 text-white px-4 py-2 rounded'>Tambah Buku</Link>
                        <form className='' onSubmit={seachBuku}>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border p-2 rounded "
                            />
                            <button type="submit" className="bg-blue-500 text-white  px-4 py-2 rounded">
                                Search
                            </button>
                        </form>
                    </div>
                    {buku.length > 0 ? (
                        <table className="table-none table-fixed mt-10 w-full">
                            <thead className="bg-gray-200 rounded-lg">
                                <tr>
                                    <th className="text-lg border-gray-600 border px-4 py-2 ">BukuID</th>
                                    <th className="text-lg border-gray-600 border px-4 py-2">Judul</th>
                                    <th className="text-lg border-gray-600 border px-4 py-2">Penulis</th>
                                    <th className="text-lg border-gray-600 border px-4 py-2 ">Penerbit</th>
                                    <th className="text-lg border-gray-600 border px-4 py-2 ">Tahun</th>
                                    <th className="text-lg border-gray-600 border px-4 py-2 ">Kategori</th>
                                    <th className="text-lg border-gray-600 border px-4 py-2 "></th>
                                    <th className="text-lg border-gray-600 border px-4 py-2 "></th>
                                </tr>
                            </thead>
                            <tbody>
                                {buku.map((book) => (
                                    <tr key={book.BukuID}>
                                        <td className="border-gray-600 border px-4 py-2">{book.BukuID}</td>
                                        <td className="border-gray-600 border px-4 py-2">{book.Judul}</td>
                                        <td className="border-gray-600 border px-4 py-2">{book.Penulis}</td>
                                        <td className="border-gray-600 border px-4 py-2">{book.Penerbit}</td>
                                        <td className="border-gray-600 border px-4 py-2">{book.TahunTerbit}</td>
                                        <td className="border-gray-600 border px-4 py-2">
                                            {book.kategoribuku_relasis.length > 0
                                                ? book.kategoribuku_relasis.map((relasi, index) => (
                                                    <span key={index}>{relasi.Kategori.NamaKategori}{index < book.kategoribuku_relasis.length - 1 && ', '}</span>
                                                ))
                                                : 'No Category'}
                                        </td>
                                        <td className='border-gray-600 border text-l font-semibold px-4 py-2'>
                                            <button className='py-2 px-4 bg-yellow-500 text-white rounded-lg'>Edit</button>
                                        </td>
                                        <td className='border-gray-600 border text-l font-semibold px-4 py-2'>
                                            <button className='py-2 px-4 bg-red-500 text-white rounded-lg' onClick={() => deleteBuku(book.BukuID)}>Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-600 text-center">Tidak ada data buku tersedia.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DaftarBuku;