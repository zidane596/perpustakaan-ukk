const model = require('../model/init-models');
const sequelize = require('../config/databases');
const db = require('../config/databases');
const { where } = require('sequelize');
const { peminjaman, user, buku } = model.initModels(sequelize);

const getCountBorrow = async (req, res) => {
  try {
    const count = await peminjaman.count({});
    res.status(200).json({count});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
const getCountBorrowbyId = async (req, res) => {
  const id = req.user.id;
  try {
    const count = await peminjaman.count({where : {UserID: id}});
    res.status(200).json({count});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const getBorrow = async (req, res) => {
  try {
    const borrowRecords = await peminjaman.findAll({
      include: [
        { model: user, as: 'User', attributes: ['Username'] },
        { model: buku, as: 'Buku', attributes: ['Judul'] },
      ],
      order: [['StatusPeminjaman', 'DESC']],
    });
    res.status(200).json(borrowRecords);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const getBorrowByUser = async (req, res) => {
  const id = req.user.id;
  try {
    const respons = await peminjaman.findAll({
      where: {
        UserID: id,
        StatusPeminjaman: 'Pinjam'
      },
      include: [
        { model: user, as: 'User', attributes: ['Username'] },
        { model: buku, as: 'Buku', attributes: ['Judul', "Penulis"] },
      ],
    });
    res.status(200).json(respons);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const addBorrow = async (req, res) => {
  const userid = req.user.id
  const { id : bookid } = req.params
  try {
    const respons = await peminjaman.create({
      UserID : userid,
      BukuID : bookid,
      TanggalPeminjaman : new Date(),
      TanggalPengembalian : null,
      StatusPeminjaman : "Pinjam",
    });

    res.status(201).json(respons);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateReturnBookByid = async (req, res) => {
  const {id : bookid} = req.params;
  const id = req.user.id;

  try {
    const respons = await peminjaman.findOne({
      where: {
        BukuID: bookid,
        UserID : id,
        StatusPeminjaman: 'Pinjam'
      },
    });

    if (!respons) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }

    await respons.update({
      TanggalPengembalian: new Date(),
      StatusPeminjaman: 'Selesai',
    });

    res.status(200).json({ message: 'Peminjaman berhasil dikembalikan', respons });
  }
  catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const getHistory = async (req, res) => {
  const id = req.user.id;

  try {
    const respons = await peminjaman.findAll({
      where: { UserID: id, StatusPeminjaman : "Selesai" },
      include: [
        { model: user, as: 'User', attributes: [ 'Username'] },
        { model: buku, as: 'Buku', attributes: [ 'Judul', 'Penulis', 'Penerbit', 'TahunTerbit'] },
      ],
    });

    if (respons.length === 0) {
      return res.status(404).json({ message: 'No respons found' });
    }

    res.status(200).json(respons);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getCountBorrow, getCountBorrowbyId, getBorrow, getBorrowByUser, addBorrow, updateReturnBookByid, getHistory };
