const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  },
  fav: {
    type: String,
    default: 'no'
  },
  sent: {
    type: Boolean,
    default: false
  },
  emails: [
    {
      type: String,
      required: true
    }
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    }
  ],
  suppliers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supplier'
    }
  ]
});

module.exports = Supplier = mongoose.model('order', OrderSchema);
