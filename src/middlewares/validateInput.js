const validator = require('validator');

const ALLOWED_CATEGORIES = [
  'Reminder',
  'Gallery',
  'Polaroid',
  'Moodboard',
  'Birthday',
  'Graduation',
  'Couple',
  'Travel',
  'Minimal',
  'Story'
];

function cleanText(value, max = 300) {
  if (typeof value !== 'string') return '';
  return validator.escape(value.trim().slice(0, max));
}

function cleanRawText(value, max = 300) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function sanitizeTemplatePayload(payload = {}) {
  const canvasWidth = Number(payload.canvas && payload.canvas.width);
  const canvasHeight = Number(payload.canvas && payload.canvas.height);

  return {
    name: cleanRawText(payload.name, 120),
    slug: String(payload.slug || payload.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 140),
    description: cleanRawText(payload.description, 400),
    category: ALLOWED_CATEGORIES.includes(payload.category) ? payload.category : 'Gallery',
    ratio: cleanRawText(payload.ratio, 20) || '4:5',
    canvas: {
      width: Number.isFinite(canvasWidth) ? Math.min(Math.max(canvasWidth, 300), 4000) : 1080,
      height: Number.isFinite(canvasHeight) ? Math.min(Math.max(canvasHeight, 300), 5000) : 1350
    },
    previewImage: cleanRawText(payload.previewImage, 250),
    referenceImage: cleanRawText(payload.referenceImage, 250),
    background: typeof payload.background === 'object' && payload.background ? payload.background : {},
    photoSlots: Array.isArray(payload.photoSlots) ? payload.photoSlots.slice(0, 12) : [],
    textElements: Array.isArray(payload.textElements) ? payload.textElements.slice(0, 20) : [],
    decorations: Array.isArray(payload.decorations) ? payload.decorations.slice(0, 40) : [],
    isActive: Boolean(payload.isActive)
  };
}

function sanitizeNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(number, min), max);
}

function sanitizeTransform(value = {}) {
  if (!value || typeof value !== 'object') {
    return { zoom: 1, rotate: 0, offsetX: 0, offsetY: 0 };
  }

  return {
    zoom: sanitizeNumber(value.zoom, 1, 0.2, 4),
    rotate: sanitizeNumber(value.rotate, 0, -180, 180),
    offsetX: sanitizeNumber(value.offsetX, 0, -1200, 1200),
    offsetY: sanitizeNumber(value.offsetY, 0, -1200, 1200)
  };
}

function sanitizeTextValue(value) {
  if (typeof value === 'string') {
    return { text: cleanRawText(value, 300) };
  }

  if (!value || typeof value !== 'object') {
    return { text: '' };
  }

  return {
    text: cleanRawText(value.text, 300),
    color: /^#[0-9a-fA-F]{6}$/.test(String(value.color || '')) ? String(value.color) : '',
    fontSize: sanitizeNumber(value.fontSize, 0, 0, 160),
    fontFamily: cleanRawText(value.fontFamily, 80)
  };
}

function sanitizeResultPayload(payload = {}) {
  const photos = Array.isArray(payload.photos) ? payload.photos.slice(0, 12).map((photo) => ({
    slotId: cleanRawText(photo.slotId || photo.id, 80),
    dataUrl: typeof photo.dataUrl === 'string' && photo.dataUrl.startsWith('data:image/') ? photo.dataUrl.slice(0, 6_000_000) : '',
    filter: cleanRawText(photo.filter || 'normal', 30),
    caption: cleanRawText(photo.caption || '', 120),
    transform: sanitizeTransform(photo.transform)
  })).filter((photo) => photo.slotId && photo.dataUrl) : [];

  const textValues = {};
  if (payload.textValues && typeof payload.textValues === 'object') {
    Object.entries(payload.textValues).slice(0, 30).forEach(([key, value]) => {
      const safeKey = cleanRawText(key, 80);
      if (safeKey) textValues[safeKey] = sanitizeTextValue(value);
    });
  }

  return {
    templateSlug: cleanRawText(payload.templateSlug, 140),
    photos,
    textValues,
    finalImage: typeof payload.finalImage === 'string' && payload.finalImage.startsWith('data:image/') ? payload.finalImage.slice(0, 10_000_000) : '',
    thumbnail: typeof payload.thumbnail === 'string' && payload.thumbnail.startsWith('data:image/') ? payload.thumbnail.slice(0, 1_200_000) : ''
  };
}

module.exports = {
  ALLOWED_CATEGORIES,
  cleanText,
  cleanRawText,
  sanitizeTemplatePayload,
  sanitizeResultPayload
};
