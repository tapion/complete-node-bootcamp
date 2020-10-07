const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeature');
const AppError = require('../utils/errorApp');
const catchAsyncFunction = require('../utils/catchAsync');

exports.topCheap = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,difficulty,summary';
  req.query.sort = '-ratingAverage,price';
  next();
};

exports.getAllTours = catchAsyncFunction(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Tour.find(), req.query)
    .filter()
    .filterFields()
    .sort()
    .limit();
  const tours = await apiFeatures.query;
  res.status('200').json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTourStats = catchAsyncFunction(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRatings: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status('200').json({
    status: 'success',
    results: stats.length,
    data: {
      stats,
    },
  });
});

exports.getBusyMonth = catchAsyncFunction(async (req, res, next) => {
  const year = req.params.year * 1;
  const months = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
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
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $project: { _id: 0 },
    },
    {
      $limit: 6,
    },
  ]);
  res.status('200').json({
    status: 'success',
    results: months.length,
    data: {
      months,
    },
  });
});

exports.getTour = catchAsyncFunction(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId, () => {
    console.log('aqui?');
    next(new AppError('Not found', 404));
  });
  res.status('200').json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsyncFunction(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'succes',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsyncFunction(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(
    req.params.tourId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
    () => {
      return next(new AppError('Not found', 404));
    }
  );
  res.status(200).json({
    status: 'succes',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsyncFunction(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.tourId, () => {
    return next(new AppError('Not found', 404));
  });
  res.status(204).json({
    status: 'succes',
    data: null,
  });
});

// exports.checkValidId = (req, res, next, val) => {
//   if (req.params.tourId * 1 >= tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Tour ID not found',
//     });
//   }
//   next();
// };

// exports.checkTourData = (req, res, next) => {
//   if (!req.body.name || !isNumber(req.body.price)) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Not enough data',
//     });
//   }
//   next();
// };
