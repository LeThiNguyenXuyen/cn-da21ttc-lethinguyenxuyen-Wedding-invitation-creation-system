import express from 'express';
import { registerUser, loginUser, getAllUsers, getUserCount, loginAdmin } from '../controllers/userController.js';

const router = express.Router();

// Route đăng ký
router.post('/register', registerUser);

// Route đăng nhập
router.post('/login', loginUser);

// Lấy thông tin người dùng
router.get('/info', getAllUsers);

router.get('/countuser', getUserCount);

router.post('/loginadmin', loginAdmin);

export default router;
