/**
 * src/middleware/errorHandler.js
 *
 * Captura todos los errores que los controllers pasan con next(err).
 * Debe montarse ULTIMO en app.js (despues de todas las rutas).
 */

function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado en el body' });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'El registro ya existe' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'ID referenciado no existe en la DB' });
  }

  const isDev = process.env.NODE_ENV === 'development';
  return res.status(500).json({
    error:  'Error interno del servidor',
    detail: isDev ? err.message : undefined,
  });
}

module.exports = errorHandler;
