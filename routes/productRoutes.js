const express = require('express');
const authController = require('../controllers/authController');
// const reviewRouter = require('../routes/reviewRoutes');
const productController = require('../controllers/productController');

const productsRouter = express.Router();

// router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkID);
productsRouter.route('/tour-stats').get(productController.getTourStats);
productsRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    productController.getMonthlyPlan
  );

productsRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(productController.getToursWithin);

productsRouter.route('/distances/:latlng/unit/:unit').get(productController.getDistances);

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