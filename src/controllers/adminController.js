const bcrypt = require('bcryptjs');
const validator = require('validator');
const Admin = require('../models/Admin');
const Template = require('../models/Template');
const Result = require('../models/Result');
const { isDatabaseReady } = require('../config/database');
const memoryStore = require('../utils/memoryStore');
const initialTemplates = require('../data/initialTemplates');
const { getTemplates } = require('./templateController');

function adminCredentials() {
  return {
    email: String(process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim(),
    password: String(process.env.ADMIN_PASSWORD || 'change_this_password')
  };
}

async function ensureDefaultAdmin() {
  if (!isDatabaseReady()) return;
  const { email, password } = adminCredentials();
  if (!validator.isEmail(email) || !password || password === 'change_this_password') {
    console.warn('[app] ADMIN_EMAIL/ADMIN_PASSWORD belum diatur dengan aman. Admin database tidak dibuat.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash, name: 'Administrator' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedTemplatesIfEmpty() {
  if (!isDatabaseReady()) return;
  const total = await Template.countDocuments();
  if (total > 0) return;

  await Template.insertMany(initialTemplates, { ordered: false });
  console.log('[app] Seed template awal berhasil dimasukkan.');
}

async function loginPage(req, res) {
  return res.render('admin/login', {
    title: 'Login Admin',
    error: req.query.error ? 'Email atau password admin salah.' : ''
  });
}

async function loginAction(req, res, next) {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    const password = String(req.body.password || '');

    if (!validator.isEmail(email) || !password) {
      return res.redirect('/admin/login?error=1');
    }

    let valid = false;

    if (isDatabaseReady()) {
      const admin = await Admin.findOne({ email });
      valid = Boolean(admin && await bcrypt.compare(password, admin.passwordHash));
      if (valid) {
        await Admin.updateOne({ _id: admin._id }, { lastLoginAt: new Date() });
      }
    } else {
      const fallback = adminCredentials();
      valid = email === fallback.email && password === fallback.password;
    }

    if (!valid) {
      return res.redirect('/admin/login?error=1');
    }

    req.session.isAdmin = true;
    req.session.adminEmail = email;
    return res.redirect('/admin');
  } catch (error) {
    return next(error);
  }
}

function logout(req, res) {
  req.session.isAdmin = false;
  delete req.session.adminEmail;
  return res.redirect('/admin/login');
}

async function dashboard(req, res, next) {
  try {
    let stats;

    if (isDatabaseReady()) {
      const [totalTemplates, activeTemplates, totalResults, usage] = await Promise.all([
        Template.countDocuments(),
        Template.countDocuments({ isActive: true }),
        Result.countDocuments(),
        Template.aggregate([{ $group: { _id: null, total: { $sum: '$usageCount' } } }])
      ]);
      stats = {
        totalTemplates,
        activeTemplates,
        totalResults,
        totalUsage: usage[0] ? usage[0].total : 0
      };
    } else {
      stats = memoryStore.getStats();
    }

    const templates = await getTemplates({ activeOnly: false });

    return res.render('admin/dashboard', {
      title: 'Dashboard Admin',
      stats,
      templates: templates.slice(0, 6)
    });
  } catch (error) {
    return next(error);
  }
}

async function templateManager(req, res, next) {
  try {
    const templates = await getTemplates({ activeOnly: false });
    return res.render('admin/templates', {
      title: 'Kelola Template',
      templates,
      sampleTemplate: JSON.stringify(initialTemplates[0], null, 2)
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  ensureDefaultAdmin,
  seedTemplatesIfEmpty,
  loginPage,
  loginAction,
  logout,
  dashboard,
  templateManager
};
