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

const handlerDBCastId = (error) => {
  console.log('ingreso aqui');
  return new AppError(`Invalid ${error.path} value: ${error.value}`, 400);
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
    console.log(err.name);
    console.log(err);
    sendDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    console.log('aqui entro????');
    console.log(error);
    console.log('aqui entro????', err);
    if (err.name === 'CastError') error = handlerDBCastId(error);
    if (err.name === 'JsonWebTokenError') error = handlerJWTerror();
    sendProd(error, res);
  }
};
