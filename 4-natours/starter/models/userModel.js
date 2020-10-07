const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userShema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'The email is mandatory'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'The email format does not match'],
  },
  photo: String,
  name: {
    type: String,
    required: [true, 'The user must have a name'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'grou-lead'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'All user have a password'],
    trim: true,
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    trim: true,
    validat: {
      //Solo funciona en SAVE
      validator: function (val) {
        return this.password === val;
      },
      message: 'The password does not match',
    },
  },
  changedPasswordAt: Date,
});

userShema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userShema.methods.hasChangedPassword = function (JWTTimestamp) {
  if (JWTTimestamp < this.changedPasswordAt.getTime() / 1000) {
    return true;
  }
  return false;
};

userShema.methods.checkPassword = async function (possiblePass) {
  return await bcrypt.compare(possiblePass, this.password);
};

const User = mongoose.model('User', userShema);

module.exports = User;
