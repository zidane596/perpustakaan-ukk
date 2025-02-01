const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: `Access Denied: Your role is ${userRole}. Allowed roles: ${allowedRoles.join(', ')}.`,
            });
        }
        next();
    };
};

module.exports = authorizeRoles ;
