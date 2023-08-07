const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Checkout = require('../models/checkoutModel');
const controllerFactory = require('./controllerFactory');

const createCheckout = catchAsync(async (req, res, next) => {
  const { products, totalAmount } = req.body;
  const userId = req.user._id;

  const checkout = await Checkout.create({
    user: userId,
    products,
    totalAmount,
  });

  res.status(201).json({
    success: true,
    data: {
      checkout,
    },
  });
});

async function getCheckoutsByUser(req, res, next) {
  const checkouts = await Checkout.find({ user: req.params.id }).sort({
    createdAt: 1,
  });

  res.status(200).json({
    success: true,
    data: checkouts,
  });
}

module.exports = {
  getAllCheckouts: controllerFactory.getAll(Checkout),
  getCheckout: controllerFactory.getOne(Checkout),
  deleteCheckout: controllerFactory.deleteOne(Checkout),
  createCheckout,
  getCheckoutsByUser: catchAsync(getCheckoutsByUser),
};
