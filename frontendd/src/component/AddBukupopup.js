import React, { useState } from "react";

export const AddBukuPopup = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        Judul: "",
        Penulis: "",
        Penerbit: "",
        TahunTerbit: "",
        Stok: "",
        KategoriID: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "KategoriID" ? value.split(",") : value, // Array untuk KategoriID
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Panggil fungsi onSave dari props
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Tambah Buku Baru</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Judul</label>
                        <input
                            type="text"
                            name="Judul"
                            value={formData.Judul}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Penulis</label>
                        <input
                            type="text"
                            name="Penulis"
                            value={formData.Penulis}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Penerbit</label>
                        <input
                            type="text"
                            name="Penerbit"
                            value={formData.Penerbit}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Tahun Terbit</label>
                        <input
                            type="number"
                            name="TahunTerbit"
                            value={formData.TahunTerbit}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Stok</label>
                        <input
                            type="number"
                            name="Stok"
                            value={formData.Stok}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Kategori ID (pisahkan dengan koma)</label>
                        <input
                            type="text"
                            name="KategoriID"
                            value={formData.KategoriID}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Batal
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};