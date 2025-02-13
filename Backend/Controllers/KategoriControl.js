const model = require('../model/init-models');
const sequelize = require('../config/databases');
const { kategoribuku_relasi, kategoribuku } = model.initModels(sequelize);

const createkategoribuku = async (req, res) => {
    const { NamaKategori } = req.body;
    if (!NamaKategori) {
        return res.status(400).json({ error: "NamaKategori tidak boleh kosong." });
    }
    try {
        const bukuData = await kategoribuku.create({ NamaKategori });
        res.status(201).json(bukuData);
    } catch (error) {
        console.error("Error createkategoribuku:", error);
        res.status(500).json({ error: error.message });
    }
};

const getBukuByKategori = async (req, res) => {
    try {
        const bukuData = await kategoribuku.findAll();
        res.status(200).json(bukuData);
    } catch (error) {
        console.error("Error getBukuByKategori:", error);
        res.status(500).json({ error: error.message });
    }
};

const getKategoriBukuRelasi = async (req, res) => {
    try {
        const respons = await kategoribuku_relasi.findAll();
        res.status(200).json(respons);
    } catch (error) {
        console.error("Error getKategoriBukuRelasi:", error);
        res.status(500).json({ error: error.message });
    }
};

const getKategoriBukuRelasiById = async (req, res) => {
    const { KategoriID } = req.body;
    if (!id) {
        return res.status(400).json({ error: "ID tidak boleh kosong." });
    }
    try {
        const respons = await kategoribuku_relasi.findAll({ where: { KategoriID } });
        res.status(200).json(respons);
    } catch (error) {
        console.error("Error getKategoriBukuRelasiById:", error);
        res.status(500).json({ error: error.message });
    }
};

const updatekategori = async (req, res) => {
    const { id } = req.params; 
    const { NamaKategori } = req.body; 

    try {
        const respons = await kategoribuku.update(
            { NamaKategori },
            { where: { KategoriID: id } }
        );

        if (respons[0] === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        res.status(200).json({ message: "Kategori berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};


const createkategoribuku_relasi = async (req, res) => {
    const { BukuID, KategoriID } = req.body;
    if (!BukuID || !KategoriID) {
        return res.status(400).json({ error: "BukuID dan KategoriID wajib diisi." });
    }
    try {
        const bukuData = await kategoribuku_relasi.create({ BukuID, KategoriID });
        res.status(201).json(bukuData);
    } catch (error) {
        console.error("Error createkategoribuku_relasi:", error);
        res.status(500).json({ error: error.message });
    }
};

const deletekategori = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "KategoriID wajib diisi." });
    }
    try {
        const bukuData = await kategoribuku.destroy({ where: { KategoriID: id } });
        if (!bukuData) {
            return res.status(404).json({ message: 'Kategori not found' });
        }
        res.status(200).json({ message: 'Kategori deleted successfully' });
    } catch (error) {
        console.error("Error deletekategori:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createkategoribuku, getBukuByKategori, createkategoribuku_relasi, updatekategori, getKategoriBukuRelasi, getKategoriBukuRelasiById, deletekategori };
