const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const models = require('../model/init-models.js');
const sequelize = require('../config/databases.js');
const { user, role } = models.initModels(sequelize);
dotenv.config();

// Register
const Register = async (req, res) => {
    console.log('Headers:', req.headers); // Debug headers
    console.log('Request Body:', req.body); // Debug body

    const { Username, Password, Email, Nama_Lengkap, Alamat } = req.body;

    // Validasi input
    if (!Username || !Password) {
        return res.status(400).json({ message: 'Username and Password are required' });
    }

    try {
        // Cek apakah username sudah ada di database
        const existingUser = await user.findOne({
            where: { Username },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newUser = await user.create({
            Username,
            Password: hashedPassword,
            Email,
            Nama_Lengkap,
            Alamat,
            RoleID: 1,
        });

        const { Password: _, ...userWithoutPassword } = newUser.toJSON();
        res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Login
const Login = async (req, res) => {
    console.log(req.body);
    const { Username, Password } = req.body;

    // Validasi input
    if (!Username || !Password) {
        return res.status(400).json({ message: 'Username and Password are required' });
    }

    try {
        const User = await user.findOne({ where: { Username } });

        // Jika user tidak ditemukan
        if (!User) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Cek password
        const isMatch = await bcrypt.compare(Password, User.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: User.UserID, role: User.RoleID }, process.env.SECRETKEY, {
            expiresIn: process.env.EXPTOKEN,
        });

        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error.message); // Log error untuk deteksi masalah
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
// GetMe
const GetMe = async (req, res) => {
    try {
        const Token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(Token, process.env.SECRETKEY);
        const User = await user.findOne({
            where: { UserID: decoded.id },
            include: [{ model: role, as : 'Role' }],
        });

        if (!User) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(User);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Export
module.exports = {
    Register,
    Login,
    GetMe,
};
