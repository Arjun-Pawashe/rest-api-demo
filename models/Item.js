const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive']
    },
    quantity: {
      type: Number,
      default: 1,
      min: [0, 'Quantity cannot be negative']
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Item', itemSchema);
