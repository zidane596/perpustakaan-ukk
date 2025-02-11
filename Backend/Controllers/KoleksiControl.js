const model = require('../model/init-models');
const sequelize = require('../config/databases');
const { user, buku, koleksipribadi } = model.initModels(sequelize);



const addKoleksiBuku = async (req, res) => {
    const UserID = req.user.id;
    const { id : bookid } = req.params;
    try {
        const [collection, created] = await koleksipribadi.findOrCreate({
            where: { UserID, BukuID : bookid },
            defaults: { UserID, BukuID : bookid },
        });

        if (!created) {
            return res.status(400).json({ message: 'Buku sudah ada di koleksi' });
        }

        res.status(201).json( collection );
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
    const id = req.user.id;

    try {
        const koleksi = await koleksipribadi.findAll({
            where: { UserID : id },
            include: [{ model: buku, as:"Buku", attributes: ['Judul', 'Penerbit', 'Penulis', 'TahunTerbit'] }],
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

module.exports = { addKoleksiBuku, getUserKoleksi, updateKoleksiBuku, deleteKoleksiBuku };