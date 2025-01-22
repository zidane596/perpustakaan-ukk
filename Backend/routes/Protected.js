const express = require('express');
const authenticateToken = require('./middleware/authMiddleware.js');
const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}!` });
});

module.exports = router;
