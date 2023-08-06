const express = require('express');
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

const categoryRouter = express.Router();

// Protect all routes after this middleware
categoryRouter.use(authController.protect);

categoryRouter
  .route('/')
  .get(categoryController.getAllCategories)
  .post(authController.restrictTo('admin'), categoryController.createCategory);

categoryRouter
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(authController.restrictTo('admin'), categoryController.updateCategory)
  .delete(
    authController.restrictTo('admin'),
    categoryController.deleteCategory,
  );

module.exports = categoryRouter;
