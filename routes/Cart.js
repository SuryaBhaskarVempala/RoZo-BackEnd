const express = require('express');
const router = express.Router();
const User = require('../Schemas/User'); // Adjust path if needed
const { default: mongoose, mongo } = require('mongoose');
const { add, update, remove, clear, findUserId } = require('../controllers/Cart');

// Add item to cart
router.post('/add', add);

// Update quantity
router.post('/update', update);

// Remove item
router.delete('/remove', remove);

// Clear cart
router.delete('/clear', clear);

// Get cart by userId
router.get('/:userId', findUserId);

module.exports = router;
