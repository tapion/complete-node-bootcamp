const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'All tours must have a name'],
      unique: true,
      trim: true,
      maxlength: [60, 'The name must have maximum 60 characters'],
      minlength: [5, 'The name must have at least 5 characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The values must be eather: easy, medium or difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [0.1, 'The ratingAverage must be at least of 0.1'],
      max: [5, 'The ratingAverage must be maximum of 5'],
    },
    ratingQuantity: {
      default: 0,
      type: Number,
      min: [0.1, 'The ratingQuantity must be at least of 0.1'],
      max: [5, 'The ratingQuantity must be maximum of 5'],
    },
    price: {
      type: Number,
      required: [true, 'The price is mandatory'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'The discount ({VALUE}) can not be grather than price',
      },
    },
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
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: call before .crete or .save not .createMany
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// })

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.startDate = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query tooks ${Date.now() - this.startDate} miliseconds`);
  next();
});

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
