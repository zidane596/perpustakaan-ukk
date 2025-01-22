const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { getAllBuku, getBukuById, createBuku, updateBuku, deleteBuku } = require('../Controllers/BukuControl.js');

const router = express.Router();

router.get('/buku', authenticateToken, getAllBuku);
router.get('/buku/:id', authenticateToken, getBukuById);
router.post('/buku/buat', authenticateToken, createBuku);
router.put('/buku/:id', authenticateToken, updateBuku);
router.delete('/buku/:id', authenticateToken, deleteBuku);

module.exports = router;