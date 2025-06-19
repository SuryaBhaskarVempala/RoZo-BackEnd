const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  potSize: String,
  plantHeight: String,
  description: String,
  price:  { type: Number, default: 50 },
}, { _id: false });

const potColorSchema = new mongoose.Schema({
  name: String,
  smallPotsCount: { type: Number, default: 0 },
  mediumPotsCount:  { type: Number, default: 0 },
  largePotsCount:  { type: Number, default: 0 },
  price:  { type: Number, default: 10 },
}, { _id: false });


const plantSchema = new mongoose.Schema({
  id: { type: Number , unique: true }, // Custom ID from your array
  name: { type: String},
  shortDescription: { type: String},
  fullDescription: { type: String},
  image: [{ type: String}],
  basePrice: { type: Number},
  sizeInfo: {
    small: sizeSchema,
    medium: sizeSchema,
    large: sizeSchema,
  },
  characteristics: [{ type: String }],
  potColors: [potColorSchema],
}, {
  timestamps: true,
});

const Plant =  mongoose.model('Plant', plantSchema);

module.exports = Plant;
