const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'supplier'
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  qty: {
    type: String,
    required: false,
    default: '0'
  },
  supplierName: {
    type: String,
    required: true
  }
});

module.exports = Product = mongoose.model('product', ProductSchema);
