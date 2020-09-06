const express = require('express');
const toursController = require('../controllers/toursController');

const router = express.Router();

// router.param('tourId', toursController.checkValidId);

router
  .route('/top-5-cheap')
  .get(toursController.topCheap, toursController.getAllTours);

router.route('/tour-stats').get(toursController.getTourStats);
router.route('/busy-month/:year').get(toursController.getBusyMonth);

router
  .route('/')
  .get(toursController.getAllTours)
  .post(toursController.createTour);
// .post(toursController.checkTourData, toursController.createTour);
router
  .route('/:tourId')
  .get(toursController.getTour)
  .patch(toursController.updateTour)
  .delete(toursController.deleteTour);

module.exports = router;
