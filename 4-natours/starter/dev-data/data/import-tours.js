const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({ path: 'config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Conections succesfully');
  });

const file = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const loadTours = async () => {
  try {
    await Tour.deleteMany();
    file.forEach(async (tour) => {
      // console.log(tour);
      await Tour.create(tour);
    });
    console.log('creo los tures');
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') {
  loadTours();
}
if (process.argv[2] === '--delete') {
  (async () => await Tour.deleteMany())();
}
console.log(process.argv);
// loadTours();
// console.log(file);
