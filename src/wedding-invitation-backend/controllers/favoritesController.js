import userModel from '../models/userModel.js';
import WeddingCardModel from '../models/thiepcuoiModel.js';
import mongoose from 'mongoose'; // Import mongoose

const addFavorite = async (req, res) => {
    try {
      const { userId, weddingCardId } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(weddingCardId)) {
        return res.status(400).json({ message: 'UserId hoặc WeddingCardId không hợp lệ.' });
      }
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      }
  
      const weddingCard = await WeddingCardModel.findById(weddingCardId);
      if (!weddingCard) {
        return res.status(404).json({ message: 'Không tìm thấy thiệp cưới.' });
      }
  
      if (user.favorites.includes(weddingCardId)) {
        return res.status(400).json({ message: 'Thiệp cưới đã có trong danh sách yêu thích.' });
      }
  
      user.favorites.push(weddingCardId);
      await user.save();
  
      res.status(200).json({
        message: 'Thiệp cưới đã được thêm vào danh sách yêu thích.',
        favorites: user.favorites,
      });
    } catch (error) {
      console.error('Lỗi khi thêm thiệp cưới vào danh sách yêu thích:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi thêm thiệp cưới.' });
    }
  };
  

// Lấy danh sách thiệp cưới yêu thích
const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm người dùng và populate danh sách yêu thích
    const user = await userModel.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({
      message: 'Lấy danh sách thiệp cưới yêu thích thành công.',
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thiệp cưới yêu thích:', error);
    res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy danh sách thiệp cưới yêu thích.',
      error: error.message,
    });
  }
};

// Xóa thiệp cưới khỏi danh sách yêu thích
const deleteFavorite = async (req, res) => {
  try {
    const { userId, weddingCardId } = req.body;

    // Tìm người dùng
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    // Xóa thiệp cưới khỏi danh sách yêu thích
    user.favorites = user.favorites.filter(
      (favoriteId) => favoriteId.toString() !== weddingCardId
    );
    await user.save();

    res.status(200).json({
      message: 'Thiệp cưới đã được xóa khỏi danh sách yêu thích.',
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Lỗi khi xóa thiệp cưới khỏi danh sách yêu thích:', error);
    res.status(500).json({
      message: 'Đã xảy ra lỗi khi xóa thiệp cưới khỏi danh sách yêu thích.',
      error: error.message,
    });
  }
};

export { addFavorite, getFavorites, deleteFavorite };
