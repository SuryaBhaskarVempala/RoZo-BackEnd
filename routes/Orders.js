const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Orders = require('../Schemas/Order');
const Users = require('../Schemas/User');
const Plant = require('../Schemas/Plant');
const { placeOrder, getOrders } = require('../controllers/Orders');


router.post('/place-order', placeOrder);


router.get('/', getOrders);


module.exports = router;
