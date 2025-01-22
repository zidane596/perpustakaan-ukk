const model = require('../model/init-models');
const sequelize = require('../config/databases');
const { kategoribuku_relasi, kategoribuku } = model.initModels(sequelize);


const createkategoribuku = async (req, res) => {
    const { Namakategori } = req.body;
    try {
        const bukuData = await kategoribuku.create({ Namakategori });
        res.status(201).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getBukuByKategori = async (req, res) => {
    const { id } = req.params;
    try {
        const bukuData = await kategoribuku_relasi.findAll({ where: { KategoriID: id } });
        res.status(200).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createkategoribuku_relasi = async (req, res) => {
    const { BukuID, KategoriID } = req.body;
    try {
        const bukuData = await kategoribuku_relasi.create({ BukuID, KategoriID });
        res.status(201).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { createkategoribuku, getBukuByKategori, createkategoribuku_relasi };