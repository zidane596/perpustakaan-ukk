const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/Auth');
const bukuRoutes = require('./routes/Buku');
const kategoriRoutes = require('./routes/Kategori');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/buku', bukuRoutes);
app.use('/kategori', kategoriRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
