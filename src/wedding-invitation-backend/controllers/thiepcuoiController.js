import WeddingCardModel from '../models/thiepcuoiModel.js';
import UserModel from '../models/userModel.js';
import mongoose from 'mongoose';

// Thêm thiệp cưới
const addTc = async (req, res) => {
  try {
    const { id, name, category, image, image2, mota, gia, boxes } = req.body;

    if (!name || !category || !image || !image2 || !mota || gia === undefined) {
      return res.status(400).json({ message: 'Các trường name, category, image, mota và gia là bắt buộc.' });
    }

    const newWeddingCard = new WeddingCardModel({
      id,
      name,
      category,
      image,
      image2,
      mota,
      gia,
      boxes: boxes || [],
    });

    const savedWeddingCard = await newWeddingCard.save();
    res.status(201).json({ message: 'Thiệp cưới đã được thêm thành công.', data: savedWeddingCard });
  } catch (error) {
    console.error('Lỗi khi thêm thiệp cưới:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm thiệp cưới.', error: error.message });
  }
};

// Lấy danh sách thiệp cưới
const getTc = async (req, res) => {
  try {
    const weddingCards = await WeddingCardModel.find();
    res.status(200).json({ message: 'Lấy danh sách thiệp cưới thành công.', data: weddingCards });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thiệp cưới:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách thiệp cưới.', error });
  }
};

// Xóa thiệp cưới
const deleteTc = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }

    const deletedWeddingCard = await WeddingCardModel.findByIdAndDelete(id);
    if (!deletedWeddingCard) {
      return res.status(404).json({ message: 'Không tìm thấy thiệp cưới với ID đã cho.' });
    }

    res.status(200).json({ message: 'Thiệp cưới đã được xóa thành công.', data: deletedWeddingCard });
  } catch (error) {
    console.error('Lỗi khi xóa thiệp cưới:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa thiệp cưới.', error });
  }
};

// Cập nhật thông tin thiệp cưới
const updateTc = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, image, image2, mota, gia, boxes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }

    const weddingCard = await WeddingCardModel.findById(id);
    if (!weddingCard) {
      return res.status(404).json({ message: 'Không tìm thấy thiệp cưới.' });
    }

    if (name) weddingCard.name = name;
    if (category) weddingCard.category = category;
    if (image) weddingCard.image = image;
    if (image2) weddingCard.image2 = image2;
    if (mota) weddingCard.mota = mota;
    if (gia !== undefined) weddingCard.gia = gia;
    if (boxes && Array.isArray(boxes)) {
      weddingCard.boxes = boxes;
    }

    const updatedWeddingCard = await weddingCard.save();
    res.status(200).json({ message: 'Thiệp cưới đã được cập nhật thành công.', data: updatedWeddingCard });
  } catch (error) {
    console.error('Lỗi khi cập nhật thiệp cưới:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thiệp cưới.', error });
  }
};

const saveCustomizedCard = async (req, res) => {
  try {
    const { userId, weddingCardId, boxes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(weddingCardId)) {
      return res.status(400).json({ message: 'ID không hợp lệ.' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const cardIndex = user.customizedCards.findIndex(
      (item) => item.cardId.toString() === weddingCardId
    );

    if (cardIndex !== -1) {
      user.customizedCards[cardIndex].boxes = boxes;
    } else {
      user.customizedCards.push({ cardId: weddingCardId, boxes });
    }

    await user.save();
    res.status(200).json({
      message: 'Lưu thiệp cưới đã chỉnh sửa thành công.',
      customizedCards: user.customizedCards,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lưu thiệp cưới.', error: error.message });
  }
};



 const getCustomizedCards = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kiểm tra tính hợp lệ của `userId`
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }

    // Tìm user và populate danh sách customizedCards
    const user = await UserModel.findById(userId).populate('customizedCards.cardId');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({
      message: 'Lấy danh sách thiệp cưới đã chỉnh sửa thành công.',
      customizedCards: user.customizedCards,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thiệp cưới đã chỉnh sửa:', error);
    res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy danh sách thiệp cưới đã chỉnh sửa.',
      error: error.message,
    });
  }
}

  const getCardCountByCategory = async (req, res) => {
    try {
      // Sử dụng aggregate để nhóm dữ liệu theo danh mục và đếm số lượng
      const cardCounts = await WeddingCardModel.aggregate([
        {
          $group: {
            _id: "$category", // Nhóm theo trường `category`
            count: { $sum: 1 }, // Đếm số lượng
          },
        },
        {
          $sort: { count: -1 }, // Sắp xếp giảm dần theo số lượng
        },
      ]);
  
      res.status(200).json({
        message: "Lấy số lượng thiệp cưới theo danh mục thành công.",
        data: cardCounts,
      });
    } catch (error) {
      console.error("Lỗi khi lấy số lượng thiệp cưới theo danh mục:", error);
      res.status(500).json({
        message: "Đã xảy ra lỗi khi lấy số lượng thiệp cưới theo danh mục.",
        error: error.message,
      });
    }
  };

  const addBoxToProduct = async (req, res) => {
    try {
      const { productId, box } = req.body; // Lấy ID sản phẩm và thông tin box từ request
  
      // Tìm sản phẩm theo ID và thêm box vào danh sách
      const updatedProduct = await WeddingCardModel.findByIdAndUpdate(
        productId,
        { $push: { boxes: box } }, // Thêm box vào danh sách `boxes`
        { new: true } // Trả về document đã cập nhật
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
      }
  
      res.status(200).json({ message: 'Thêm box thành công.', product: updatedProduct });
    } catch (error) {
      console.error('Lỗi khi thêm box:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi.', error: error.message });
    }
  };
  
  // Xuất tất cả các API
  export { addTc, getTc, deleteTc, updateTc, saveCustomizedCard, getCustomizedCards, getCardCountByCategory, addBoxToProduct };
  