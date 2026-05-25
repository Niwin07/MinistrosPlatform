const express      = require('express');
const authRouter   = express.Router();
const authCtrl     = require('../controllers/authController');

authRouter.post('/register', authCtrl.register);
authRouter.post('/login',    authCtrl.login);

module.exports = authRouter;
