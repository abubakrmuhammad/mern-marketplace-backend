const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

checkoutSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products.productId',
    select: 'title imageCover',
  });

  next();
});

checkoutSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  });

  next();
});

checkoutSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products.productId.seller',
    select: 'name email',
  });

  next();
});

checkoutSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products.productId.category',
    select: 'name',
  });

  next();
});

checkoutSchema.pre('save', function (next) {
  this.totalAmount = this.products.reduce((acc, cur) => {
    return acc + cur.price * cur.quantity;
  }, 0);

  next();
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
