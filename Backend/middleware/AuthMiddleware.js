const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. Token missing or invalid format.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Decode dan verifikasi token
        const decoded = jwt.verify(token, process.env.SECRETKEY);
        
        // Simpan data decoded di req.user
        req.user = decoded; 
        
        next(); // Lanjutkan ke middleware berikutnya
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token has expired' });
        }
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
