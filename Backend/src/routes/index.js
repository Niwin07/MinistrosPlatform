const express     = require('express');
const indexRouter = express.Router();
const { authenticate } = require('../middleware/auth');

indexRouter.use('/auth',     require('./auth'));
indexRouter.use('/songs',    authenticate, require('./songs'));
indexRouter.use('/users',    authenticate, require('./users'));
indexRouter.use('/setlists', authenticate, require('./setlists'));

module.exports = indexRouter;
