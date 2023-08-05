const express = require('express');
const authController = require('../controllers/authController');
// const reviewRouter = require('../routes/reviewRoutes');
const productController = require('../controllers/productController');

const productsRouter = express.Router();

productsRouter
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct,
  );

productsRouter
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct,
  );

module.exports = productsRouter;
