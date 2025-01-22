const model = require('../model/init-models');
const sequelize = require('../config/databases');
const buku = require('../model/buku');
const { user } = model.initModels(sequelize);


const getUserProfile = async (req, res) => {
    const id = req.params.id;
    try {
        const profile = await user.findOne({where: {UserID: req.params.id}});
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateUserProfile = async (req, res) => {
    const id = req.params;
    const { Username, Password, Email, Nama_Lengkap, Alamat } = req.body;
    try {
        const profile = await user.findOne({where: {UserID: id}});
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.update({ Username, Password, Email, Nama_Lengkap, Alamat });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getBorrowHistory = async (req, res) => {
    try {
        // const profile = await user.findAll();
        // res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addKoleksiBuku = async (req, res) => {
    
    try {
        const UserID = req.user.id;
        const BukuID = req.body;

        const bukuExists = await buku.findAll(BukuID)
        if (!bukuExists) {
            return res.status(400).json({message: 'Buku tidak ditemukan'})
            
        }

        const [ collection, created] = await user.findOrCreate({
            where: {
                UserID,
                BukuID
            },
            defaults: {
                UserID,
                BukuID
            }
        });

        if (!created) {
            return res.status(400).json({ message: 'Buku sudah ada di koleksi' });
        }

        const usercollection = await user.findAll({
            where: {
                UserID
            },
            include:[{model : buku, attributes: ['id','title']}]
        });

        const CollectionList = usercollection.map(item => ({
            BukuID : item.buku.id,
            Title : item.buku.id

        }));

        res.status(201).json({
            message : "Buku berhasil ditambahkan ke koleksi",
            collection : CollectionList
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserKoleksi = async (req, res) => {
    const { id } = req.params;
    try {
        const getcollection = await id.findAll();
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteKoleksiBuku = async (req, res) => {
    const { id } = req.params;
    try {
        const respons = await id.findAll();
        if (!respons) {
            res.status()
            
        }
        const dellkoleksi = await user.findAll();
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addUlasan = async (req, res) => {
    try {
        // const profile = await user.findAll();
        // res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserUlasan = async (req, res) => {
    try {
        // const profile = await user.findAll();
        // res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// const getUserreview = async (req, res) => {
//     try {
//         const review = await user.findAll({
//             where: {
//                 RoleID: 2
//             },
//             include: [{ model: model.initModels(sequelize).ulasanbuku }]   
//         });
//         res.status(200).json(review);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

module.exports = { getUserreview, getUserProfile, updateUserProfile, getBorrowHistory, addKoleksiBuku, getUserKoleksi, deleteKoleksiBuku, addUlasan, getUserUlasan };