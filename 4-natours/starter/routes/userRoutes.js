const express = require('express');
const userController = require('../controllers/usersController');

const route = express.Router();

route.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

route.route('/:userId')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = route;