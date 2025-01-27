const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { getUlasan, getUlasanByBukuID, addUlasan } = require('../Controllers/UlasanControl.js');

const router = express.Router();

router.get('/ulasan', authenticateToken, getUlasan);
router.get('/ulasan/buku/:id', authenticateToken, getUlasanByBukuID);
router.post('/ulasan/tambah', authenticateToken, addUlasan);

module.exports = router;
