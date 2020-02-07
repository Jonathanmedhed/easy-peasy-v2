const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  contactName: {
    type: String
  },
  companyName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  emailToSend: {
    type: String,
    default: 'empty',
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      }
    }
  ]
});

module.exports = Supplier = mongoose.model('supplier', SupplierSchema);
