import jwt from 'jsonwebtoken';

// Lấy secret từ file .env hoặc cấu hình
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware xác thực token
const verifyToken = (req, res, next) => {
  // Lấy token từ Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Tách "Bearer <token>"
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
  }

  try {
    // Giải mã và xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Lưu thông tin người dùng đã xác thực vào req.user
    req.user = decoded;

    // Tiếp tục xử lý các middleware hoặc route tiếp theo
    next();
  } catch (error) {
    // Token không hợp lệ hoặc đã hết hạn
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

export default verifyToken;
