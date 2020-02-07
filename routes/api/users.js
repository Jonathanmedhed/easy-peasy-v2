const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Product = require('../../models/Product');

// @route POST api/users
//  @desc Create a user
// @access public
router.post(
  '/',
  [
    check('contactName', 'Contact Name is Required')
      .not()
      .isEmpty(),
    check('companyName', 'Company Name is Required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { contactName, companyName, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      user = new User({
        contactName,
        companyName,
        email,
        password
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
module.exports = router;

// @route   Post api/user/edit
// @desc    Update User
// @access  Private
router.post('/edit', auth, async (req, res) => {
  const { contactName, companyName, email } = req.body;

  //Build User Object
  const userFields = {};

  userFields.user = req.user.id;
  if (contactName) userFields.contactName = contactName;
  if (companyName) userFields.companyName = companyName;
  if (email) userFields.email = email;

  try {
    let user = await User.findById(req.user.id);

    if (user) {
      //Update
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: userFields },
        { new: true }
      );

      return res.json(user);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/users/id
//  @desc Get a user
// @access private
router.get('/me', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;

// @route GET api/users/products
//  @desc Get a user products
// @access private
router.get('/products', auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    if (!products) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'No products for this user' }] });
    }
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;

// @route Post api/users/send-email
// @desc send email
// @access private
router.post('/send-email', auth, async (req, res) => {
  /**
   * Email Account that will be used to send emails
   * Port that the transporter ill use
   */
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
      user: 'easypeasyserviceapp@gmail.com',
      pass: 'easy2016234'
    }
  });

  /**
   * App's Email
   */
  const appEmail = 'easypeasyserviceapp@gmail.com';

  try {
    const { emailToSend } = req.body;
    emailToSend.from = appEmail;
    transporter.sendMail(emailToSend, (error, info) => {
      if (error) {
        res.status(400).send({
          msg: error
        });
      } else {
        res.json({ ok: 'email sent!' }).send();
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
