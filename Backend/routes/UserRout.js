const express = require('express');
const authenticateToken = require('../middleware/AuthMiddleware.js');
const { getUserProfile, updateUserProfile } = require('../Controllers/User.js');

const router = express.Router();

router.get('/user', authenticateToken, getUserProfile);
router.put('/user/:id', authenticateToken, updateUserProfile);

module.exports = router;

