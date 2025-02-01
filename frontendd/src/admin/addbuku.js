import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { Sidebar } from '../component/Sidebar';

const AddBuku = () => {
    const { token, islogin, logout } = useAuth();
    const [user, setUser] = useState({}); // Inisialisasi user dengan objek kosong
    const [Judul, setJudul] = useState('');
    const [Penulis, setPenulis] = useState('');
    const [Penerbit, setPenerbit] = useState('');
    const [TahunTerbit, setTahunTerbit] = useState('');
    const [Stok, setStok] = useState('');
    const [Image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleAddBuku = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/buku/add',
                {
                    Judul,
                    Penulis,
                    Penerbit,
                    TahunTerbit,
                    Stok,
                    Image
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                }
            );
            console.log(response);
            alert('Buku berhasil ditambahkan!');
        } catch (error) {
            console.error('Error menambahkan buku:', error);
        }
    };
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

    const ImageHandler = (e) => {
        const file = e.target.files[0];
        setImage(file);
        
        // Membuat preview gambar
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };
    
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    return (
        <div className="flex flex-row h-screen w-screen">
            <Sidebar />
            <div className="flex flex-col overflow-y-auto flex-1 bg-blue-100">
                <div className="flex items-center justify-between rounded-lg m-6 p-4 bg-white shadow-md">
                    <div className="flex flex-col text-2xl font-semibold text-gray-800">
                        {user.Username || 'Guest'}
                        <span className="text-gray-500 text-sm">{user.Email || 'guest@example.com'}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        Logout
                    </button>
                </div>
                <div className="m-6 p-4 bg-white shadow-md rounded-lg">
                    <form onSubmit={handleAddBuku}>
                        
                        <input
                            type="text"
                            placeholder="Judul Buku"
                            value={Judul}
                            onChange={(e) => setJudul(e.target.value)}
                            className="w-full p-2 bg-blue-100 border border-gray-500 rounded-lg mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Penulis"
                            value={Penulis}
                            onChange={(e) => setPenulis(e.target.value)}
                            className="w-full p-2 bg-blue-100 border border-gray-500 rounded-lg mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Penerbit"
                            value={Penerbit}
                            onChange={(e) => setPenerbit(e.target.value)}
                            className="w-full p-2 bg-blue-100 border border-gray-500 rounded-lg mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Tahun Terbit"
                            value={TahunTerbit}
                            onChange={(e) => setTahunTerbit(e.target.value)}
                            className="w-full p-2 bg-blue-100 border border-gray-500 rounded-lg mb-4"
                        />
                        <input
                            type="number"
                            placeholder="Stok"
                            value={Stok}
                            onChange={(e) => setStok(e.target.value)}
                            className="w-full p-2 bg-blue-100 border border-gray-500 rounded-lg mb-4"
                        />
                        {/* <input
                            type="number"
                            placeholder="Kategori"
                            value={}
                            onChange={(e) => setTahunTerbit(e.target.value)}
                            className="w-full p-2 bg-blue-100 border border-gray-500 rounded-lg mb-4"
                        /> */}
                        <input
                            type="file"
                            onChange={ImageHandler}
                            className="w-full p-2 bg-blue-100 border border-gray-500 rounded-lg mb-4"
                        />
                        {imagePreview && <img src={imagePreview} alt="Image preview" className="mt-4 w-32 h-32 object-cover rounded-lg" />}
                        <button
                            type="submit"
                            className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Tambah Buku
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBuku;
