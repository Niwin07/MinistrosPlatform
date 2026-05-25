const express      = require('express');
const songsRouter  = express.Router();
const songCtrl     = require('../controllers/songController');
const { requireRole } = require('../middleware/auth');

songsRouter.get  ('/',    songCtrl.getSongs);
songsRouter.get  ('/:id', songCtrl.getSongById);

songsRouter.post  ('/',    requireRole('LIDER'), songCtrl.createSong);
songsRouter.put   ('/:id', requireRole('LIDER'), songCtrl.updateSong);
songsRouter.delete('/:id', requireRole('LIDER'), songCtrl.deleteSong);

module.exports = songsRouter;
