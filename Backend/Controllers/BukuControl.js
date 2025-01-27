const model = require('../model/init-models');
const sequelize = require('../config/databases');
const { buku, ulasanbuku } = model.initModels(sequelize);

const getAllBuku = async (req, res) => {
    try {
        const bukuData = await buku.findAll();
        res.status(200).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBukuById = async (req, res) => {
    const { id } = req.params;
    try {
        const bukuData = await buku.findOne({ where: { BukuID: id } });
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        res.status(200).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBuku = async (req, res) => {
    const { BukuID, Judul, Penulis, Penerbit, TahunTerbit } = req.body;
    try {
        const bukuData = await buku.create({ BukuID, Judul, Penulis, Penerbit, TahunTerbit });
        res.status(201).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBuku = async (req, res) => {
    const { id } = req.params;
    const { Judul, Penulis, Penerbit, TahunTerbit } = req.body;
    try {
        const bukuData = await buku.findOne({ where: { BukuID: id } });
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        await bukuData.update({ Judul, Penulis, Penerbit, TahunTerbit });
        res.status(200).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBuku = async (req, res) => {
    const { id } = req.params;
    try {
        const bukuData = await buku.findOne({ where: { BukuID: id } });
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        await bukuData.destroy();
        res.status(200).json({ message: 'Buku deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllBuku, getBukuById, createBuku, updateBuku, deleteBuku };