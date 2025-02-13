const model = require('../model/init-models');
const sequelize = require('../config/databases');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { peminjaman, user, buku } = model.initModels(sequelize);

const generateLaporan = async (req, res) => {
    const { tahun, bulan } = req.params;

    try {
        console.log(`Mencari data peminjaman untuk ${tahun}-${bulan}...`);

        const peminjamanData = await peminjaman.findAll({
            where: sequelize.where(
                sequelize.fn('DATE_FORMAT', sequelize.col('TanggalPeminjaman'), '%Y-%m'),
                `${tahun}-${bulan}`
            ),
            include: [
                { model: user, as: "User", attributes: ['Username'] },
                { model: buku, as: "Buku", attributes: ['Judul'] }
            ]
        });

        if (peminjamanData.length === 0) {
            console.log("Tidak ada data peminjaman.");
            return res.status(404).json({ message: 'Tidak ada data peminjaman untuk bulan ini.' });
        }

        console.log("Mulai membuat file PDF...");

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Laporan_Peminjaman_${bulan}-${tahun}.pdf`);

        const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
        doc.pipe(res);

        // Tambahkan Judul dan Keterangan
        doc.fontSize(16).font('Helvetica-Bold').text(`Laporan Peminjaman Buku`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).font('Helvetica').text(`Bulan: ${bulan} - Tahun: ${tahun}`, { align: 'center' });
        doc.moveDown(2);

        const tableTop = 200;
        const tableLeft = 50;
        const colWidths = [30, 120, 150, 150, 150, 100]; // Lebar kolom
        const rowHeight = 25; // Tinggi baris
        const padding = 5; // Padding dalam sel

        doc.fontSize(12).font('Helvetica-Bold');

        // Header Tabel
        const headers = ['No', 'Nama Peminjam', 'Judul Buku', 'Tanggal Peminjaman', 'Tanggal Pengembalian', 'Status'];
        let xPos = tableLeft;
        headers.forEach((header, i) => {
            doc.text(header, xPos + padding, tableTop + padding, { width: colWidths[i] - 2 * padding, align: 'left' });
            xPos += colWidths[i];
            doc.moveTo(xPos, tableTop).lineTo(xPos, tableTop + (peminjamanData.length + 1) * rowHeight).stroke();
        });

        // Gambar border header
        const tableWidth = colWidths.reduce((a, b) => a + b, 0);
        doc.rect(tableLeft, tableTop, tableWidth, rowHeight).stroke();

        // Isi Tabel
        let yPosition = tableTop + rowHeight;
        doc.font('Helvetica');

        peminjamanData.forEach((p, index) => {
            let xPos = tableLeft;
            
            // Data dalam tabel
            const row = [
                index + 1,
                p.User.Username,
                p.Buku.Judul,
                p.TanggalPeminjaman,
                p.TanggalPengembalian,
                p.StatusPeminjaman
            ];
            
            row.forEach((text, i) => {
                doc.text(text.toString(), xPos + padding, yPosition + padding, { width: colWidths[i] - 2 * padding, align: 'left' });
                xPos += colWidths[i];
                doc.moveTo(xPos, yPosition).lineTo(xPos, yPosition + rowHeight).stroke();
            });
            
            // Gambar border per baris
            doc.rect(tableLeft, yPosition, tableWidth, rowHeight).stroke();
            
            yPosition += rowHeight;
        });

        // Simpan PDF
        doc.end();

        console.log("File PDF berhasil dikirim.");

    } catch (error) {
        console.error('Error in generateLaporan:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat laporan.' });
    }
};

module.exports = { generateLaporan };
