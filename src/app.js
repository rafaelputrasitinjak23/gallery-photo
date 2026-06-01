require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const pageRoutes = require('./routes/pageRoutes');
const templateRoutes = require('./routes/templateRoutes');
const resultRoutes = require('./routes/resultRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { publicLimiter, apiLimiter } = require('./middlewares/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = String(process.env.DATABASE_URL || process.env.MONGODB_URI || '').trim();
const sessionSecret = String(process.env.SESSION_SECRET || '').trim() || 'change_this_secret';

function isValidMongoUrl(value) {
  if (!value) return false;
  if (value === 'your_database_url') return false;
  if (value === 'null' || value === 'undefined') return false;
  return value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');
}

function createSessionStore() {
  const useMongoSession = process.env.USE_MONGO_SESSION === 'true';

  if (!useMongoSession) {
    console.warn('[app] USE_MONGO_SESSION belum true. Session memakai memory store lokal.');
    return null;
  }

  if (!isValidMongoUrl(databaseUrl)) {
    console.warn('[app] DATABASE_URL tidak valid. Session memakai memory store lokal.');
    return null;
  }

  try {
    return MongoStore.create({
      mongoUrl: databaseUrl,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60,
      autoRemove: 'interval',
      autoRemoveInterval: 10,
      touchAfter: 24 * 60 * 60
    });
  } catch (error) {
    console.warn('[app] Mongo session store gagal dibuat. Session memakai memory store lokal.');
    return null;
  }
}

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      mediaSrc: ["'self'", 'blob:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '14mb' }));
app.use(express.static(path.join(__dirname, '..', 'public'), {
  maxAge: isProduction ? '7d' : 0,
  etag: true
}));

const sessionConfig = {
  name: 'gallery.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000
  }
};

const mongoSessionStore = createSessionStore();
if (mongoSessionStore) {
  sessionConfig.store = mongoSessionStore;
}

app.use(session(sessionConfig));
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.isAdmin = Boolean(req.session && req.session.isAdmin);
  res.locals.appName = 'Aesthetic Gallery';
  next();
});

app.use(publicLimiter);
app.use('/', pageRoutes);
app.use('/api', apiLimiter, templateRoutes);
app.use('/api', apiLimiter, resultRoutes);
app.use('/admin', adminRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
