import express from 'express';
import { addFavorite, getFavorites, deleteFavorite } from '../controllers/favoritesController.js';

const favoritesrouter = express.Router();

// Thêm thiệp cưới vào danh sách yêu thích
favoritesrouter.post('/add', addFavorite);

// Lấy danh sách thiệp cưới yêu thích
favoritesrouter.get('/:userId', getFavorites);

// Xóa thiệp cưới khỏi danh sách yêu thích
favoritesrouter.post('/remove', deleteFavorite);

export default favoritesrouter;
