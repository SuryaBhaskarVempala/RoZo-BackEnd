const router = require('express').Router();
const Users = require('../Schemas/User');
const { checkAuth, generateToken } = require('../Auth/Auth');
const { mongoose } = require('mongoose');
const { signup, login, profile, updateName } = require('../controllers/User');

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Profile route (protected)
router.get('/profile', checkAuth, profile);

router.post('/update-name/',updateName);


module.exports = router;
