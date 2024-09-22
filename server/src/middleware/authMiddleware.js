import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import Employee from '../models/EmployeeModel.js';

// Middleware to authenticate and authorize users
const authMiddleware = asyncHandler(async(req, res, next) => {
    let token = req.cookies.jwt; // Get JWT from cookies
    console.log("1")
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    console.log(2)
    try {
        const decoded = jwt.verify(token, "123");

        req.user = await Employee.findById(decoded.userId).select('-password');

        console.log("TOKEN IS FOUND", token)
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
});

export default authMiddleware;