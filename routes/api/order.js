const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Supplier = require("../../models/Supplier");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const OrderSupplier = require("../../models/OrderSupplier");
const OrderProduct = require("../../models/OrderProduct");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route   Post api/orders/:id/sent
// @desc    change status to 'sent'
// @access  Private
router.post("/sent/:id", auth, async (req, res) => {
  const filter = { _id: req.params.id };
  const update = { sent: true };

  try {
    let order = await Order.findById(req.params.id);

    if (order) {
      //Update
      order = await Order.findOneAndUpdate(filter, update, { new: true });
      res.json(order);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/orders/:id
// @desc    unfavorite order
// @access  Private
router.post("/nofav/:id", auth, async (req, res) => {
  //Build Order Object
  const orderFields = {};

  orderFields.user = req.user.id;
  orderFields.fav = "no";

  try {
    let order = await Order.findById(req.params.id);

    if (order) {
      //Update
      order = await Order.findOneAndUpdate(
        { _id: req.params.id },
        { $set: orderFields },
        { new: true }
      );

      res.json(order);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   Post api/orders/:id/fav
// @desc    favorite order
// @access  Private
router.post("/fav/:id", auth, async (req, res) => {
  const { fav } = req.body;

  const filter = { _id: req.params.id };
  const update = { fav: fav };

  try {
    let order = await Order.findById(req.params.id);

    if (order) {
      //Update
      order = await Order.findOneAndUpdate(filter, update, { new: true });
      res.json(order);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/order
// @desc Get user's orders
// @access private
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    if (!orders) {
      return res.status(400).json({ msg: "There are no orders for this user" });
    }
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;

// @route GET api/order/id
// @desc Get order by id
// @access private
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const orderSuppliers = await OrderSupplier.find({ order: order._id });
    const orderProducts = await OrderProduct.find({ order: order._id });

    const suppliers = await Supplier.find({ _id: order.suppliers });
    const products = await Product.find({ _id: order.products });

    // Empty suppliers products and asign email to send
    suppliers.forEach((supplier) => {
      orderSuppliers.forEach((os) => {
        if (os.supplier.toString() === supplier._id.toString()) {
          supplier.emailToSend = os.email;
        }
      });
      supplier.products = [];
    });

    // Refill suppliers products with the ones that are in the order
    products.forEach((product) => {
      suppliers.forEach((supplier) => {
        if (product.supplier.toString() === supplier._id.toString()) {
          supplier.products.unshift(product);
        }
      });
    });

    // Set qty for each product
    products.forEach((product) => {
      orderProducts.forEach((op) => {
        if (op.product.toString() === product._id.toString()) {
          product.qty = op.qty;
        }
      });
    });

    if (!order) {
      return res.status(400).json({ msg: "Order not found" });
    }
    res.json({ suppliers, products, order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;

// @route Post api/order
// @desc Post an order
// @access private
router.post("/", auth, async (req, res) => {
  try {
    order = new Order({
      user: req.user.id,
    });

    const user = await User.findById(req.user.id);
    user.orders.unshift(order);

    await order.save();
    await user.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;

// @route   POST api/order/product/:id
// @desc    Add product to order
// @access  Private
router.post("/product/:id/:product_id", auth, async (req, res) => {
  const { qty, email } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    const product = await Product.findById(req.params.product_id);

    const supplier = await Supplier.findById(product.supplier);

    if (!order) {
      return res.status(404).json({ msg: "Order does not exists" });
    }
    //Make sure product exists
    if (!product) {
      return res.status(404).json({ msg: "Product does not exist" });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    order.products.forEach((prod) => {
      if (prod._id.toString() === product.id.toString()) {
        return res.status(401).json({ msg: "Product already in order" });
      }
    });
    orderProduct = new OrderProduct({
      user: req.user.id,
      product: product,
      order: order,
      qty: qty,
    });
    order.products.unshift(product);
    await orderProduct.save();
    let supplierFound = false;
    order.suppliers.forEach((sup) => {
      if (sup._id.toString() === supplier.id.toString()) {
        console.log("Supplier already in order");
        supplierFound = true;
      }
    });
    if (supplierFound === false) {
      orderSupplier = new OrderSupplier({
        user: req.user.id,
        supplier: supplier,
        order: order,
        email: "empty",
      });
      order.suppliers.unshift(supplier);
      await orderSupplier.save();
    }
    await order.save();
    res.json(order.products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/order/product/:id
// @desc    Remove product from order
// @access  Private
router.delete("/product/:id/:product_id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const product = await Product.findById(req.params.product_id);
    if (!order) {
      return res.status(404).json({ msg: "Order does not exists" });
    }
    //Make sure product exists
    if (!product) {
      return res.status(404).json({ msg: "Product does not exist" });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    order.products.forEach(async (prod) => {
      if (prod._id.toString() === product.id.toString()) {
        order.products.remove(product);
        await order.save();
        res.json("product removed");
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/order/supplier/:id
// @desc    Add supplier to order
// @access  Private
router.post("/supplier/:id/:supplier_id", auth, async (req, res) => {
  const { email } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    const supplier = await Supplier.findById(req.params.supplier_id);
    if (!order) {
      return res.status(404).json({ msg: "Order does not exists" });
    }
    //Make sure product exists
    if (!supplier) {
      return res.status(404).json({ msg: "Supplier does not exist" });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    order.suppliers.forEach((sup) => {
      if (sup._id.toString() === supplier.id.toString()) {
        return res.status(401).json({ msg: "Supplier already in order" });
      }
    });
    orderSupplier = new OrderSupplier({
      user: req.user.id,
      supplier: supplier,
      order: order,
      email: email,
    });
    order.suppliers.unshift(supplier);
    await order.save();
    await orderSupplier.save();
    res.json(order.suppliers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/order/supplier/:id
// @desc    Remove supplier from order
// @access  Private
router.delete("/supplier/:id/:supplier_id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const supplier = await Supplier.findById(req.params.supplier_id);
    if (!order) {
      return res.status(404).json({ msg: "Order does not exists" });
    }
    //Make sure product exists
    if (!supplier) {
      return res.status(404).json({ msg: "Supplier does not exist" });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    order.suppliers.forEach(async (sup) => {
      if (sup._id.toString() === supplier.id.toString()) {
        order.supplier.remove(supplier);
        await order.save();
        res.json("supplier removed");
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/order/:id
// @desc    Delete an order
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "order not found" });
    }
    //Check user
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not autorized" });
    }

    await order.remove();
    res.json({ msg: "order removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "supplier not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   Post api/order/:id/:supplier_id
// @desc    Update order email
// @access  Private
router.post("/:id/:supplier_id", auth, async (req, res) => {
  const { emailToSend } = req.body;

  try {
    const orderSupplier = await OrderSupplier.find({
      supplier: req.params.supplier_id,
      order: req.params.id,
    });

    if (orderSupplier) {
      console.log(orderSupplier[0]);
      const order = await OrderSupplier.findById(orderSupplier[0]._id);
      console.log("order found");
      console.log(order);
      order.email = emailToSend;
      await order.save();
      res.json(emailToSend);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
