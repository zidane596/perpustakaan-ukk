const express = require('express');
const {Register, Login, GetMe} = require('../Controllers/AuthControl.js');
const authenticateToken = require('../middleware/AuthMiddleware.js');

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.get('/me', authenticateToken, GetMe)




module.exports = router;
