const model = require('../model/init-models');
const sequelize = require('../config/databases');
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
    const userid = req.user.id;
    const { id : bookid} = req.params;
    const { Ulasan, Rating } = req.body;

    try {
        const ulasan = await ulasanbuku.create({ 
            UserID : userid,
            BukuID : bookid,
            Ulasan,
            Rating
        });
        res.status(201).json(ulasan);
    } catch (error) {
        console.error("Error saat menjalankan fungsi addUlasan:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getUlasan, getUlasanByBukuID, addUlasan};