const express      = require('express');
const usersRouter  = express.Router();
const userCtrl     = require('../controllers/userController');

usersRouter.get('/me',    userCtrl.getMe);
usersRouter.put('/me',    userCtrl.updateMe);
usersRouter.get('/',      userCtrl.getUsers);
usersRouter.get('/:id',   userCtrl.getUserById);

module.exports = usersRouter;
