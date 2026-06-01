function safeJson(res, statusCode = 500, message = 'Terjadi kesalahan. Silakan coba lagi.') {
  return res.status(statusCode).json({ success: false, message });
}

function safePage(res, statusCode = 500, message = 'Terjadi kesalahan. Silakan coba lagi.') {
  return res.status(statusCode).render('pages/error', {
    title: 'Terjadi Kesalahan',
    message
  });
}

module.exports = { safeJson, safePage };
