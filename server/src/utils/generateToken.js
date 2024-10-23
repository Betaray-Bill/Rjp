import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30*1000 days    
    });

    return token

};

const generateEmpToken = (res, userId) => {
    const empToken = jwt.sign({ userId }, process.env.EMPLOYEE_JWT_SECRET, {
        expiresIn: '30d',
    });
    res.cookie('empToken', empToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30*1000 days    
    });

    return empToken
}

export { generateToken, generateEmpToken };