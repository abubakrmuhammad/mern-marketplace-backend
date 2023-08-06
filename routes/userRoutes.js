const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const checkoutController = require('../controllers/checkoutController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.route('/me').get(userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
// .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  // .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/:id/products')
  .get(authController.protect, productController.getProductsByUser);

router
  .route('/:id/checkouts')
  .get(authController.protect, checkoutController.getCheckoutsByUser);

module.exports = router;
