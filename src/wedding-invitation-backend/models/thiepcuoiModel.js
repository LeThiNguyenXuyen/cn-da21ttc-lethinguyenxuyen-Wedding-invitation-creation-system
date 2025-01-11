import mongoose from 'mongoose';

// Định nghĩa Schema cho từng hộp văn bản
const BoxSchema = new mongoose.Schema({
  name: { type: String, required: false }, // Tên hộp (e.g., "Tên chú rể", "Tên cô dâu")
  position: {
    x: { type: Number, required: true }, // Tọa độ X
    y: { type: Number, required: true }, // Tọa độ Y
  },
  style: {
    font: { type: String, default: 'Arial' }, // Font chữ
    fontSize: { type: Number, default: 16 },  // Kích thước chữ
    color: { type: String, default: '#000000' }, // Màu chữ
    bold: { type: Boolean, default: false }, // In đậm
    italic: { type: Boolean, default: false } // In nghiêng
    
  },
  text: { type: String, default: '' }, // Nội dung trong hộp
});

// Định nghĩa Schema cho thiệp cưới
const WeddingCardSchema = new mongoose.Schema(
  {
    id:{ type: String, required: true },
    name: { type: String, required: true }, // Tên thiệp cưới (e.g., "Thiệp Cổ Điển 1")
    category: { type: String, required: true }, // Danh mục (e.g., "Cổ điển", "Hiện đại")
    image: { type: String, required: true }, // Đường dẫn tới hình ảnh đại diện của thiệp
    image2: { type: String, required: true }, // Đường dẫn tới hình ảnh đại diện của thiệp
    mota: { type: String, required: true },
    gia: { type: Number, required: true },
    boxes: { type: [BoxSchema], default: [] }, // Danh sách các hộp văn bản
    createdAt: { type: Date, default: Date.now }, // Ngày tạo thiệp
    updatedAt: { type: Date, default: Date.now }, // Ngày cập nhật thiệp
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Đảm bảo không bị lỗi khi load lại model
const WeddingCardModel = 
  mongoose.models.WeddingCard || mongoose.model('WeddingCard', WeddingCardSchema);

export default WeddingCardModel;
