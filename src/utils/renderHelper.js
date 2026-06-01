function getTemplateSummary(template) {
  return {
    id: String(template._id || template.slug),
    name: template.name,
    slug: template.slug,
    description: template.description,
    category: template.category,
    ratio: template.ratio,
    canvas: template.canvas,
    previewImage: template.previewImage,
    slotCount: Array.isArray(template.photoSlots) ? template.photoSlots.length : 0,
    usageCount: template.usageCount || 0,
    isActive: template.isActive
  };
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
}

module.exports = { getTemplateSummary, formatDate };
