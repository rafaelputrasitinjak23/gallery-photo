const Result = require('../models/Result');
const { isDatabaseReady } = require('../config/database');
const memoryStore = require('../utils/memoryStore');
const { sanitizeResultPayload } = require('../middlewares/validateInput');
const { getTemplateBySlug, incrementUsage } = require('./templateController');

function getAutoDeleteDate() {
  const hours = Number(process.env.AUTO_DELETE_HOURS || 24);
  return new Date(Date.now() + Math.max(hours, 1) * 60 * 60 * 1000);
}

function getSessionId(req) {
  if (!req.session.clientId) {
    req.session.clientId = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
  return req.session.clientId;
}

async function createResultApi(req, res, next) {
  try {
    const payload = sanitizeResultPayload(req.body);
    const template = await getTemplateBySlug(payload.templateSlug, { activeOnly: true });

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template tidak ditemukan.' });
    }

    if (!(Array.isArray(payload.photos) && payload.photos.length)) {
      return res.status(400).json({ success: false, message: 'Minimal satu foto diperlukan.' });
    }

    const data = {
      sessionId: getSessionId(req),
      templateSlug: template.slug,
      templateName: template.name,
      ratio: template.ratio,
      photos: payload.photos,
      textValues: payload.textValues,
      finalImage: payload.finalImage,
      thumbnail: payload.thumbnail,
      expiresAt: getAutoDeleteDate()
    };

    let result;
    if (isDatabaseReady()) {
      result = await Result.create(data);
    } else {
      result = memoryStore.createResult(data);
    }

    await incrementUsage(template.slug);

    return res.status(201).json({ success: true, id: String(result._id), result });
  } catch (error) {
    return next(error);
  }
}

async function getResultApi(req, res, next) {
  try {
    const sessionId = getSessionId(req);
    let result;

    if (isDatabaseReady()) {
      result = await Result.findOne({ _id: req.params.id, sessionId }).lean();
    } else {
      result = memoryStore.findResultById(req.params.id);
      if (result && result.sessionId !== sessionId) result = null;
    }

    if (!result) {
      return res.status(404).json({ success: false, message: 'Hasil tidak ditemukan.' });
    }

    return res.json({ success: true, result });
  } catch (error) {
    return next(error);
  }
}

async function updateResultApi(req, res, next) {
  try {
    const payload = sanitizeResultPayload(req.body);
    const patch = {
      photos: payload.photos,
      textValues: payload.textValues,
      finalImage: payload.finalImage,
      thumbnail: payload.thumbnail
    };
    const sessionId = getSessionId(req);
    let result;

    if (isDatabaseReady()) {
      result = await Result.findOneAndUpdate({ _id: req.params.id, sessionId }, patch, { new: true }).lean();
    } else {
      const current = memoryStore.findResultById(req.params.id);
      if (current && current.sessionId === sessionId) {
        result = memoryStore.updateResult(req.params.id, patch);
      }
    }

    if (!result) {
      return res.status(404).json({ success: false, message: 'Hasil tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Hasil tersimpan.', result });
  } catch (error) {
    return next(error);
  }
}

async function deleteResultApi(req, res, next) {
  try {
    const sessionId = getSessionId(req);
    let deleted;

    if (isDatabaseReady()) {
      deleted = await Result.findOneAndDelete({ _id: req.params.id, sessionId }).lean();
    } else {
      deleted = memoryStore.deleteResult(req.params.id, sessionId);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Hasil tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Hasil berhasil dihapus.' });
  } catch (error) {
    return next(error);
  }
}

async function listResultsBySession(req) {
  const sessionId = getSessionId(req);

  if (isDatabaseReady()) {
    return Result.find({ sessionId }).sort({ createdAt: -1 }).lean();
  }

  return memoryStore.listResultsBySession(sessionId);
}

async function getResultForPage(req) {
  const sessionId = getSessionId(req);

  if (isDatabaseReady()) {
    return Result.findOne({ _id: req.params.id, sessionId }).lean();
  }

  const result = memoryStore.findResultById(req.params.id);
  return result && result.sessionId === sessionId ? result : null;
}

module.exports = {
  getSessionId,
  createResultApi,
  getResultApi,
  updateResultApi,
  deleteResultApi,
  listResultsBySession,
  getResultForPage
};
