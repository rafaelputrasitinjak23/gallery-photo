function authAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }

  if (req.path.startsWith('/api')) {
    return res.status(401).json({ success: false, message: 'Akses admin diperlukan.' });
  }

  return res.redirect('/admin/login');
}

module.exports = authAdmin;
