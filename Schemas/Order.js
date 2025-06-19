const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  sparePhone: Number,
  items: [
    {
      productId: String,   // or ObjectId if using a Product model
      name: String,
      image: String,
      quantity: Number,
      price: Number,
      selectedSize: String,
      selectedColor: String,
    }
  ],
  price: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'via upi'
  },
  paymentStatus: {
    type: String,
    default: 'Paid'
  },
  deliveryDate: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  deliveryAddress: String,
  trackingNumber:{
    type:String,
  },
  trackingSteps: {
    type: [
      {
        step: { type: String, default: 'Order Placed' },
        completed: { type: Boolean, default: true },
        date: { type: Date, default: Date.now() }
      }
    ]
  },
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
