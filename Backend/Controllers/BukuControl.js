const model = require('../model/init-models');
const sequelize = require('../config/databases');
const db = require('../config/databases');
const { Op, where } = require('sequelize');
const { buku, ulasanbuku, kategoribuku, kategoribuku_relasi } = model.initModels(sequelize);

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
            attributes: ["BukuID", "Judul", "Penulis", "Penerbit", "TahunTerbit"],
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
            attributes: ["BukuID", "Judul", "Penulis", "Penerbit", "TahunTerbit"],
         });
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        res.status(200).json(bukuData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBukuSearch = async (req, res) => {
    const { q, kategori } = req.query; // Mengambil parameter dari query string
    try {
        let whereConditions = {
            [Op.or]: [
                { Judul: { [Op.like]: `%${q}%` } }, // Mencari berdasarkan Judul
                { Penulis: { [Op.like]: `%${q}%` } }, // Mencari berdasarkan Penulis
                { Penerbit: { [Op.like]: `%${q}%` } }, // Mencari berdasarkan Penerbit
            ],
        };

        // Jika kategori dipilih, tambahkan filter kategori
        if (kategori) {
            whereConditions.KategoriID = kategori;
        }

        const bukuData = await buku.findAll({
            where: whereConditions,
        });

        res.status(200).json(bukuData); // Mengirim data buku yang ditemukan
    } catch (error) {
        res.status(500).json({ error: error.message }); // Menangani error
    }
};



const createBuku = async (req, res) => {
    const { Judul, Penulis, Penerbit, TahunTerbit, KategoriID } = req.body;

    try {
        const [result] = await db.query('SELECT MAX(BukuID) AS maxId FROM buku');
        const maxId = result[0]?.maxId || 0;
        const BukuID = maxId + 1;

        const newBuku = await buku.create({
            BukuID,
            Judul,
            Penulis,
            Penerbit,
            TahunTerbit,
        });

        if (Array.isArray(KategoriID) && KategoriID.length > 0) {
            const kategoriRelasi = KategoriID.map((id) => ({
                BukuID: newBuku.BukuID,
                KategoriID: id,
            }));

            await kategoribuku_relasi.bulkCreate(kategoriRelasi);
        }

        res.status(201).json({
            message: 'Buku berhasil dibuat',
            buku: newBuku,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateBuku = async (req, res) => {
    const { id } = req.params;
    const { Judul, Penulis, Penerbit, TahunTerbit, KategoriID } = req.body;

    try {
        const bukuData = await buku.findOne({ where: { BukuID: id } });
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        await bukuData.update({ Judul, Penulis, Penerbit, TahunTerbit });

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
        const bukuData = await buku.findByPk(id);
        if (!bukuData) {
            return res.status(404).json({ message: 'Buku not found' });
        }
        await bukuData.destroy();
        res.status(200).json({ message: 'Buku deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllBuku, getBukuById, getBukuSearch, createBuku, updateBuku, deleteBuku };