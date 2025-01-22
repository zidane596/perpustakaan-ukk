const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { createkategoribuku, createkategoribuku_relasi } = require('../Controllers/KategoriControl.js');

const router = express.Router();

router.post('/kategoribuku', authenticateToken, createkategoribuku);
router.post('/kategoribuku_relasi', authenticateToken, createkategoribuku_relasi);


module.exports = router;