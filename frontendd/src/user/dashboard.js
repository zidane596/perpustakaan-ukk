import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {Sidebar} from '../component/Sidebar.js';


const Dashboard = () => {
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [Buku, setBuku] = useState([]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    const handleProfile = useCallback(async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/profile',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setName(response.data.Name);
            setEmail(response.data.Email);
        } catch (error) {
            console.error(error);
        }
    },[]);

    const handleBuku = useCallback(async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/buku',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setBuku(response.data);
        } catch (error) {
            console.error(error);
        }
    },[]);

    useEffect(() => {
        handleProfile();
        handleBuku();
    }, [handleProfile, handleBuku]);
    return (
        <div className='flex flex-row h-screen w-screen '>
            <Sidebar />
            <div className="flex flex-col flex-1 bg-blue-100">
                <div className="flex items-center justify-between rounded-lg m-6 p-4 bg-white shadow-md">
                    <div className="text-2xl font-semibold text-gray-800">{handleProfile}</div>
                </div>
                {/* <div className="flex-1 p-6 bg-gray-50">
                </div> */}
            </div>
        </div>
    );
};

export default Dashboard;