// 📁 utils/lock.js

const Plant = require('../Schemas/Plant');
const plantLocks = new Map();

const acquireLock = (plantId) => {
  return new Promise(resolve => {
    const tryLock = () => {
      if (!plantLocks.has(plantId)) {
        plantLocks.set(plantId, true);
        resolve();
      } else {
        setTimeout(tryLock, 10);
      }
    };
    tryLock();
  });
};

const releaseLock = (plantId) => {
  plantLocks.delete(plantId);
};

// ✅ Validate if product has sufficient stock BEFORE Razorpay order is created
const validatePreStock = async (productId, selectedSize, selectedColor, quantity) => {
  const sizeKeyMap = {
    small: 'smallPotsCount',
    medium: 'mediumPotsCount',
    large: 'largePotsCount',
  };

  const stockField = sizeKeyMap[selectedSize];
  if (!stockField) {
    return { success: false, message: `Invalid size: ${selectedSize}` };
  }

  const plant = await Plant.findOne({
    id: productId,
    potColors: {
      $elemMatch: {
        name: selectedColor,
        [stockField]: { $gte: quantity },
      },
    },
  });

  if (!plant) {
    return {
      success: false,
      message: `Not enough stock for Product ${productId}, Size: ${selectedSize}, Color: ${selectedColor}`,
    };
  }

  return { success: true };
};

module.exports = { acquireLock, releaseLock, plantLocks,validatePreStock};
