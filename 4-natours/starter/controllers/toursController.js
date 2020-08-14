// const fs = require('fs');
// const { isNumber } = require('util');
const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status('200').json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
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
