const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError.js');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add product to the cart
const addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  // Check if the product exists
  const product = await Product.findById(productId);

  if (!product) {
    return next(
      new AppError(404, 'Product You are trying to add does not exist'),
    );
  }

  // Find the user's cart or create a new cart if not exists
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Check if the product is already in the cart
  const existingCartItem = cart.items.find(
    item => item.product._id.toString() === productId,
  );

  if (existingCartItem) {
    // If the product already exists, update the quantity
    existingCartItem.quantity += quantity;
  } else {
    // If the product does not exist, add it to the cart
    cart.items.push({ product, quantity });
  }

  // Save the cart with updated item list
  await cart.save();

  res.status(200).json({ success: true, data: { cart } });
});

// Remove product from the cart
const removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user._id;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new AppError(404, 'Cart not found'));
  }

  // Remove the product from the cart
  cart.items = cart.items.filter(
    item => item.product._id.toString() !== productId,
  );

  // Save the cart with updated item list
  await cart.save();

  res.status(200).json({ success: true, data: { cart } });
});

// Get the user's cart
const getCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart)
    return res.status(200).json({ success: true, data: { cart: null } });

  res.status(200).json({ success: true, data: { cart } });
});

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
