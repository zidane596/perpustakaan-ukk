const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/Auth');
const bukuRoutes = require('./routes/Buku');
const kategoriRoutes = require('./routes/Kategori');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET','PUT', 'DELETE'], 
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buku', bukuRoutes);
app.use('/api/kategori', kategoriRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
