const multer = require('multer');
const path = require('path');

// Menentukan lokasi penyimpanan gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Menyimpan gambar di folder 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Menyimpan dengan nama unik
    }
});

// Menentukan filter untuk hanya menerima file gambar
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diizinkan'), false);
    }
};

// Membuat middleware multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
