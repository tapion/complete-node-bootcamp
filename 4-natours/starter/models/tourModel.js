const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'All tours must have a name'],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration es mandatory'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Assign the maximun group size'],
  },
  difficulty: {
    type: String,
    trim: true,
    required: [true, 'Assign a difficulty'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    default: 0,
    type: Number,
  },
  price: {
    type: Number,
    required: [true, 'The price is mandatory'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Assign a summary for the tour'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Assign a cover image'],
  },
  images: [String],
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
