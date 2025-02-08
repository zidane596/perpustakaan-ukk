const model = require('../model/init-models');
const sequelize = require('../config/databases');
const db = require('../config/databases');
const { Op } = require('sequelize');
const { buku, kategoribuku, kategoribuku_relasi } = model.initModels(sequelize);


const getCountBuku = async (req, res) => {
    try {
        const count = await buku.count();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getCountStock = async (req, res) => {
    try {
        const count = await buku.sum('Stok');
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllBuku = async (req, res) => {
    try {
        const bukuData = await buku.findAll({
            include: [
                {
                    model: kategoribuku_relasi,
                    as: "kategoribuku_relasis", 
                    attributes: ["KategoriID"],
                    include: [
                        {
                            model: kategoribuku,
                            as: "Kategori",
                            attributes: ["NamaKategori"],
                        },
                    ],
                },
            ],
            attributes: ["BukuID", "Judul", "Penulis", "Penerbit", "TahunTerbit", "Stok"],
            logging: console.log, // Tambahkan untuk debug
        });        
        res.status(200).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBukuById = async (req, res) => {
    const { id } = req.params;
    try {
        const bukuData = await buku.findOne({ 
            where : {BukuID : id}, 
            include: [
                {
                    model: kategoribuku_relasi,
                    as: "kategoribuku_relasis", 
                    attributes: ["KategoriID"],
                    include: [
                        {
                            model: kategoribuku,
                            as: "Kategori",
                            attributes: ["NamaKategori"],
                        },
                    ],
                },
            ],
            attributes: ["BukuID", "Judul", "Penulis", "Penerbit", "TahunTerbit", "Stok", "Image"],
         });
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        res.status(200).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createBuku = async (req, res) => {
    const { Judul, Penulis, Penerbit, TahunTerbit, Stok, KategoriID } = req.body;
    try {
        // 1. Buat buku baru
        const newBuku = await buku.create({
            Judul,
            Penulis,
            Penerbit,
            TahunTerbit,
            Stok,
        });

        // 2. Jika KategoriID disertakan, tambahkan relasi kategori
        if (Array.isArray(KategoriID) && KategoriID.length > 0) {
            // Validasi KategoriID
            const kategoriExists = await kategoribuku.findAll({
                where: { KategoriID: KategoriID },
                attributes: ['KategoriID'],
            });
            const existingKategoriIDs = kategoriExists.map((kategori) => kategori.KategoriID);

            if (existingKategoriIDs.length !== KategoriID.length) {
                return res.status(400).json({ message: 'One or more KategoriID do not exist' });
            }

            // Tambahkan relasi ke tabel kategoribuku_relasi
            const kategoriRelasi = KategoriID.map((kategori) => ({
                BukuID: newBuku.BukuID,
                KategoriID: kategori,
            }));
            await kategoribuku_relasi.bulkCreate(kategoriRelasi);
        }

        // 3. Kirim respon sukses
        res.status(201).json({
            message: 'Buku berhasil dibuat',
            buku: newBuku,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const updateBuku = async (req, res) => {
    const { id } = req.params;
    const { Judul, Penulis, Penerbit, TahunTerbit, Stok, Image, KategoriID } = req.body;

    try {
        const bukuData = await buku.findOne({ where: { BukuID: id } });
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        await bukuData.update({ Judul, Penulis, Penerbit, TahunTerbit, Stok, Image });

        if (Array.isArray(KategoriID) && KategoriID.length > 0) {
            // Validasi KategoriID
            const existingCategories = await kategoribuku.findAll({
                where: { KategoriID: KategoriID },
                attributes: ['KategoriID'],
            });
            if (existingCategories.length !== KategoriID.length) {
                return res.status(400).json({ message: 'One or more KategoriID do not exist.' });
            }

            // Hapus relasi lama
            await kategoribuku_relasi.destroy({ where: { BukuID: id } });

            // Tambahkan relasi baru
            const kategoriRelasi = KategoriID.map((kategori) => ({
                BukuID: id,
                KategoriID: kategori,
            }));
            await kategoribuku_relasi.bulkCreate(kategoriRelasi);
        }

        const hasilbuku = await buku.findOne({
            where: { BukuID: id },
            include: [
                {
                    model: kategoribuku_relasi,
                    as: "kategoribuku_relasis",
                    attributes: ["KategoriID"],
                    include: [
                        {
                            model: kategoribuku,
                            as: "Kategori",
                            attributes: ["NamaKategori"],
                        },
                    ],
                },
            ],
        });

        res.status(200).json(hasilbuku);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBuku = async (req, res) => {
    const { id } = req.params;
    try {
        const bukuData = await buku.findOne({
            where: { BukuID: id },
            include: [{
                model: kategoribuku_relasi,
                as: "kategoribuku_relasis",
                attributes: ["KategoriID"],
            }]
        });
        
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        
        if (bukuData.kategoribuku_relasis.length > 0) {
            await kategoribuku_relasi.destroy({ where: { BukuID: id } });
        }
        
        await bukuData.destroy();
        res.status(200).json({ message: 'Buku deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getCountStock, getCountBuku, getAllBuku, getBukuById, createBuku, updateBuku, deleteBuku };