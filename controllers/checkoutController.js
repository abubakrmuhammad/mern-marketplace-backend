const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Checkout = require('../models/checkoutModel');
const controllerFactory = require('./controllerFactory');



const createCheckout = catchAsync(async (req, res, next) => {
  const { products, totalAmount } = req.body;
  const userId = req.user._id;

  // Create the fake checkout
  const checkout = await Checkout.create({
    user: userId,
    products,
    totalAmount,
  });

  res.status(201).json({
    status: 'success',
    data: {
      checkout,
    },
  });
});

module.exports = {
  getAllCheckouts: controllerFactory.getAll(Checkout),
  getCheckout: controllerFactory.getOne(Checkout),
  deleteCheckout: controllerFactory.deleteOne(Checkout),
  createCheckout,
};
