import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar } from '../component/Sidebar';
import { useAuth } from '../context/auth';
import { User } from '../lib/navigation';

const AkunUser = () => {
    const { token, isLogin, logout, isRole } = useAuth();
    const [user, setUser] = useState({
        UserID: '',
        Username: '',
        Nama_Lengkap: '',
        Email: '',
        Telepon: '',
        Password: '',
        PasswordVerifikasi: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser({ ...response.data, password: '', passwordVerifikasi: '' });
        } catch (error) {
            setError('Error fetching user: ' + error.message);
        }
    }, [token]);

    const handleUpdate = async (id) => {
        setError('');
        setSuccess('');

        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        if (user.password && user.password !== user.passwordVerifikasi) {
            setError('Password dan verifikasi password tidak cocok.');
            return;
        }

        try {
            const updatedUser = { ...user };
            if (!updatedUser.Password) {
                delete updatedUser.Password;
                delete updatedUser.PasswordVerifikasi;
            }

            const response = await axios.put(`http://localhost:5000/api/user/${id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSuccess('Profil berhasil diperbarui!');
            setIsEditing(false);
            fetchUser();
        } catch (error) {
            setError('Error updating profile: ' + error.message);
        }
    };

    useEffect(() => {
        if (!isLogin || isRole !== "User") {
            return navigate('/login');
        }
        fetchUser();
    }, [isLogin, isRole, navigate, fetchUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    return (
        <div className='flex flex-row w-screen h-screen overflow-hidden'>
            <Sidebar />
            <div className='flex flex-1 flex-col h-screen max-w-screen bg-gray-50 overflow-auto'>
                <div className="m-6 bg-white p-6 shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Profil Akun</h2>

                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {success && <div className="text-green-500 mb-4">{success}</div>}

                    <form onSubmit={(e) => handleUpdate(user.UserID, e)}>
                        <div className="mb-4">
                            <label className="block text-gray-700">User ID</label>
                            <input
                                type="text"
                                name="id"
                                value={user.UserID}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={user.Username}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2 border rounded-lg ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'}`}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Nama Lengkap</label>
                            <input
                                type="text"
                                name="nama"
                                value={user.Nama_Lengkap}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2 border rounded-lg ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'}`}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={user.Email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full px-4 py-2 border rounded-lg ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-100'}`}
                            />
                        </div>

                        
                        {isEditing && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={user.Password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Verifikasi Password</label>
                                    <input
                                        type="password"
                                        name="passwordVerifikasi"
                                        value={user.PasswordVerifikasi}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex justify-between">
                            {isEditing ? (
                                <>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            fetchUser();
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                    >
                                        Batal
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                >
                                    Edit Profil
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AkunUser;

