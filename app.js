const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./4-natours/starter/routes/tourRoutes');
const userRouter = require('./4-natours/starter/routes/userRoutes');
const errorController = require('./4-natours/starter/controllers/errorController');
// const 

const app = express();
app.use(express.json()); //Middleware, para poder usar el body de la transaccion
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static('./4-natours/starter/public'));
// app.use((req,res,next) =>{
//     req.timeRequest = new Date().toISOString();
//     next();
// })

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find the resourse ${req.originalUrl} on the server`,
  //   });
  const err = new Error(
    `Can't find the resourse ${req.originalUrl} on the server`
  );
  err.statusCode = 404;
  err.status = 'fails';
  next(err);
});

app.use(errorController);
module.exports = app;
