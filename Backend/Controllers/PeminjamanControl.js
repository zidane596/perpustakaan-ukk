const model = require('../model/init-models');
const sequelize = require('../config/databases');
const db = require('../config/databases');
const { peminjaman, user, buku } = model.initModels(sequelize);

const getBorrow = async (req, res) => {
    try {
      const respons = await peminjaman.findAll({});
      res.status(200).json({ respons });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Membuat peminjaman
const addBorrow = async (req, res) => {
  const { UserID, BukuID, TanggalPeminjaman, TanggalPengembalian, StatusPeminjaman } = req.body;

  if (!UserID || !BukuID || !TanggalPeminjaman || !TanggalPengembalian || !StatusPeminjaman) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const loan = await peminjaman.create({
      UserID,
      BukuID,
      TanggalPeminjaman,
      TanggalPengembalian,
      StatusPeminjaman,
    });

    res.status(201).json({ message: 'Loan created successfully', loan });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mengembalikan buku
const updateReturnBook = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await peminjaman.findByPk(loanId);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    loan.StatusPeminjaman = 'returned';
    await loan.save();

    res.status(200).json({ message: 'Book returned successfully', loan });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Melihat riwayat peminjaman berdasarkan UserID
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

module.exports = { getBorrow, addBorrow, updateReturnBook, getHistory };
