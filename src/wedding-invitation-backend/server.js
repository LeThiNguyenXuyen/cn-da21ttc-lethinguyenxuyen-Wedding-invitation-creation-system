// Import các module cần thiết
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import thiepcuoirouter from './routes/thiepcuoiRoute.js';
import favoritesrouter from './routes/favoritesRoute.js';
import dotenv from 'dotenv';

// Config
const port = process.env.PORT || 5000;
const app = express();
dotenv.config();
connectDB();

// Cấu hình CORS: Cho phép tất cả các domain
app.use(cors()); // Chấp nhận tất cả các domain
app.options('*', cors()); // Đảm bảo xử lý preflight requests

// Middleware
app.use(express.json({ limit: '50mb' })); // Tăng giới hạn JSON payload lên 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Tăng giới hạn form data

// API Endpoint
app.get('/', (req, res) => {
  res.send('API WORKING');
});

// Đặt các route API
app.use('/api/users', userRouter);
app.use('/api/thiepcuoi', thiepcuoirouter);
app.use('/api/yeuthich', favoritesrouter);
// Start Server
app.listen(port, () => console.log('Server running on port: ' + port));
