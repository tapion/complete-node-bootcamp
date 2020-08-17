// const fs = require('fs');
// const { isNumber } = require('util');
const Tour = require('../models/tourModel');
// const { query } = require('express');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.topCheap = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'name,price,difficulty,summary';
  req.query.sort = '-ratingAverage,price';
  next();
};


exports.getAllTours = async (req, res) => {
  try {
    // const queryObj = { ...req.query };
    // const keysRemove = ['page', 'sort', 'limit', 'fields'];
    // keysRemove.forEach((el) => delete queryObj[el]);
    // let querySting = JSON.stringify(queryObj);
    // querySting = querySting.replace(
    //   /\b(gt|gte|lt|lte)\b/g,
    //   (word) => `$${word}`
    // );
    // console.log(queryObj, req.query, JSON.parse(querySting));
    // let query = Tour.find(JSON.parse(querySting));
    // if (req.query.sort) {
    //   query = query.sort(req.query.sort.split(',').join(' '));
    // } else {
    //   query = query.sort('-createAt');
    // }

    // if (req.query.fields) {
    //   query = query.select(req.query.fields.split(',').join(' '));
    // } else {
    //   query = query.select('-__v');
    // }

    // const limit = req.query.limit * 1 || 100;
    // const page = req.query.page * 1 || 1;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const maxTours = await Tour.countDocuments();
    //   if (skip >= maxTours) throw new Error('You exceed the number of tours');
    // }
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(req.query.duration)
    //   .where('difficulty')
    //   .equals(req.query.difficulty);
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
  } catch (err) {
    console.log(err);
    res.status('404').json({
      status: 'fail',
      message: err,
    });
  }
  //   res.status('200').json({
  //     status: 'success',
  // results: tours.length,
  // resHeader: req.timeRequest,
  // resNow: new Date().toISOString(),
  // data: {
  //   tours,
  // },
  //   });
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId);
    res.status('200').json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status('404').json({
      status: 'fail',
      message: err,
    });
  }
  //   const tour = tours.find((el) => el.id === req.params.tourId * 1);
  //   res.status('200').json({
  //     status: 'success',
  //     data: {
  //       tour,
  //     },
  //   });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'succes',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'succes',
      message: err,
    });
  }

  //   const newTour = {
  //     id: tours[tours.length - 1].id + 1,
  //     ...req.body,
  //   };
  //   tours.push(newTour);
  //   fs.writeFile(
  //     `${__dirname}/4-natours/starter/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {
  //       res.status(201).json({
  //         status: 'success',
  //         data: {
  //           tour: newTour,
  //         },
  //       });
  //     }
  //   );
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.tourId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'succes',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'succes',
      message: err,
    });
  }
  //         res.status('200').json({
  //     status: 'success',
  //     data: {
  //       message: '<Updated tour....>',
  //     },
  //   });
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.tourId);
    res.status(204).json({
      status: 'succes',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'succes',
      message: err,
    });
  }
  //   res.status('204').json({
  //     status: 'success',
  //     data: null,
  //   });
};

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
