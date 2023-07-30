const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A product must have a title'],
      trim: true,
      unique: true,
      minlength: [3, 'A product title must have at least 3 characters'],
      maxlength: [512, 'A product title can be upto 512 characters only']
    },
    slug: String,
    price: {
      type: Number,
      required: [true, 'A product must have a price']
    },
    category: {
      type: String,
      required: [true, 'A product must have a category']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A product must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.index({ price: 1 });
productSchema.index({ slug: 1 });

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;