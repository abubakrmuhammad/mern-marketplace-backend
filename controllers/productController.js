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

async function getTourStats(req, res, next) {
  const stats = await Product.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);

  res.status(200).json({ success: true, data: { stats } });
}

async function getMonthlyPlan(req, res, next) {
  const year = parseInt(req.params.year, 10);

  const plan = await Product.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({ success: true, data: { plan } });
}

async function getToursWithin(req, res, next) {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng)
    return next(
      new AppError(
        400,
        'Please provide latitude and longitude in the format lat,lng',
      ),
    );

  const tours = await Product.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    results: tours.length,
    data: {
      data: tours,
    },
  });
}

async function getDistances(req, res, next) {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng)
    return next(
      new AppError(
        400,
        'Please provide latitude and longitude in the format lat,lng',
      ),
    );

  const distances = await Product.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      data: distances,
    },
  });
}

module.exports = {
  getAllProducts: factory.getAll(Product),
  getProduct: factory.getOne(Product),
  createProduct: factory.createOne(Product),
  updateProduct: factory.updateOne(Product),
  deleteProduct: factory.deleteOne(Product),
  getProductStats: catchAsync(getTourStats),
  getMonthlyPlan: catchAsync(getMonthlyPlan),
  getToursWithin: catchAsync(getToursWithin),
  getDistances: catchAsync(getDistances),
  uploadProductImages,
  resizeProductImages: catchAsync(resizeProductImages),
};
