require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "دسترسی غیرمجاز" });

    jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "توکن نامعتبر است" });

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
