const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Supplier = require('../../models/Supplier');
const Product = require('../../models/Product');
const { check, validationResult } = require('express-validator');

// @route   Post api/supplier/edit/:id
// @desc    edit supplier
// @access  Private
router.post('/edit/:id', auth, async (req, res) => {
  const { contactName, companyName, email } = req.body;

  //Build Supplier Object
  const supplierFields = {};

  supplierFields.user = req.user.id;
  if (contactName) supplierFields.contactName = contactName;
  if (companyName) supplierFields.companyName = companyName;
  if (email) supplierFields.email = email;

  try {
    //Update
    const supplier = await Supplier.findOneAndUpdate(
      { _id: req.params.id },
      { $set: supplierFields },
      { new: true }
    );

    res.json(supplier);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/supplier
//  @desc Get authorized user's suppliers
// @access private
router.get('/', auth, async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      user: req.user.id
    });
    if (!suppliers) {
      return res.status(400).json({ msg: 'There are Suppliers for this user' });
    }
    res.json(suppliers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;

// @route GET api/supplier/id
//  @desc Get authorized user's supplier by id
// @access private
router.get('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(400).json({ msg: 'Supplier Not Found' });
    }
    res.json(supplier);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;

// @route GET api/supplier/id/products
//  @desc Get authorized user's supplier by id
// @access private
router.get('/:id/products', auth, async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.params.id });
    if (!products) {
      return res.status(400).json({ msg: 'No products found for this user' });
    }
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;

// @route POST api/suppliers
// @desc Create a supplier
// @access public
router.post(
  '/',
  auth,
  [
    check('contactName', 'Contact Name is Required')
      .not()
      .isEmpty(),
    check('companyName', 'Company Name is Required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { contactName, companyName, email } = req.body;
    try {
      supplier = new Supplier({
        contactName,
        companyName,
        email,
        user: req.user.id
      });
      const user = await User.findById(req.user.id);
      user.suppliers.unshift(supplier);

      await supplier.save();
      await user.save();
      res.json(supplier);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/supplier/product/:id
// @desc    Add product to supplier
// @access  Private
router.post(
  '/product/:id',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('brand', 'Brand is required')
        .not()
        .isEmpty(),
      check('unit', 'Unit is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const supplier = await Supplier.findById(req.params.id);
      if (!supplier) {
        return res.status(404).json({ msg: 'Supplier does not exists' });
      }
      if (supplier.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        unit: req.body.unit,
        user: req.user.id,
        supplier: req.params.id,
        supplierName: supplier.companyName
      });
      const user = await User.findById(req.user.id);
      user.products.unshift(product);

      supplier.products.unshift(product);
      await user.save();
      await product.save();
      await supplier.save();
      res.json(supplier.products);
      console.log('route running')
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/supplier/product/edit/:id/:product_id
// @desc    Edit product
// @access  Private
router.post('/product-edit/:id/:product_id', auth, async (req, res) => {
  const { name, brand, unit } = req.body;

  //Build Supplier Object
  const productFields = {};

  productFields.user = req.user.id;
  if (name) productFields.name = name;
  if (brand) productFields.brand = brand;
  if (unit) productFields.unit = unit;

  try {
    const supplier = await Supplier.findById(req.params.id);
    const product = await Product.findById(req.params.product_id);
    if (!supplier) {
      return res.status(404).json({ msg: 'Supplier does not exists' });
    }
    if (!product) {
      return res.status(404).json({ msg: 'Product does not exists' });
    }
    if (supplier.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    //Update
    const productToEdit = await Product.findOneAndUpdate(
      { _id: req.params.product_id },
      { $set: productFields },
      { new: true }
    );

    await productToEdit.save();
    res.json(productToEdit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/supplier/:id
// @desc    Delete a supplier
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ msg: 'Supplier not found' });
    }
    //Check user
    if (supplier.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not autorized' });
    }
    //Remove Supplier's products
    await Product.deleteMany({ supplier: req.params.id });
    let user = await User.findById(req.user.id);

    user.suppliers.remove(supplier);

    await user.save();
    await supplier.remove();
    res.json({ msg: 'supplier removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'supplier not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/supplier/product/:id/:product_id
// @desc    Delete a Product from a supplier
// @access  Private
router.delete('/product/:id/:product_id', auth, async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    //pullout product
    const product = await Product.findById(req.params.product_id);
    //Make sure product exists
    if (!product) {
      return res.status(404).json({ msg: 'Product does not exist' });
    }
    // Check user
    if (supplier.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    let user = await User.findById(req.user.id);
    user.products.remove(product);
    supplier.products.remove(product);

    await user.save();
    await supplier.save();
    await product.remove();
    res.json({ msg: 'product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
