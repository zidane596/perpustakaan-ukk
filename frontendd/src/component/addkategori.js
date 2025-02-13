import React, { useState } from 'react';

export const AddKategoriPopup = ({ onClose, onAdd }) => {
  const [kategori, setKategori] = useState({
    NamaKategori: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(kategori);
    onClose();
  };

  const handleChange = (e) => {
    setKategori({ ...kategori, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Tambah Kategori</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nama Kategori</label>
            <input
              type="text"
              name="NamaKategori"
              value={kategori.NamaKategori}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              Tambah Kategori
            </button>
            <button
              type="button"
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-700"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
