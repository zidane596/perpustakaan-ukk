const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { addBorrow, updateReturnBookByid, getHistory, getCountBorrow, getBorrow, getBorrowByUser } = require('../Controllers/PeminjamanControl.js');
const authorizeRoles = require('../middleware/RoleMiddleware.js');

const router = express.Router();

router.get('/countborrow', authenticateToken, getCountBorrow);
router.get('/borrow', authenticateToken, getBorrow);
router.get('/borrow/:id', authenticateToken, getBorrowByUser);
router.post('/borrow/add', authenticateToken, addBorrow);
router.put('/borrow/:id', authenticateToken, updateReturnBookByid);
router.get('/borrow/:id', authenticateToken, getHistory);

module.exports = router;