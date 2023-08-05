const express = require('express');
const authController = require('../controllers/authController');
// const reviewRouter = require('../routes/reviewRoutes');
const productController = require('../controllers/productController');

const productsRouter = express.Router();

productsRouter
  .route('/')
  .get(productController.getAllProducts)
  .post(
    // authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    productController.createProduct
  );

// productsRouter
//   .route('/:id')
//   .get(productController.getTour)
//   .patch(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     productController.uploadTourImages,
//     productController.resizeTourImages,
//     productController.updateTour
//   )
//   .delete(
//     authController.protect,
//     authController.restrictTo('admin', 'lead-guide'),
//     productController.deleteTour
//   );

module.exports = productsRouter;