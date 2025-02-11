const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const {  getUserProfile, updateUserProfile, getCountUser, addUser, getAllUser, deleteUser } = require('../Controllers/User.js');

const router = express.Router();

router.get('/countuser', authenticateToken, getCountUser);
router.get('/alluser', authenticateToken, getAllUser);
router.get('/user', authenticateToken, getUserProfile);
router.post('/adduser', authenticateToken, addUser);
router.put('/user/:id', authenticateToken, updateUserProfile);
router.delete('/user/:id', authenticateToken, deleteUser);

module.exports = router;

