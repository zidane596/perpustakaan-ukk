const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { getCountBorrow, getCountBorrowbyId, getBorrow, getBorrowByUser, addBorrow, updateReturnBookByid, getHistory } = require('../Controllers/PeminjamanControl.js');

const router = express.Router();

router.get('/countborrow', authenticateToken, getCountBorrow);
router.get('/countborrowbyid', authenticateToken, getCountBorrowbyId);
router.get('/borrow', authenticateToken, getBorrow);
router.get('/borrowbyid', authenticateToken, getBorrowByUser);
router.post('/borrow/add/:id', authenticateToken, addBorrow);
router.put('/return/:id', authenticateToken, updateReturnBookByid);
router.get('/borrow/history', authenticateToken, getHistory);

module.exports = router;