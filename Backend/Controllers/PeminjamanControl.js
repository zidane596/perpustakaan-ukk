const model = require('../model/init-models');
const sequelize = require('../config/databases');
const db = require('../config/databases');
const { peminjaman, user, buku } = model.initModels(sequelize);

const getCountBorrow = async (req, res) => {
  try {
    const count = await peminjaman.count({});
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
  const { id } = req.params;
  try {
    const respons = await peminjaman.findAll({
      where: {
        UserID: id,
        StatusPeminjaman: 'Pinjam'
      },
      include: [
        { model: user, as: 'User', attributes: ['Username'] },
        { model: buku, as: 'Buku', attributes: ['Judul'] },
      ],
    });
    res.status(200).json(respons);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const addBorrow = async (req, res) => {
  const { UserID, BukuID, TanggalPeminjaman, TanggalPengembalian, StatusPeminjaman } = req.body;

  try {
    const respons = await peminjaman.create({
      UserID,
      BukuID,
      TanggalPeminjaman,
      TanggalPengembalian,
      StatusPeminjaman,
    });

    res.status(201).json(respons);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateReturnBookByid = async (req, res) => {
  const { id } = req.params;
  const { PeminjamanID, TanggalPengembalian, StatusPeminjaman } = req.body;

  try {
    const respons = await peminjaman.findOne({
      where: {
        UserID: id,
        PeminjamanID,
        StatusPeminjaman: 'Pinjam'
      },
    });

    if (!respons) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }

    const today = new Date()
    await respons.update({
      TanggalPengembalian: today,
      StatusPeminjaman: 'Selesai',
    });

    res.status(200).json({ message: 'Peminjaman berhasil dikembalikan', respons });
  }
  catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

const getHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const respons = await peminjaman.findAll({
      where: { UserID: userId },
      include: [
        { model: user, attributes: ['UserID', 'name'] },
        { model: buku, attributes: ['BukuID', 'title'] },
      ],
    });

    if (respons.length === 0) {
      return res.status(404).json({ message: 'No respons found' });
    }

    res.status(200).json({ message: 'Loan history retrieved', respons });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getCountBorrow, getBorrow, getBorrowByUser, addBorrow, updateReturnBookByid, getHistory };
