const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder tempat file disimpan
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Filter file untuk memastikan hanya gambar diterima
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Terima file
    } else {
        cb(new Error('File harus berupa gambar!'), false); // Tolak file
    }
};

// Inisialisasi Multer
const upload = multer({ storage, fileFilter });

module.exports = upload;
