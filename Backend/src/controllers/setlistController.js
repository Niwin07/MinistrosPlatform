const pool = require('../config/db');

function songRowToDto(row) {
  return {
    id:          row.id,
    title:       row.title,
    artist:      row.artist,
    defaultKey:  row.default_key,
    overrideKey: row.override_key,
    duration:    row.duration,
    bpm:         row.bpm,
    sortOrder:   row.sort_order,
    structure:   typeof row.structure === 'string'
                   ? JSON.parse(row.structure)
                   : row.structure ?? null,
  };
}

async function getSetlistById(req, res) {
  const { id } = req.params;

  try {
    const [setlistRows] = await pool.execute(
      `SELECT
         sl.id,
         sl.title,
         sl.scheduled_date,
         sl.status,
         u.id          AS leader_id,
         u.name        AS leader_name,
         u.email       AS leader_email,
         u.role        AS leader_role
       FROM setlists sl
       INNER JOIN users u ON u.id = sl.leader_id
       WHERE sl.id = ?`,
      [id]
    );

    if (setlistRows.length === 0) {
      return res.status(404).json({ error: 'Setlist no encontrado' });
    }

    const sl = setlistRows[0];

    const [songRows] = await pool.execute(
      `SELECT
         s.id,
         s.title,
         s.artist,
         s.default_key,
         s.duration,
         s.bpm,
         s.structure,
         ss.override_key,
         ss.sort_order
       FROM setlist_songs ss
       INNER JOIN songs s ON s.id = ss.song_id
       WHERE ss.setlist_id = ?
       ORDER BY ss.sort_order ASC`,
      [id]
    );

    return res.json({
      id:            sl.id,
      title:         sl.title,
      scheduledDate: sl.scheduled_date,
      status:        sl.status,
      leader: {
        id:    sl.leader_id,
        name:  sl.leader_name,
        email: sl.leader_email,
        role:  sl.leader_role,
      },
      songs: songRows.map(songRowToDto),
    });

  } catch (err) {
    console.error('[getSetlistById]', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateSetlist(req, res) {
  const { id }    = req.params;
  const { songs } = req.body;

  if (!Array.isArray(songs)) {
    return res.status(400).json({ error: '`songs` debe ser un array' });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [check] = await conn.execute(
      'SELECT id FROM setlists WHERE id = ?',
      [id]
    );
    if (check.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ error: 'Setlist no encontrado' });
    }

    await conn.execute(
      'DELETE FROM setlist_songs WHERE setlist_id = ?',
      [id]
    );

    if (songs.length > 0) {
      const placeholders = songs.map(() => '(UUID(), ?, ?, ?, ?)').join(', ');
      const values = songs.flatMap(({ songId, overrideKey = null, sortOrder }) => [
        id,
        songId,
        overrideKey,
        sortOrder,
      ]);

      await conn.execute(
        `INSERT INTO setlist_songs (id, setlist_id, song_id, override_key, sort_order)
         VALUES ${placeholders}`,
        values
      );
    }

    await conn.commit();
    conn.release();

    return res.json({ success: true, updated: songs.length });

  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('[updateSetlist]', err);
    return res.status(500).json({ error: 'Error al actualizar el setlist' });
  }
}

async function cloneSetlist(req, res) {
  const { id: sourceId } = req.params;
  const leaderId = req.user.id;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [sourceRows] = await conn.execute(
      'SELECT id, title FROM setlists WHERE id = ?',
      [sourceId]
    );
    if (sourceRows.length === 0) {
      await conn.rollback();
      conn.release();
      return res.status(404).json({ error: 'Setlist origen no encontrado' });
    }

    const sourceTitle = sourceRows[0].title;

    const { v4: uuidv4 } = require('uuid');
    const newSetlistId = uuidv4();

    await conn.execute(
      `INSERT INTO setlists (id, leader_id, title, scheduled_date, status)
       VALUES (?, ?, ?, CURDATE(), 'DRAFT')`,
      [
        newSetlistId,
        leaderId,
        `${sourceTitle} (Copia)`,
      ]
    );

    const [cloneResult] = await conn.execute(
      `INSERT INTO setlist_songs (id, setlist_id, song_id, override_key, sort_order)
       SELECT UUID(), ?, song_id, override_key, sort_order
       FROM   setlist_songs
       WHERE  setlist_id = ?
       ORDER BY sort_order ASC`,
      [newSetlistId, sourceId]
    );

    await conn.commit();
    conn.release();

    return res.status(201).json({
      newSetlistId,
      clonedSongs: cloneResult.affectedRows,
      message:     'Setlist clonado correctamente',
    });

  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('[cloneSetlist]', err);
    return res.status(500).json({ error: 'Error al clonar el setlist' });
  }
}

module.exports = {
  getSetlistById,
  updateSetlist,
  cloneSetlist,
};
