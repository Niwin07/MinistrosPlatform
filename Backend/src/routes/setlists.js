const express        = require('express');
const setlistsRouter = express.Router();
const setlistCtrl    = require('../controllers/setlistController');

setlistsRouter.get ('/:id',       setlistCtrl.getSetlistById);
setlistsRouter.put ('/:id',       setlistCtrl.updateSetlist);
setlistsRouter.post('/:id/clone', setlistCtrl.cloneSetlist);

module.exports = setlistsRouter;
