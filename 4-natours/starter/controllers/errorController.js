const AppError = require('../utils/errorApp');

const sendProd = (err, res) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('Error!!!!!', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went to wrong',
    });
  }
};

const handlerJWTerror = () => new AppError('Invalid token', 401);

const sendDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'JsonWebTokenError') error = handlerJWTerror();
    sendProd(error, res);
  }
};
