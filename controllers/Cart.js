const mongoose = require("mongoose");
const Users = require("../Schemas/User");
const logger = require("../utils/logger");

const add = async (req, res) => {
    const endpoint = "[POST /cart/add]";
    try {
        const { userId, productId, name, image, price, selectedSize, selectedColor } = req.body;

        const user = await Users.findById(userId);
        if (!user) {
            logger.warn(`${endpoint} User not found: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        const normalizedProductId = String(productId).trim();
        const normalizedSize = String(selectedSize).trim().toLowerCase();
        const normalizedColor = String(selectedColor).trim().toLowerCase();

        const existingItem = user.cart.items.find(item =>
            String(item.productId).trim() === normalizedProductId &&
            String(item.selectedSize).trim().toLowerCase() === normalizedSize &&
            String(item.selectedColor).trim().toLowerCase() === normalizedColor
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.items.push({
                productId,
                name,
                image,
                price,
                selectedSize,
                selectedColor,
                quantity: 1
            });
        }

        user.cart.totalQuantity = user.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        user.cart.totalAmount = user.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await user.save();

        logger.info(`${endpoint} Cart updated for user ${userId}`);
        res.status(200).json({ message: 'Cart updated', cart: user.cart });
    } catch (error) {
        logger.error(`${endpoint} Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const update = async (req, res) => {
    const endpoint = "[PUT /cart/update]";
    try {
        const { userId, id, selectedSize, selectedColor, quantity } = req.body;

        const user = await Users.findById(userId);
        if (!user) {
            logger.warn(`${endpoint} User not found: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        const item = user.cart.items.find(
            item =>
                item.productId.toString() === id &&
                item.selectedSize === selectedSize &&
                item.selectedColor === selectedColor
        );

        if (!item) {
            logger.warn(`${endpoint} Item not found in cart: productId=${id}`);
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;
        user.cart.items = user.cart.items.filter(i => i.quantity > 0);

        user.cart.totalQuantity = user.cart.items.reduce((acc, item) => acc + item.quantity, 0);
        user.cart.totalAmount = user.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await user.save();

        logger.info(`${endpoint} Cart item updated for user ${userId}`);
        res.status(200).json({ message: 'Cart quantity updated', cart: user.cart });
    } catch (error) {
        logger.error(`${endpoint} Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const remove = async (req, res) => {
    const endpoint = "[DELETE /cart/remove]";
    try {
        const { userId, id, selectedSize, selectedColor } = req.body;

        const user = await Users.findById(userId);
        if (!user) {
            logger.warn(`${endpoint} User not found: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart.items = user.cart.items.filter(
            item =>
                !(
                    item.productId.toString() === id &&
                    item.selectedSize === selectedSize &&
                    item.selectedColor === selectedColor
                )
        );

        user.cart.totalQuantity = user.cart.items.reduce((acc, item) => acc + item.quantity, 0);
        user.cart.totalAmount = user.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await user.save();

        logger.info(`${endpoint} Item removed from cart for user ${userId}`);
        res.status(200).json({ message: 'Item removed', cart: user.cart });
    } catch (error) {
        logger.error(`${endpoint} Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const clear = async (req, res) => {
    const endpoint = "[POST /cart/clear]";
    try {
        const { userId } = req.body;

        const user = await Users.findById(userId);
        if (!user) {
            logger.warn(`${endpoint} User not found: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart.items = [];
        user.cart.totalQuantity = 0;
        user.cart.totalAmount = 0;

        await user.save();

        logger.info(`${endpoint} Cart cleared for user ${userId}`);
        res.status(200).json({ message: 'Cart cleared', cart: user.cart });
    } catch (error) {
        logger.error(`${endpoint} Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

const findUserId = async (req, res) => {
    const endpoint = "[GET /cart/:userId]";
    try {
        const { userId } = req.params;

        const user = await Users.findById(userId);
        if (!user) {
            logger.warn(`${endpoint} User not found: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info(`${endpoint} Cart fetched for user ${userId}`);
        res.status(200).json(user.cart);
    } catch (error) {
        logger.error(`${endpoint} Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    add,
    update,
    remove,
    clear,
    findUserId
};
