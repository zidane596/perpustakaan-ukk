const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { addBorrow, updateReturnBook, getHistory } = require('../Controllers/PeminjamanControl.js');
const authorizeRoles = require('../middleware/RoleMiddleware.js');

const router = express.Router();

router.post('/peminjaman', authenticateToken, addBorrow);
router.put('/peminjaman/add', authenticateToken, updateReturnBook);
router.get('/peminjaman/:id', authenticateToken, getHistory);

module.exports = router;