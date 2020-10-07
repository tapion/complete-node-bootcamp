const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncFunction = require('../utils/catchAsync');
const AppError = require('../utils/errorApp');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

exports.signUp = catchAsyncFunction(async (req, res) => {
  const newUser = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    changedPasswordAt: req.body.changedPassword,
    role: req.body.role,
  });

  const token = createToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsyncFunction(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('The email and password area mandatories', 400));

  const usera = await User.findOne({ email }).select('+password'); //se pone el simbolo + dado que esa columna esta como select:false en el schema

  if (!usera || !(await usera.checkPassword(password)))
    return next(new AppError('The user or password are wrong', 401));
  res.status(200).json({
    status: 'sueccess',
    data: {
      token: createToken(usera._id),
    },
  });
});

exports.protect = catchAsyncFunction(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(new AppError('You are not loggin', 401));
  const token = req.headers.authorization.split(' ')[1];
  //validate token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //validate the user exists best practices
  const actualUSer = await User.findById(decode.id);
  if (!actualUSer) {
    return next(
      new AppError('The user belongin to this token no longer exists', 401)
    );
  }
  // validate that user doesn't change password afther the token was generated
  if (actualUSer.hasChangedPassword(decode.iat)) {
    return next(
      new AppError('The user changed the password, login again', 401)
    );
  }

  req.user = actualUSer;
  next();
});

exports.restinct = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('User do not allowed', 403));
    }
    next();
  };
};
