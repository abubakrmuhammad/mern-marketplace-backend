const express = require('express');
const authController = require('../controllers/authController');
const checkoutController = require('../controllers/checkoutController');

const checkoutRouter = express.Router();

checkoutRouter.use(authController.protect);

checkoutRouter
  .route('/')
  .get(authController.restrictTo('admin'), checkoutController.getAllCheckouts)
  .post(checkoutController.createCheckout);

checkoutRouter
  .route('/:id')
  .get(checkoutController.getCheckout)
  .delete(checkoutController.deleteCheckout);

module.exports = checkoutRouter;
