/**
 * src/middleware/auth.js
 *
 * Verifica el JWT del header Authorization y lo inyecta en req.user.
 *
 * npm install jsonwebtoken
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware que protege rutas privadas.
 * Uso: router.use(authenticate) o router.get('/ruta', authenticate, controller)
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id:   payload.sub,
      name: payload.name,
      role: payload.role,
    };

    return next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
}

/**
 * Middleware de autorización por rol.
 * Uso: router.delete('/:id', authenticate, requireRole('LIDER'), controller)
 *
 * @param {...string} roles - Roles permitidos
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
      });
    }
    return next();
  };
}

module.exports = { authenticate, requireRole };
