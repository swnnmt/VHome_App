const mongoose = require('mongoose');

const PaintSchema = new mongoose.Schema({
  colorCode: { type: String, required: true }, // Mã màu, ví dụ "#FF0000"
  price: { type: Number, required: true },     // Giá tiền
});

const TileSchema = new mongoose.Schema({
  image: { type: String, required: true },     // URL hoặc path ảnh
  price: { type: Number, required: true },     // Giá tiền
});

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  banner: { type: String, required: true },
  paints: [PaintSchema],  // Mảng các paint
  tiles: [TileSchema],    // Mảng các tiles
}, {
  timestamps: true,
});

module.exports = mongoose.model('Brand', BrandSchema,'VHome_brand');
