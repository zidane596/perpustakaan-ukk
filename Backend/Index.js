const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/Auth.js');
const bukuRoutes = require('./routes/Buku.js');
const kategoriRoutes = require('./routes/Kategori.js');
const koleksiRoutes = require('./routes/KoleksiRout.js');
const ulasanRoutes = require('./routes/UlasanRout.js');
const userRoutes = require('./routes/UserRout.js');
const peminjamanRoutes = require('./routes/PeminjamanRout.js');
const generateraport = require('./routes/generateraportRout.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET','PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Routes
app.use('/api', authRoutes);
app.use('/api', bukuRoutes);
app.use('/api', kategoriRoutes);
app.use('/api', koleksiRoutes);
app.use('/api', peminjamanRoutes);
app.use('/api', ulasanRoutes);
app.use('/api', userRoutes);
app.use('/api', generateraport);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

