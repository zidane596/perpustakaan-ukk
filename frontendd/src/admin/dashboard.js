import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth.js';
import { Sidebar } from '../component/Sidebar.js';
import { Header } from '../component/Header.js';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { token, isLogin, isRole, logout } = useAuth();
    const [user, setUser] = useState({});
    const [countUser, setCountUser] = useState(0);
    const [countBorrow, setCountBorrow] = useState(0);
    const [countBuku, setCountBuku] = useState(0);
    const [countStok, setCountStok] = useState(0);
    const navigate = useNavigate();


    const countuser = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/countuser', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCountUser(response.data.count || 0);
        } catch (error) {
            console.error('Error count user:', error.message);
        }
    };

    const countborrow = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/countborrow', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCountBorrow(response.data.count || 0);
        } catch (error) {
            console.error('Error count borrow:', error.message);
        }
    }, [token]);

    const countbuku = async () => {
        try {
            const respons = await axios.get('http://localhost:5000/api/countbuku', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCountBuku(respons.data.count || 0);
        } catch (error) {
            console.error('Error count buku:', error.message);
        }
    }

    const countstok = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/countstok', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCountStok(response.data.count || 0);
        } catch (error) {
            console.error('Error count stok:', error.message);
        }
    }

    const fetchUser = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error.message);
        }
    }, [token]);

    useEffect(() => {
        if (!isLogin || (isRole !== 'Admin' && isRole !== 'Petugas')) {
            navigate('/login');
            return;
        } 
        fetchUser();
        countuser();
        countborrow();
        countbuku();
        countstok();
    }, [fetchUser, countBorrow, countBuku, countStok, countUser, isLogin, isRole, navigate]);

    return (
        <div className='flex flex-row h-screen w-screen'>
            <Sidebar />
            <div className="flex flex-col flex-1 bg-gray-50">
                <Header user={user} logout={logout} />
                <div className="flex flex-col p-6 gap-4 ">
                    <div className='flex flex-row justify-between gap-4'>
                        <div className="flex flex-col items-start bg-white shadow rounded-lg p-4 w-1/4">
                            <p className="text-gray-800 font-medium">Jumlah Pengguna: </p>
                            <span className='text-2xl font-semibold'>{countUser}</span>
                        </div>
                        <div className="flex flex-col items-start bg-white shadow rounded-lg p-4 w-1/4">
                            <p className="text-gray-800 font-medium">Jumlah Peminjaman: </p>
                            <span className='text-2xl font-semibold'>{countBorrow}</span>
                        </div>
                        <div className="flex flex-col items-start bg-white shadow rounded-lg p-4 w-1/4">
                            <p className="text-gray-800 font-medium">Jumlah Buku: </p>
                            <span className='text-2xl font-semibold'>{countBuku}</span>
                        </div>
                        <div className="flex flex-col items-start bg-white shadow rounded-lg p-4 w-1/4">
                            <p className="text-gray-800 font-medium">Jumlah Total Stok Buku: </p>
                            <span className='text-2xl font-semibold'>{countStok}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
