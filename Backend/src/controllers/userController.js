/**
 * src/controllers/userController.js
 *
 * Perfil propio y directorio de ministros.
 */

const bcrypt = require('bcrypt');
const pool   = require('../config/db');

function userToDto(row) {
  return {
    id:        row.id,
    name:      row.name,
    email:     row.email,
    role:      row.role,
    createdAt: row.created_at,
  };
}

async function getUsers(req, res, next) {
  const { search } = req.query;

  try {
    let sql    = 'SELECT id, name, email, role, created_at FROM users';
    const params = [];

    if (search) {
      sql += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY name ASC';

    const [rows] = await pool.execute(sql, params);

    return res.json({ users: rows.map(userToDto) });

  } catch (err) {
    return next(err);
  }
}

async function getMe(req, res, next) {
  const userId = req.user.id;

  try {
    const [userRows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const [setlistRows] = await pool.execute(
      `SELECT id, title, scheduled_date, status
       FROM   setlists
       WHERE  leader_id = ?
       ORDER BY scheduled_date DESC
       LIMIT 10`,
      [userId]
    );

    return res.json({
      ...userToDto(userRows[0]),
      setlists: setlistRows.map(sl => ({
        id:            sl.id,
        title:         sl.title,
        scheduledDate: sl.scheduled_date,
        status:        sl.status,
      })),
    });

  } catch (err) {
    return next(err);
  }
}

async function getUserById(req, res, next) {
  const { id } = req.params;

  try {
    const [userRows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const [setlistRows] = await pool.execute(
      `SELECT id, title, scheduled_date, status
       FROM   setlists
       WHERE  leader_id = ?
       ORDER BY scheduled_date DESC
       LIMIT 10`,
      [id]
    );

    return res.json({
      ...userToDto(userRows[0]),
      setlists: setlistRows.map(sl => ({
        id:            sl.id,
        title:         sl.title,
        scheduledDate: sl.scheduled_date,
        status:        sl.status,
      })),
    });

  } catch (err) {
    return next(err);
  }
}

async function updateMe(req, res, next) {
  const userId = req.user.id;
  const { name, currentPassword, newPassword } = req.body;

  const fields = [];
  const values = [];

  try {
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Envia currentPassword para cambiar la contrasena' });
      }

      const [rows] = await pool.execute(
        'SELECT password_hash FROM users WHERE id = ?',
        [userId]
      );

      const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Contrasena actual incorrecta' });
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      fields.push('password_hash = ?');
      values.push(newHash);
    }

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      [...values, userId]
    );

    const [updated] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    return res.json(userToDto(updated[0]));

  } catch (err) {
    return next(err);
  }
}

module.exports = { getUsers, getMe, getUserById, updateMe };
