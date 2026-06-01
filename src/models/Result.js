const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    templateSlug: { type: String, required: true, index: true },
    templateName: { type: String, default: '' },
    ratio: { type: String, default: '' },
    photos: { type: [mongoose.Schema.Types.Mixed], default: [] },
    textValues: { type: mongoose.Schema.Types.Mixed, default: {} },
    finalImage: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

resultSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Result', resultSchema);
