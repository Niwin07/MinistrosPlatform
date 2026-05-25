/**
 * src/controllers/songController.js
 *
 * CRUD del catalogo de canciones.
 */

const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

function songToDto(row) {
  return {
    id:         row.id,
    title:      row.title,
    artist:     row.artist,
    defaultKey: row.default_key,
    duration:   row.duration,
    bpm:        row.bpm,
    structure:  typeof row.structure === 'string'
                  ? JSON.parse(row.structure)
                  : row.structure ?? null,
  };
}

async function getSongs(req, res, next) {
  const { search, key } = req.query;

  try {
    let sql    = 'SELECT id, title, artist, default_key, duration, bpm, structure FROM songs';
    const params = [];
    const where  = [];

    if (search) {
      where.push('(title LIKE ? OR artist LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (key) {
      where.push('default_key = ?');
      params.push(key);
    }

    if (where.length > 0) {
      sql += ' WHERE ' + where.join(' AND ');
    }

    sql += ' ORDER BY title ASC';

    const [rows] = await pool.execute(sql, params);

    return res.json({
      songs: rows.map(songToDto),
      total: rows.length,
    });

  } catch (err) {
    return next(err);
  }
}

async function getSongById(req, res, next) {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute(
      'SELECT id, title, artist, default_key, duration, bpm, structure FROM songs WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cancion no encontrada' });
    }

    return res.json(songToDto(rows[0]));

  } catch (err) {
    return next(err);
  }
}

async function createSong(req, res, next) {
  const {
    title,
    artist,
    defaultKey  = null,
    duration    = null,
    bpm         = null,
    structure   = null,
  } = req.body;

  if (!title || !artist) {
    return res.status(400).json({ error: 'title y artist son obligatorios' });
  }

  try {
    const id = uuidv4();

    await pool.execute(
      `INSERT INTO songs (id, title, artist, default_key, duration, bpm, structure)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        title,
        artist,
        defaultKey,
        duration,
        bpm,
        structure ? JSON.stringify(structure) : null,
      ]
    );

    return res.status(201).json({
      id, title, artist,
      defaultKey, duration, bpm, structure,
    });

  } catch (err) {
    return next(err);
  }
}

async function updateSong(req, res, next) {
  const { id } = req.params;
  const { title, artist, defaultKey, duration, bpm, structure } = req.body;

  const fields = [];
  const values = [];

  if (title      !== undefined) { fields.push('title = ?');       values.push(title); }
  if (artist     !== undefined) { fields.push('artist = ?');      values.push(artist); }
  if (defaultKey !== undefined) { fields.push('default_key = ?'); values.push(defaultKey); }
  if (duration   !== undefined) { fields.push('duration = ?');    values.push(duration); }
  if (bpm        !== undefined) { fields.push('bpm = ?');         values.push(bpm); }
  if (structure  !== undefined) { fields.push('structure = ?');   values.push(JSON.stringify(structure)); }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE songs SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cancion no encontrada' });
    }

    const [rows] = await pool.execute(
      'SELECT id, title, artist, default_key, duration, bpm, structure FROM songs WHERE id = ?',
      [id]
    );

    return res.json(songToDto(rows[0]));

  } catch (err) {
    return next(err);
  }
}

async function deleteSong(req, res, next) {
  const { id } = req.params;

  try {
    const [result] = await pool.execute(
      'DELETE FROM songs WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cancion no encontrada' });
    }

    return res.status(204).send();

  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        error: 'No se puede eliminar: la cancion esta en uno o mas setlists activos',
      });
    }
    return next(err);
  }
}

module.exports = { getSongs, getSongById, createSong, updateSong, deleteSong };
