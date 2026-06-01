const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    ratio: { type: String, required: true, trim: true, maxlength: 20 },
    canvas: {
      width: { type: Number, required: true, min: 300, max: 4000 },
      height: { type: Number, required: true, min: 300, max: 5000 }
    },
    previewImage: { type: String, default: '' },
    referenceImage: { type: String, default: '' },
    background: { type: mongoose.Schema.Types.Mixed, default: {} },
    photoSlots: { type: [mongoose.Schema.Types.Mixed], default: [] },
    textElements: { type: [mongoose.Schema.Types.Mixed], default: [] },
    decorations: { type: [mongoose.Schema.Types.Mixed], default: [] },
    usageCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

templateSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Template', templateSchema);
