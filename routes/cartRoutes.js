const express = require('express');
const authController = require('../controllers/authController');
const cartController = require('../controllers/cartController');

const cartRouter = express.Router();

cartRouter.use(authController.protect);

cartRouter
  .route('/')
  .get(cartController.getCart)
  .post(cartController.addToCart)
  .delete(cartController.removeFromCart);

cartRouter.route('/clear').delete(cartController.clearCart);

module.exports = cartRouter;
