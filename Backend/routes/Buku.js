const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const authorizeRoles = require('../middleware/RoleMiddleware.js');
const { getAllBuku, getBukuById, getBukuSearch, createBuku, updateBuku, deleteBuku } = require('../Controllers/BukuControl.js');

const router = express.Router();

router.get('/buku', authenticateToken, getAllBuku);
router.get('/buku/:id', authenticateToken, getBukuById);
router.get('/buku/search?search=:search', authenticateToken, getBukuSearch);
router.post('/buku/add', authenticateToken, createBuku);
router.put('/buku/:id', authenticateToken, updateBuku);
router.delete('/buku/:id', authenticateToken, deleteBuku);

module.exports = router;

