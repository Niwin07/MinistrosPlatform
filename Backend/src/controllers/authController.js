/**
 * src/controllers/authController.js
 *
 * Login y Register.
 * npm install bcrypt jsonwebtoken
 */

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');

const JWT_SECRET  = process.env.JWT_SECRET;
const JWT_EXPIRES = '7d';

async function register(req, res, next) {
  const { name, email, password, role = 'MUSICO' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email y password son obligatorios' });
  }

  try {
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email ya esta registrado' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();

    await pool.execute(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, password_hash, role]
    );

    const token = signToken({ id, name, role });

    return res.status(201).json({
      token,
      user: { id, name, email, role },
    });

  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son obligatorios' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales invalidas' });
    }

    const token = signToken({ id: user.id, name: user.name, role: user.role });

    return res.json({
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });

  } catch (err) {
    return next(err);
  }
}

function signToken({ id, name, role }) {
  return jwt.sign(
    { sub: id, name, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

module.exports = { register, login };
