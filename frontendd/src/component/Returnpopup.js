import React from "react";

export const ReturnPopup = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4">Konfirmasi Pengembalian</h2>
                <p className="text-gray-600 mb-6">Apakah Anda yakin ingin mengembalikan item ini?</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800">
                        Batal
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-green-400 hover:bg-green-600 text-white">
                        Kembalikan
                    </button>
                </div>
            </div>
        </div>
    );
};