const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order'
    }
  ],
  suppliers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supplier'
    }
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    }
  ]
});

module.exports = User = mongoose.model('user', UserSchema);
