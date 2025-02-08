const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const authorizeRoles = require('../middleware/RoleMiddleware.js');
const { getAllBuku, getBukuById, createBuku, updateBuku, deleteBuku, getCountBuku, getCountStock } = require('../Controllers/BukuControl.js');

const router = express.Router();

router.get('/buku', authenticateToken, getAllBuku);
router.get('/countbuku', authenticateToken, getCountBuku);
router.get('/countstok', authenticateToken, getCountStock);
router.get('/buku/:id', authenticateToken, getBukuById);
router.post('/buku/add', authenticateToken, createBuku);
router.put('/buku/:id', authenticateToken, updateBuku);
router.delete('/buku/:id', authenticateToken, deleteBuku);

module.exports = router;

