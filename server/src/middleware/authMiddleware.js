import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import Employee from '../models/EmployeeModel.js';
import { Trainer } from '../models/TrainerModel.js';

// Middleware to authenticate and authorize users
const authMiddleware = asyncHandler(async(req, res, next) => {
    // let token = req.cookies.jwt; // Get JWT from cookies
    // // console.log("1")
    // // console.log(token)
    // if (!token) {
    //     // Write a sign out function over here
    //     return res.status(401).json({ message: 'Access denied. No token provided.' });
    // }


    // // console.log(2)
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //     req.user = await Employee.findById(decoded.userId).select('-password');

    //     // console.log("TOKEN IS FOUND", token)
    //     next();
    // } catch (error) {
    //     res.status(400).json({ message: 'Invalid token' });
    // }
    console.log(req.headers.authorization)
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    console.log("Trainer tokne ", token)
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await Trainer.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

// Middleware to authenticate and authorize users
const authEmployeeMiddleware = asyncHandler(async(req, res, next) => {
    // console.log("EMP" , req.cookies)
    // let token = req.cookies.empToken; // Get JWT from cookies
    // console.log("1")
    // console.log("EMp token ", token)
    // if (!token) {
    //     // Write a sign out function over here
    //     return res.status(401).json({ message: 'Access denied. No token provided.' });
    // }


    // // console.log(2)
    // try {
    //     const decoded = jwt.verify(token, process.env.EMPLOYEE_JWT_SECRET);

    //     req.user = await Employee.findById(decoded.userId).select('-password');

    //     // console.log("TOKEN IS FOUND", token)
    //     next();
    // } catch (error) {
    //     res.status(400).json({ message: 'Invalid token' });
    // }
    console.log(req.headers)
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    console.log("Bearer token Emp ", token)
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.EMPLOYEE_JWT_SECRET);
        req.user = await Employee.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

export { authMiddleware, authEmployeeMiddleware };