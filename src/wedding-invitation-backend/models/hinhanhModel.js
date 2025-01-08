const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  image_url: { type: String, required: true }, // Đường dẫn đến hình ảnh, bắt buộc
  category: { type: String, required: true }, // Phân loại hình ảnh (ví dụ: background, bride, groom)
  description: { type: String, required: false } // Mô tả hình ảnh (tùy chọn)
});

module.exports = mongoose.model('Image', ImageSchema);