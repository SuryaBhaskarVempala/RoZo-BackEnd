const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 


function checkAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; 
    console.log("Token: ", token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: 'Forbidden' });
        }
        console.log("Decoded Token: ", decoded);
        req.user = decoded; 
        next(); // Proceed to the next middleware or route handler
    });
}

function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role 
    };

    token =  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION }); 
    if(token){
        console.log("Token generated successfully");
        return token; 
    }

    return null;
}

module.exports = {
    checkAuth,
    generateToken
}