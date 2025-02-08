const model = require('../model/init-models');
const sequelize = require('../config/databases');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { user, role } = model.initModels(sequelize);


const getCountUser = async (req, res) => {
    try {
        const count = await user.count({
            where: {
                RoleID: {
                    [Op.notIn]: ['1']
                }
            }
        });

        res.status(200).json({count});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAllUser = async (req, res) => {
    try {
        const users = await user.findAll({
            where: {
                RoleID: {
                    [Op.notIn]: ['1']
                }
            },
            include: [
                {
                    model: role,
                    as: "Role",
                    attributes: [ "RoleName"]
                }
            ],
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const profile = await user.findOne({ where: { UserID: userId } });
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
    const { Username, Email, Nama_Lengkap, Alamat, Password, RoleID } = req.body;
    try {
        const profile = await user.findOne({ where: { UserID: id } });
        if (!profile) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateuser = { Username, Email, Nama_Lengkap, Alamat, RoleID };
        if (Password) {
            const hashPassword = await bcrypt.hash(Password, 10);
            updateuser.Password = hashPassword;
        }
        await profile.update(updateuser);
        res.status(200).json({ updateuser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const respons = await user.findOne({ where: { UserID: id } });
        if (!respons) {
            return res.status(404).json({ message: 'User not found' });
        }
        await respons.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { getCountUser, getAllUser, getUserProfile, updateUserProfile, deleteUser };
