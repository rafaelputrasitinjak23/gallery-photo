const Template = require('../models/Template');
const { isDatabaseReady } = require('../config/database');
const memoryStore = require('../utils/memoryStore');
const { getTemplateSummary } = require('../utils/renderHelper');
const { sanitizeTemplatePayload } = require('../middlewares/validateInput');

async function getTemplates({ activeOnly = true } = {}) {
  if (isDatabaseReady()) {
    const query = activeOnly ? { isActive: true } : {};
    return Template.find(query).sort({ createdAt: -1 }).lean();
  }

  return memoryStore.listTemplates(activeOnly);
}

async function getTemplateBySlug(slug, { activeOnly = true } = {}) {
  if (isDatabaseReady()) {
    const query = activeOnly ? { slug, isActive: true } : { slug };
    return Template.findOne(query).lean();
  }

  return memoryStore.findTemplateBySlug(slug, activeOnly);
}

async function listTemplatesApi(req, res, next) {
  try {
    const templates = await getTemplates({ activeOnly: true });
    return res.json({ success: true, templates: templates.map(getTemplateSummary) });
  } catch (error) {
    return next(error);
  }
}

async function singleTemplateApi(req, res, next) {
  try {
    const template = await getTemplateBySlug(req.params.slug, { activeOnly: true });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template tidak ditemukan.' });
    }
    return res.json({ success: true, template });
  } catch (error) {
    return next(error);
  }
}

async function adminCreateTemplate(req, res, next) {
  try {
    const payload = sanitizeTemplatePayload(req.body);
    if (!payload.name || !payload.slug || !(Array.isArray(payload.photoSlots) && payload.photoSlots.length)) {
      return res.status(400).json({ success: false, message: 'Data template belum lengkap.' });
    }

    let template;
    if (isDatabaseReady()) {
      template = await Template.findOneAndUpdate(
        { slug: payload.slug },
        payload,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
    } else {
      template = memoryStore.saveTemplate(payload);
    }

    return res.json({ success: true, message: 'Template berhasil disimpan.', template });
  } catch (error) {
    return next(error);
  }
}

async function adminUpdateTemplate(req, res, next) {
  try {
    const payload = sanitizeTemplatePayload(req.body);
    if (!payload.name || !payload.slug || !(Array.isArray(payload.photoSlots) && payload.photoSlots.length)) {
      return res.status(400).json({ success: false, message: 'Data template belum lengkap.' });
    }

    let template;
    if (isDatabaseReady()) {
      template = await Template.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).lean();
    } else {
      template = memoryStore.saveTemplate({ ...payload, _id: req.params.id });
    }

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Template berhasil diperbarui.', template });
  } catch (error) {
    return next(error);
  }
}

async function adminDeleteTemplate(req, res, next) {
  try {
    let deleted;
    if (isDatabaseReady()) {
      deleted = await Template.findByIdAndDelete(req.params.id).lean();
    } else {
      deleted = memoryStore.deleteTemplate(req.params.id);
    }

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Template tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Template berhasil dihapus.' });
  } catch (error) {
    return next(error);
  }
}

async function adminPatchTemplateStatus(req, res, next) {
  try {
    const isActive = Boolean(req.body.isActive);
    let template;

    if (isDatabaseReady()) {
      template = await Template.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).lean();
    } else {
      template = memoryStore.patchTemplateStatus(req.params.id, isActive);
    }

    if (!template) {
      return res.status(404).json({ success: false, message: 'Template tidak ditemukan.' });
    }

    return res.json({ success: true, message: 'Status template diperbarui.', template });
  } catch (error) {
    return next(error);
  }
}

async function incrementUsage(slug) {
  if (isDatabaseReady()) {
    await Template.updateOne({ slug }, { $inc: { usageCount: 1 } });
  } else {
    memoryStore.incrementTemplateUsage(slug);
  }
}

module.exports = {
  getTemplates,
  getTemplateBySlug,
  listTemplatesApi,
  singleTemplateApi,
  adminCreateTemplate,
  adminUpdateTemplate,
  adminDeleteTemplate,
  adminPatchTemplateStatus,
  incrementUsage
};
