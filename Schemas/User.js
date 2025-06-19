const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Cart Item Schema
const CartItemSchema = new mongoose.Schema({
  productId: {
    type: String, 
  },
  name: { type: String },
  image: { type: String },
  price: { type: Number},
  selectedSize: { type: String},
  selectedColor: { type: String},
  quantity: { type: Number, default:1 },
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  phone:{
    type:Number,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  cart: {
    items: [CartItemSchema],
    totalQuantity: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profileImage:{
    type:String,
    default:"https://tse1.mm.bing.net/th?id=OIP.ESmiXt2_DXYFdD5oglPdJQAAAA&pid=Api&P=0&h=180"
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const Users = mongoose.model('User', userSchema);

module.exports = Users;
