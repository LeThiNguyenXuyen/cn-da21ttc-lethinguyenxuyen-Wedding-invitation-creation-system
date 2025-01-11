import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kiểm tra xem người dùng đã tồn tại
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const user = await userModel.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).json({ success: true, message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm người dùng bằng email hoặc username
    const user = await userModel.findOne({ $or: [{ username }, { email: username }] });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({ success: true, message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  // Lấy thông tin từ file .env
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Kiểm tra thông tin đăng nhập
  if (username === adminUsername && password === adminPassword) {
    res.status(200).json({ message: 'Đăng nhập thành công!', token: 'your_generated_token' });
  } else {
    res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
  }
};



// API để lấy thông tin người dùng
const getAllUsers = async (req, res) => {
  try {
    // Tìm tất cả người dùng trong cơ sở dữ liệu
    const users = await userModel.find({}, '_id username email created_at updated_at');

    // Trả về danh sách người dùng
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách người dùng thành công',
      users: users,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};



const getUserCount = async (req, res) => {
  try {
    // Đếm số lượng người dùng trong cơ sở dữ liệu
    const userCount = await userModel.countDocuments();

    // Trả về kết quả
    res.status(200).json({
      success: true,
      message: 'Lấy số lượng người dùng thành công',
      count: userCount,
    });
  } catch (error) {
    console.error('Lỗi khi lấy số lượng người dùng:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy số lượng người dùng',
      error: error.message,
    });
  }
};

export { registerUser, loginUser, getAllUsers, getUserCount, loginAdmin};
