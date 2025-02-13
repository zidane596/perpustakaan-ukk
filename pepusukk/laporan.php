<?php
session_start();
include 'koneksi.php';
require_once('vendor/tecnickcom/tcpdf/tcpdf.php');

// Cek apakah pengguna sudah login dan memiliki peran yang sesuai
if (!isset($_SESSION['Username']) || !isset($_SESSION['role']) || 
    ($_SESSION['role'] != 'superadmin' && $_SESSION['role'] != 'administrator' && $_SESSION['role'] != 'petugas')) {
    header("Location: login.php");
    exit();
}

// Buat dokumen PDF baru
class MYPDF extends TCPDF {
    public function Header() {
        $this->SetFont('helvetica', 'B', 16);
        $this->Cell(0, 15, 'Laporan Peminjaman Buku Perpustakaan Digital', 0, true, 'C', 0, '', 0, false, 'M', 'M');
        $this->Ln(10);
    }

    public function Footer() {
        $this->SetY(-15);
        $this->SetFont('helvetica', 'I', 8);
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }
}

if (isset($_POST['generate'])) {
    // Filter tanggal
    $startDate = isset($_POST['start_date']) ? $_POST['start_date'] : '';
    $endDate = isset($_POST['end_date']) ? $_POST['end_date'] : '';
    
    // Buat dokumen PDF baru
    $pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

    // Set informasi dokumen
    $pdf->SetCreator(PDF_CREATOR);
    $pdf->SetAuthor('Perpustakaan Digital');
    $pdf->SetTitle('Laporan Peminjaman Buku');

    // Set margin
    $pdf->SetMargins(15, 40, 15);
    $pdf->SetHeaderMargin(20);
    $pdf->SetFooterMargin(15);

    // Tambahkan halaman
    $pdf->AddPage();

    // Set font
    $pdf->SetFont('helvetica', '', 10);

    // Tambahkan informasi filter
    if ($startDate && $endDate) {
        $pdf->Cell(0, 10, 'Periode: ' . date('d/m/Y', strtotime($startDate)) . ' - ' . date('d/m/Y', strtotime($endDate)), 0, 1, 'L');
    }
    $pdf->Ln(5);

    // Buat header tabel
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->Cell(10, 7, 'No', 1, 0, 'C');
    $pdf->Cell(50, 7, 'Judul Buku', 1, 0, 'C');
    $pdf->Cell(40, 7, 'Peminjam', 1, 0, 'C');
    $pdf->Cell(30, 7, 'Tgl Pinjam', 1, 0, 'C');
    $pdf->Cell(30, 7, 'Tgl Kembali', 1, 0, 'C');
    $pdf->Cell(25, 7, 'Status', 1, 1, 'C');

    // Query untuk mengambil data
    $query = "SELECT p.*, b.Judul, u.Username 
              FROM peminjaman p 
              JOIN buku b ON p.BukuID = b.BukuID 
              JOIN user u ON p.UserID = u.UserID";
    
    // Jika user bukan admin/petugas, hanya menampilkan data sendiri
    if (!isset($_SESSION['role']) || ($_SESSION['role'] != 'superadmin' && $_SESSION['role'] != 'administrator' && $_SESSION['role'] != 'petugas')) {
        $query .= " WHERE p.UserID = ?";
        if ($startDate && $endDate) {
            $query .= " AND p.TanggalPeminjaman BETWEEN ? AND ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("iss", $_SESSION['UserID'], $startDate, $endDate);
        } else {
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $_SESSION['UserID']);
        }
    } else {
        if ($startDate && $endDate) {
            $query .= " WHERE p.TanggalPeminjaman BETWEEN ? AND ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("ss", $startDate, $endDate);
        } else {
            $stmt = $conn->prepare($query);
        }
    }
    
    $stmt->execute();
    $result = $stmt->get_result();

    // Tambahkan baris tabel
    $pdf->SetFont('helvetica', '', 10);
    $no = 1;
    while ($row = $result->fetch_assoc()) {
        $pdf->Cell(10, 7, $no, 1, 0, 'C');
        $pdf->Cell(50, 7, $row['Judul'], 1, 0, 'L');
        $pdf->Cell(40, 7, $row['Username'], 1, 0, 'L');
        $pdf->Cell(30, 7, date('d/m/Y', strtotime($row['TanggalPeminjaman'])), 1, 0, 'C');
        $pdf->Cell(30, 7, $row['TanggalPengembalian'] ? date('d/m/Y', strtotime($row['TanggalPengembalian'])) : '-', 1, 0, 'C');
        $pdf->Cell(25, 7, ucfirst($row['StatusPeminjaman']), 1, 1, 'C');
        $no++;
    }

    // Output dokumen PDF
    $pdf->Output('laporan_peminjaman.pdf', 'D');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laporan Peminjaman</title>
    <link rel="stylesheet" href="beranda.css">
    <style>
        .content {
            padding: 20px;
        }

        .filter-form {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #16404D;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .form-group input:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .btn-generate {
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: background-color 0.3s ease;
            width: 100%;
        }

        .btn-generate:hover {
            background-color: #0056b3;
        }

        .note {
            margin-top: 15px;
            color: #666;
            font-style: italic;
            background: #fff;
            padding: 10px;
            border-radius: 4px;
            border-left: 4px solid #007bff;
        }

        h2 {
            color: #16404D;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid ;
        }

        .form-container {
            max-width: 500px;
            margin: 0 auto;
        }

        @media (max-width: 768px) {
            .form-container {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Perpustakaan Digital</h1>
    </div>
    <?php include 'sidebar.php'; ?>
    <div class="content">
        <h2>Generate Laporan Peminjaman</h2>
        <?php if (!isset($_SESSION['role']) || ($_SESSION['role'] != 'superadmin' && $_SESSION['role'] != 'administrator' && $_SESSION['role'] != 'petugas')): ?>
            <p class="note">Anda hanya dapat melihat riwayat peminjaman Anda sendiri.</p>
        <?php endif; ?>
        
        <div class="form-container">
            <div class="filter-form">
                <form method="POST">
                    <div class="form-group">
                        <label for="start_date">Tanggal Mulai:</label>
                        <input type="date" id="start_date" name="start_date" required>
                    </div>
                    <div class="form-group">
                        <label for="end_date">Tanggal Akhir:</label>
                        <input type="date" id="end_date" name="end_date" required>
                    </div>
                    <button type="submit" name="generate" class="btn-generate">Generate PDF</button>
                </form>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>Copyright &copy; 2025 | Perpustakaan Digital</p>
    </div>
</body>
</html> 