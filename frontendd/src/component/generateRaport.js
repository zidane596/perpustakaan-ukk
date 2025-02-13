import React, { useState } from "react";

export const GenerateLaporanPopup = ({ onGenerate, onClose }) => {
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");

  const bulanOptions = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const tahunOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bulan || !tahun) {
      alert("Pilih bulan dan tahun terlebih dahulu!");
      return;
    }

    // Pastikan bulan dalam format dua digit
    const formattedBulan = String(parseInt(bulan)).padStart(2, "0");

    onGenerate(tahun, formattedBulan);
    onClose(); // Tutup modal setelah laporan di-generate
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Generate Laporan</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Pilih Bulan</label>
            <select
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Pilih Bulan --</option>
              {bulanOptions.map((b, index) => (
                <option key={index} value={index + 1}>{b}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Pilih Tahun</label>
            <select
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Pilih Tahun --</option>
              {tahunOptions.map((t, index) => (
                <option key={index} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate Laporan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
