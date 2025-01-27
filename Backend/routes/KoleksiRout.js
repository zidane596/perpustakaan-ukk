const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { addKoleksiBuku, getUserKoleksi, updateKoleksiBuku, deleteKoleksiBuku } = require('../Controllers/KoleksiControl.js');

const router = express.Router();

router.get('/koleksi', authenticateToken, getUserKoleksi);
router.post('/koleksi/add', authenticateToken, addKoleksiBuku);
router.put('/koleksi/:id', authenticateToken, updateKoleksiBuku);
router.delete('/koleksi/:id', authenticateToken, deleteKoleksiBuku);

module.exports = router;
