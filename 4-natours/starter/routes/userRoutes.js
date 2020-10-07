const express = require('express');
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const route = express.Router();

route.post('/signUp', authController.signUp);
route.post('/login', authController.login);

route
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

route
  .route('/:userId')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = route;
