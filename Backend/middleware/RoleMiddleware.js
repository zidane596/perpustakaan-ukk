const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role; // role diambil dari payload JWT yang di-decode
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: `Access denied. Your role is ${userRole} but required roles are ${allowedRoles.join(', ')}.` });
        }
        next(); // Lanjutkan ke controller jika peran sesuai
    };
};

module.exports = authorizeRoles;

