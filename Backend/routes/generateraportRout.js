const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { generateLaporan } = require('../Controllers/generateraport.js');

const router = express.Router();

router.get('/laporan-peminjaman/:tahun/:bulan', authenticateToken, generateLaporan);

module.exports = router;

