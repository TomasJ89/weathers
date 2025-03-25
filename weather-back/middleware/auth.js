const jwt = require("jsonwebtoken")// Import JWT for token verification


module.exports = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // If no token is provided, return an unauthorized response
    if (!token) {
        return res.status(401).json({ message: "No token provided", success: false, data: null });
    }

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // If the token is invalid or expired, return an unauthorized response
            return res.status(401).json({ message: "Invalid or expired token", success: false, data: null });
        }
        // Attach the decoded user information to the request object for further use
        req.user = user;

        // Move to the controller
        next();
    });
}