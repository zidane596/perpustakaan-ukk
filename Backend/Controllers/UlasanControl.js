const model = require('../model/init-models');
const sequelize = require('../config/databases');
const { where } = require('sequelize');
const { user, buku, ulasanbuku } = model.initModels(sequelize);

const getUlasan = async (req, res) => {
    try {
        const ulasan = await ulasanbuku.findAll();
        res.status(200).json(ulasan);
    } catch (error) {
        console.error("Error saat menjalankan fungsi getUlasan:", error);
        res.status(500).json({ error: error.message });
    }
}

const getUlasanByBukuID = async (req, res) => {
    const { BukuID } = req.body;
    if (!BukuID) {
        return res.status(400).json({ error: "BukuID wajib diisi." });
    }
    try {
        const Ulasan = await ulasanbuku.findOne({ where: { BukuID } });
        if (!Ulasan) {
            return res.status(404).json({ message: 'Ulasan not found' });
        }
        res.status(200).json(Ulasan);
    } catch (error) {
        console.error("Error saat menjalankan fungsi getUlasanByBukuID:", error);
        res.status(500).json({ error: error.message });
    }
}

const addUlasan = async (req, res) => {
    const { UserID, BukuID, Ulasan, Rating } = req.body;

    if (!UserID || !BukuID || !Ulasan || typeof Rating !== 'number') {
        return res.status(400).json({ error: "Semua field wajib diisi dan rating harus berupa angka." });
    }

    if (Rating < 1 || Rating > 10) {
        return res.status(400).json({ error: "Rating harus berada di antara 1 hingga 10." });
    }

    try {
        const userData = await user.findByPk(UserID);
        if (!userData) {
            return res.status(404).json({ error: "User tidak ditemukan." });
        }

        const bukuData = await buku.findByPk(BukuID);
        if (!bukuData) {
            return res.status(404).json({ error: "Buku tidak ditemukan." });
        }

        const ulasan = await ulasanbuku.create({ UserID, BukuID, Ulasan, Rating });
        res.status(201).json({ message: "Ulasan berhasil ditambahkan.", data: ulasan });
    } catch (error) {
        console.error("Error saat menjalankan fungsi addUlasan:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getUlasan, getUlasanByBukuID, addUlasan};