const jwt = require("jsonwebtoken")


module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided", success: false, data: null });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Invalid or expired token", success: false, data: null });
        }
        req.body.user = user;
        next();
    });
}