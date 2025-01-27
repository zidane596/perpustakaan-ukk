const express = require('express');
const { Register, Login, GetMe } = require('../Controllers/AuthControl.js');
const authenticateToken = require('../middleware/AuthMiddleware.js');

const router = express.Router();

router.post('/auth/register', Register);
router.post('/auth/login', Login);
router.get('/auth/me', authenticateToken, GetMe);

module.exports = router;

