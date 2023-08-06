const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError.js');
const factory = require('./controllerFactory');
const Product = require('../models/productModel');
const slugify = require('slugify');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else
    cb(new AppError(400, 'Not an image! Please upload only an image.'), false);
};

const uploadProductImages = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

async function resizeProductImages(req, res, next) {
  if (!req.files.coverImage || !req.files.images) return next();

  const slug = slugify(req.body.title, { lower: true });

  req.body.imageCover = `product-${slug}-cover.jpeg`;

  await sharp(req.files.coverImage[0].buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${slug}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 85 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    }),
  );

  next();
}

async function getProductsByUser(req, res, next) {
  const products = await Product.find({ seller: req.params.id });

  res.status(200).json({
    success: true,
    data: products,
  });
}

async function deleteMyProduct(req, res, next) {
  const product = await Product.findById(req.params.productId);

  if (!product) return next(new AppError(404, 'No product found with that ID'));

  if (product.seller._id.toString() !== req.user._id.toString())
    return next(new AppError(401, 'You are not authorized to delete this'));

  await Product.findByIdAndDelete(req.params.productId);

  res.status(204).json({
    success: true,
    data: null,
  });
}

module.exports = {
  getAllProducts: factory.getAll(Product),
  getProduct: factory.getOne(Product),
  createProduct: factory.createOne(Product),
  updateProduct: factory.updateOne(Product),
  deleteProduct: factory.deleteOne(Product),
  getProductsByUser: catchAsync(getProductsByUser),
  uploadProductImages: catchAsync(uploadProductImages),
  resizeProductImages: catchAsync(resizeProductImages),
  deleteMyProduct: catchAsync(deleteMyProduct),
};
