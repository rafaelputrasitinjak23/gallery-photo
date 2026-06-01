const { nanoid } = require('nanoid');
const initialTemplates = require('../data/initialTemplates');

const templates = new Map(initialTemplates.map((item) => [item.slug, { ...item, _id: item.slug, usageCount: 0, createdAt: new Date(), updatedAt: new Date() }]));
const results = new Map();

function nowPlusHours(hours) {
  return new Date(Date.now() + Number(hours || 24) * 60 * 60 * 1000);
}

function listTemplates(activeOnly = false) {
  const items = Array.from(templates.values());
  return activeOnly ? items.filter((item) => item.isActive) : items;
}

function findTemplateBySlug(slug, activeOnly = false) {
  const template = templates.get(slug);
  if (!template) return null;
  if (activeOnly && !template.isActive) return null;
  return template;
}

function saveTemplate(payload) {
  const existing = templates.get(payload.slug) || {};
  const item = {
    ...existing,
    ...payload,
    _id: existing._id || payload.slug,
    usageCount: existing.usageCount || 0,
    updatedAt: new Date(),
    createdAt: existing.createdAt || new Date()
  };
  templates.set(item.slug, item);
  return item;
}

function deleteTemplate(idOrSlug) {
  const direct = templates.delete(idOrSlug);
  if (direct) return true;
  for (const [slug, template] of templates.entries()) {
    if (String(template._id) === String(idOrSlug)) {
      templates.delete(slug);
      return true;
    }
  }
  return false;
}

function patchTemplateStatus(idOrSlug, isActive) {
  for (const [slug, template] of templates.entries()) {
    if (slug === idOrSlug || String(template._id) === String(idOrSlug)) {
      template.isActive = Boolean(isActive);
      template.updatedAt = new Date();
      templates.set(slug, template);
      return template;
    }
  }
  return null;
}

function incrementTemplateUsage(slug) {
  const template = templates.get(slug);
  if (template) {
    template.usageCount = (template.usageCount || 0) + 1;
    template.updatedAt = new Date();
  }
}

function createResult(payload) {
  const id = nanoid(14);
  const item = {
    ...payload,
    _id: id,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: payload.expiresAt || nowPlusHours(process.env.AUTO_DELETE_HOURS || 24)
  };
  results.set(id, item);
  return item;
}

function findResultById(id) {
  const item = results.get(id);
  if (!item) return null;
  if (item.expiresAt && new Date(item.expiresAt).getTime() < Date.now()) {
    results.delete(id);
    return null;
  }
  return item;
}

function updateResult(id, patch) {
  const item = findResultById(id);
  if (!item) return null;
  const updated = { ...item, ...patch, updatedAt: new Date() };
  results.set(id, updated);
  return updated;
}

function deleteResult(id, sessionId) {
  const item = results.get(id);
  if (!item) return false;
  if (sessionId && item.sessionId !== sessionId) return false;
  return results.delete(id);
}

function listResultsBySession(sessionId) {
  cleanupExpiredResults();
  return Array.from(results.values())
    .filter((item) => item.sessionId === sessionId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function cleanupExpiredResults() {
  let deleted = 0;
  const now = Date.now();
  for (const [id, result] of results.entries()) {
    if (result.expiresAt && new Date(result.expiresAt).getTime() < now) {
      results.delete(id);
      deleted += 1;
    }
  }
  return deleted;
}

function getStats() {
  cleanupExpiredResults();
  return {
    totalTemplates: templates.size,
    activeTemplates: Array.from(templates.values()).filter((item) => item.isActive).length,
    totalResults: results.size,
    totalUsage: Array.from(templates.values()).reduce((sum, item) => sum + (item.usageCount || 0), 0)
  };
}

module.exports = {
  listTemplates,
  findTemplateBySlug,
  saveTemplate,
  deleteTemplate,
  patchTemplateStatus,
  incrementTemplateUsage,
  createResult,
  findResultById,
  updateResult,
  deleteResult,
  listResultsBySession,
  cleanupExpiredResults,
  getStats
};
