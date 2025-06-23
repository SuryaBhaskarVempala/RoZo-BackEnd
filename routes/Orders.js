const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Orders = require('../Schemas/Order');
const Users = require('../Schemas/User');
const Plant = require('../Schemas/Plant');
const { placeOrder, getOrders,getOrdersForUser, updateTrackingSteps } = require('../controllers/Orders');


router.post('/place-order', placeOrder);
router.get('/', getOrdersForUser);
router.get('/getOrders', getOrders);
router.post('/updateTrackingSteps',updateTrackingSteps);

module.exports = router;
