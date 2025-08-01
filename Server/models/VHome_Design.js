const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VHome_User',
    required: true,
  },
  id_brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VHome_Brand',
    required: true,
  },
  originalImage: {
    type: String,
    required: true, // ảnh gốc bắt buộc
  },
  designedImage: {
    type: String,   // ảnh thiết kế (tùy chọn)
    default: null,
  },
  paintCode: {
    type: String,
    required: true,
  },
  tileImage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Design', DesignSchema, 'VHome_Design');
