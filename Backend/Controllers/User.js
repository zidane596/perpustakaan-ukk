const model = require('../model/init-models');
const sequelize = require('../config/databases');
const { user, buku, koleksipribadi } = model.initModels(sequelize);



const getUserProfile = async (req, res) => {
    try {
        const profile = await user.findOne({ where: { UserID: req.params.id } });
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { Username, Password, Email, Nama_Lengkap, Alamat } = req.body;
    try {
        const profile = await user.findOne({ where: { UserID: id } });
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }

        await profile.update({ Username, Password, Email, Nama_Lengkap, Alamat });
        res.status(200).json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ------------------------------------------------------------- Koleksi Buku -------------------------------------------------------------

const addKoleksiBuku = async (req, res) => {
    try {
        const UserID = req.user.id; // Ambil ID user dari session atau token
        const { BukuID } = req.body;

        // Validasi buku
        const bukuExists = await buku.findByPk(BukuID);
        if (!bukuExists) {
            return res.status(404).json({ message: 'Buku tidak ditemukan' });
        }

        // Tambahkan ke koleksi
        const [collection, created] = await koleksipribadi.findOrCreate({
            where: { UserID, BukuID },
            defaults: { UserID, BukuID },
        });

        if (!created) {
            return res.status(400).json({ message: 'Buku sudah ada di koleksi' });
        }

        res.status(201).json({ message: 'Buku berhasil ditambahkan ke koleksi', collection });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateKoleksiBuku = async (req, res) => {
    const { KoleksiID } = req.params;
    const { BukuID } = req.body;
    try {
        const koleksi = await koleksipribadi.findOne({ where: { KoleksiID } });
        if (!koleksi) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        await koleksi.update({ BukuID });
        res.status(200).json({ message: 'Collection updated successfully', koleksi });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} 

const getUserKoleksi = async (req, res) => {
    const { UserID } = req.params;

    try {
        const koleksi = await koleksipribadi.findAll({
            where: { UserID },
            include: [{ model: buku, attributes: ['id', 'title'] }],
        });

        if (!koleksi.length) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        res.status(200).json(koleksi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteKoleksiBuku = async (req, res) => {
    const { id } = req.params;

    try {
        const koleksi = await koleksipribadi.findOne({ where: { id } });
        if (!koleksi) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        await koleksi.destroy();
        res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, addKoleksiBuku, getUserKoleksi, updateKoleksiBuku, deleteKoleksiBuku };
