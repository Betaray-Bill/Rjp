import jwt from 'jsonwebtoken';

// Middleware to authenticate and authorize users
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Get JWT from cookies

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Populate req.user with decoded token data
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;