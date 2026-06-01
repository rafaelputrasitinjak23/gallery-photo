const { safeJson, safePage } = require('../utils/safeResponse');

function notFoundHandler(req, res) {
  if (req.path.startsWith('/api')) {
    return safeJson(res, 404, 'Data tidak ditemukan.');
  }

  return res.status(404).render('pages/error', {
    title: 'Halaman Tidak Ditemukan',
    message: 'Halaman yang kamu cari tidak tersedia.'
  });
}

function errorHandler(error, req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[safe-error]', error && error.message ? error.message : 'Unknown error');
  }

  if (res.headersSent) {
    return next(error);
  }

  if (req.path.startsWith('/api') || req.xhr) {
    return safeJson(res, 500, 'Terjadi kesalahan. Silakan coba lagi.');
  }

  return safePage(res, 500, 'Terjadi kesalahan. Silakan coba lagi.');
}

module.exports = { notFoundHandler, errorHandler };
