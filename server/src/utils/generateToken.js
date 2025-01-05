import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    // const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    //     expiresIn: '30d', // Set expiry as a string (30 days)
    // });

    // res.cookie('jwt', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'None',
    // });

    // return token;
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

};

const generateEmpToken = (res, userId) => {
    // const empToken = jwt.sign({ userId }, process.env.EMPLOYEE_JWT_SECRET, {
    //     expiresIn: '30d', // Match cookie maxAge
    // });
    // // console.log("----- ", userId)

    // res.cookie('empToken', empToken, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //     sameSite: 'None',// 30 days
    // });

    // return empToken;

    return jwt.sign({ userId }, process.env.EMPLOYEE_JWT_SECRET, { expiresIn: '30d' });
};

export { generateToken, generateEmpToken };
