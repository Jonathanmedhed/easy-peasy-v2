const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  qty: {
    type: String,
    required: true
  }
});

module.exports = OrderProduct = mongoose.model('orderproduct', OrderProductSchema);