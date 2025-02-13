const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { createkategoribuku, getBukuByKategori, createkategoribuku_relasi, getKategoriBukuRelasi, getKategoriBukuRelasiById, deletekategori, updatekategori } = require('../Controllers/KategoriControl.js');

const router = express.Router();

router.post('/kategoribuku', authenticateToken, createkategoribuku);
router.post('/kategoribuku_relasi', authenticateToken, createkategoribuku_relasi);
router.get('/kategoribuku', authenticateToken, getBukuByKategori);
router.get('/kategoribuku_relasi', authenticateToken, getKategoriBukuRelasi);
router.get('/kategoribuku_relasi/:id', authenticateToken, getKategoriBukuRelasiById);
router.put('/kategoribuku/:id', authenticateToken, updatekategori);
router.delete('/deletekategori/:id', authenticateToken, deletekategori);

module.exports = router;

