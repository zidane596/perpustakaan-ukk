import React, { useEffect, useState } from "react";

export const DetailBukuPopup = ({ onClose, buku }) => {
    const [formData, setFormData] = useState({
        BukuID: "",
        Judul: "",
        Penulis: "",
        Penerbit: "",
        TahunTerbit: "",
        Stok: "",
        KategoriID: "",
    });

    useEffect(() => {
        if (buku) {
            setFormData(buku);
        }
    }, [buku]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Buku</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="BukuID">
                            Buku ID
                        </label>
                        <input
                            type="text"
                            id="BukuID"
                            name="BukuID"
                            value={formData.BukuID}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Judul">
                            Judul
                        </label>
                        <input
                            type="text"
                            id="Judul"
                            name="Judul"
                            value={formData.Judul}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Penulis">
                            Penulis
                        </label>
                        <input
                            type="text"
                            id="Penulis"
                            name="Penulis"
                            value={formData.Penulis}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Penerbit">
                            Penerbit
                        </label>
                        <input
                            type="text"
                            id="Penerbit"
                            name="Penerbit"
                            value={formData.Penerbit}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="TahunTerbit">
                            Tahun Terbit
                        </label>
                        <input
                            type="text"
                            id="TahunTerbit"
                            name="TahunTerbit"
                            value={formData.TahunTerbit}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Stok">
                            Stok
                        </label>
                        <input
                            type="text"
                            id="Stok"
                            name="Stok"
                            value={formData.Stok}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="KategoriID">
                            Kategori
                        </label>
                        <select
                            id="KategoriID"
                            name="KategoriID"
                            value={formData.KategoriID}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        >
                            <option value="">Pilih Kategori</option>
                            {/* Tambahkan opsi kategori di sini */}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            Tutup
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
