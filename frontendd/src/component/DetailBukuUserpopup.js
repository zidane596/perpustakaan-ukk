import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";

export const DetailBukuPopup = ({ onClose, buku }) => {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        BukuID: 0,
        Judul: "",
        Penulis: "",
        Penerbit: "",
        TahunTerbit: "",
        Stok: "",
        KategoriID: "",
        Ulasan: "",
        Rating: 0,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (buku) {
            setFormData(buku);
        }
    }, [buku]);

    const handleUlasanChange = (e) => {
        setFormData({
            ...formData,
            Ulasan: e.target.value,
        });
    };

    const handleRatingChange = (e) => {
        setFormData({
            ...formData,
            Rating: parseInt(e.target.value, 10),
        });
    };

    const handleSubmitUlasan = async () => {
        setLoading(true);
        setMessage("");
        try {
            await axios.post(
                `http://localhost:5000/api/ulasan/tambah/${formData.BukuID}`,
                {
                    Ulasan: formData.Ulasan,
                    Rating: formData.Rating,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage("Ulasan berhasil disimpan!");
        } catch (error) {
            setMessage("Gagal menyimpan ulasan. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePinjamBuku = async () => {
        setLoading(true);
        setMessage("");
        try {
            await axios.post(
                `http://localhost:5000/api/borrow/add/${formData.BukuID}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage("Buku berhasil dipinjam!");
        } catch (error) {
            setMessage("Gagal meminjam buku. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddKoleksi = async () => {
        setLoading(true);
        setMessage("");
        try {
            await axios.post(
                `http://localhost:5000/api/koleksi/add/${formData.BukuID}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage("Buku berhasil ditambahkan ke koleksi!");
        } catch (error) {
            setMessage("Gagal menambahkan buku ke koleksi. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (    
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{formData.Judul}</h2>
                <div className="mb-4">
                    <p><strong>Penulis:</strong> {formData.Penulis}</p>
                    <p><strong>Penerbit:</strong> {formData.Penerbit}</p>
                    <p><strong>Tahun Terbit:</strong> {formData.TahunTerbit}</p>
                    <p><strong>Stok:</strong> {formData.Stok}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ulasan</label>
                    <textarea
                        value={formData.Ulasan}
                        onChange={handleUlasanChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        placeholder="Tulis ulasan Anda di sini"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                        value={formData.Rating}
                        onChange={handleRatingChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                    >
                        <option value={0}>Pilih Rating</option>
                        {[1, 2, 3, 4, 5].map((bintang) => (
                            <option key={bintang} value={bintang}>{bintang} Bintang</option>
                        ))}
                    </select>
                </div>
                {message && <p className="text-sm text-center mb-4 text-blue-500">{message}</p>}
                <div className="flex flex-wrap gap-2 justify-between">
                   
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        onClick={handleSubmitUlasan}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Simpan Ulasan'}
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={handlePinjamBuku}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Pinjam Buku'}
                    </button>
                    <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        onClick={handleAddKoleksi}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Tambah ke Koleksi'}
                    </button>
                </div>
            </div>
        </div>
    );
};
