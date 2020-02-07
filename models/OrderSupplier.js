const mongoose = require('mongoose');

const OrderSupplierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'supplier'
  },
  email: {
    type: String,
    required: true
  }
});

module.exports = OrderSupplier = mongoose.model('ordersupplier', OrderSupplierSchema);