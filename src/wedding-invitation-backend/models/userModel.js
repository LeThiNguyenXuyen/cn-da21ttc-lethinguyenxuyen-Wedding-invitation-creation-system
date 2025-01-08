import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WeddingCard' }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    customizedCards: [
      {
        cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'WeddingCard' },
        boxes: [
          {
            name: String,
            position: { x: Number, y: Number },
            style: {
              font: String,
              fontSize: Number,
              color: String,
              bold: Boolean,
              italic: Boolean,
            },
            text: String,
          },
        ],
      },
    ],
  },
  { minimize: false } // Giữ lại các trường rỗng trong dữ liệu
);

// Kiểm tra và đảm bảo chỉ một model được định nghĩa
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel; // Xuất model
