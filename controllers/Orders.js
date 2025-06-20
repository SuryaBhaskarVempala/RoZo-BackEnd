// 📁 routes/Orders.js
const { default: mongoose } = require("mongoose");
const Plant = require("../Schemas/Plant");
const Orders = require("../Schemas/Order");
const Users = require("../Schemas/User");
const logger = require("../utils/logger");
const { acquireLock, releaseLock } = require("../utils/lock");

// ✅ Place Order after Razorpay Payment Success
const placeOrder = async (req, res) => {
  const endpoint = "[POST /orders/place-order]";
  try {
    const {
      name,
      phone,
      sparePhone,
      items,
      price,
      user,
      deliveryAddress,
      paymentMethod,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId
    } = req.body;

    logger.info(`${endpoint} Incoming order from user: ${user}`);

    if (!mongoose.Types.ObjectId.isValid(user)) {
      logger.warn(`${endpoint} Invalid user ID: ${user}`);
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    for (const item of items) {
      const { productId, selectedSize, selectedColor, quantity } = item;

      const sizeFieldMap = {
        small: 'potColors.$.smallPotsCount',
        medium: 'potColors.$.mediumPotsCount',
        large: 'potColors.$.largePotsCount'
      };

      const sizeField = sizeFieldMap[selectedSize];
      if (!sizeField) {
        logger.warn(`${endpoint} Invalid size "${selectedSize}" for product ${productId}`);
        return res.status(400).json({ success: false, message: `Invalid size "${selectedSize}"` });
      }

      await acquireLock(productId);
      try {
        const updateResult = await Plant.findOneAndUpdate(
          {
            id: productId,
            potColors: {
              $elemMatch: {
                name: selectedColor,
                [selectedSize + 'PotsCount']: { $gte: quantity }
              }
            }
          },
          {
            $inc: {
              [sizeField]: -quantity
            }
          },
          { new: true }
        );

        if (!updateResult) {
          releaseLock(productId);
          logger.warn(`${endpoint} Insufficient stock for ${productId}`);
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${productId} (Color: ${selectedColor}, Size: ${selectedSize})`
          });
        }

        logger.info(`${endpoint} Stock updated for plant ${productId}`);
      } finally {
        releaseLock(productId);
      }
    }

    const newOrder = new Orders({
      name,
      phone,
      sparePhone,
      items,
      price,
      user: new mongoose.Types.ObjectId(user),
      deliveryAddress,
      paymentMethod,
      paymentStatus,
      trackingNumber: user + Date.now(),
      trackingSteps: [
        { step: 'Order Placed', completed: true, date: new Date() },
        { step: 'Shipped', completed: false, date: null },
        { step: 'Delivered', completed: false, date: null }
      ],
      razorpayOrderId,
      razorpayPaymentId
    });

    await newOrder.save();

    await Users.findByIdAndUpdate(
      user,
      { $push: { orders: newOrder._id } },
      { new: true }
    );

    const userData = await Users.findById(user);

    logger.info(`${endpoint} Order placed successfully for user ${user}`);
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully and inventory updated',
      order: newOrder,
      userData
    });

  } catch (error) {
    logger.error(`${endpoint} Error placing order: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while placing order'
    });
  }
};

// ✅ Get Multiple Orders by ID
const getOrders = async (req, res) => {
  const endpoint = "[GET /orders]";
  try {
    const ids = req.query.ids?.split(',') || [];
    logger.info(`${endpoint} Fetching orders: ${ids.join(', ')}`);

    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    const orders = await Orders.find({ _id: { $in: objectIds } });

    logger.info(`${endpoint} Fetched ${orders.length} orders`);
    res.json(orders);
  } catch (error) {
    logger.error(`${endpoint} Error fetching orders: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};

module.exports = {
  placeOrder,
  getOrders
};
