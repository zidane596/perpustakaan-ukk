import React, { useState } from "react";

export const EditKategori = ({ isOpen, onClose, onSave, kategori }) => {
    const [namaKategori, setNamaKategori] = useState(kategori?.NamaKategori || "");

    if (!isOpen) return null;

    const handlesubmit = () => {
        onSave(namaKategori);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Edit Kategori</h2>
                <input 
                    type="text" 
                    value={namaKategori} 
                    onChange={(e) => setNamaKategori(e.target.value)} 
                    className="w-full p-2 border rounded-lg mb-4" 
                    placeholder="Nama Kategori" 
                />
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800">
                        Batal
                    </button>
                    <button onClick={handlesubmit} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white">
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};
