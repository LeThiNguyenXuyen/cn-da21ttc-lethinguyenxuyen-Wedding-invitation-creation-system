import express from 'express';
import multer from 'multer';
import { addTc, getTc, deleteTc, saveCustomizedCard, getCustomizedCards, getCardCountByCategory, addBoxToProduct } from '../controllers/thiepcuoiController.js';

const thiepcuoirouter = express.Router();

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh.'));
    }
  },
});

// Thêm thiệp (có upload file)
thiepcuoirouter.post('/add', upload.single('file'), addTc);

// Lấy danh sách thiệp
thiepcuoirouter.get('/get', getTc);

// Xóa thiệp
thiepcuoirouter.delete('/delete/:id', deleteTc);

// Lưu thiệp chỉnh sửa
thiepcuoirouter.post('/customized/save', saveCustomizedCard);

// Lấy danh sách thiệp cưới đã chỉnh sửa
thiepcuoirouter.get('/customized/:userId', getCustomizedCards);

// Lấy danh sách thiệp cưới đã chỉnh sửa
thiepcuoirouter.get('/getcount', getCardCountByCategory);

thiepcuoirouter.post('/addbox', addBoxToProduct);


export default thiepcuoirouter;
