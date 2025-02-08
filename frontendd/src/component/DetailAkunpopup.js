import React, { useEffect, useState } from "react";

export const DetailAkunPopup = ({ onClose, user }) => {
    const [formData, setFormData] = useState({
        UserID: "",
        Username: "",
        Email: "",
        Nama_Lengkap: "",
        Alamat: "",
        RoleID: "",
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail User</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="UserID">
                            User ID
                        </label>
                        <input
                            type="text"
                            id="UserID"
                            name="UserID"
                            value={formData.UserID}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Username">
                            Nama
                        </label>
                        <input
                            type="text"
                            id="Username"
                            name="Username"
                            value={formData.Username}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="Email"
                            name="Email"
                            value={formData.Email}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Nama_Lengkap">
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            id="Nama_Lengkap"
                            name="Nama_Lengkap"
                            value={formData.Nama_Lengkap}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="Alamat">
                            Alamat
                        </label>
                        <input
                            type="text"
                            id="Alamat"
                            name="Alamat"
                            value={formData.Alamat}
                            readOnly
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="RoleID">
                            Role
                        </label>
                        <select
                            id="RoleID"
                            name="RoleID"
                            value={formData.RoleID}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100"
                        >
                            <option value="">Pilih Role</option>
                            <option value="1">Admin</option>
                            <option value="2">Petugas</option>
                            <option value="3">User</option>
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

