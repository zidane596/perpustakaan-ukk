<?php
session_start();
include 'koneksi.php';

// Check jika user sudah login
if (!isset($_SESSION['Username'])) {
    header("Location: login.php");
    exit();
}

$userId = $_SESSION['UserID'];

// Handle peminjaman buku
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['pinjam'])) {
    $bukuId = $_POST['bukuId'];
    
    // Set timezone ke Asia/Jakarta
    date_default_timezone_set('Asia/Jakarta');
    
    // Dapatkan tanggal saat ini
    $currentDate = new DateTime();
    $tanggalPeminjaman = $currentDate->format('Y-m-d');
    
    $stmt = $conn->prepare("INSERT INTO peminjaman (UserID, BukuID, TanggalPeminjaman, StatusPeminjaman) VALUES (?, ?, ?, 'dipinjam')");
    $stmt->bind_param("iis", $userId, $bukuId, $tanggalPeminjaman);
    
    if ($stmt->execute()) {
        $success_message = "Buku berhasil dipinjam";
    } else {
        $error_message = "Gagal meminjam buku";
    }
}

// Handle pengembalian buku
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['kembali'])) {
    $peminjamanId = $_POST['peminjamanId'];
    
    // Set timezone ke Asia/Jakarta
    date_default_timezone_set('Asia/Jakarta');
    
    // Dapatkan tanggal saat ini untuk pengembalian
    $currentDate = new DateTime();
    $tanggalPengembalian = $currentDate->format('Y-m-d');
    
    $stmt = $conn->prepare("UPDATE peminjaman SET StatusPeminjaman = 'dikembalikan', TanggalPengembalian = ? WHERE PeminjamanID = ? AND UserID = ?");
    $stmt->bind_param("sii", $tanggalPengembalian, $peminjamanId, $userId);
    
    if ($stmt->execute()) {
        $success_message = "Buku berhasil dikembalikan";
    } else {
        $error_message = "Gagal mengembalikan buku";
    }
}

// Handle review buku
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit_review'])) {
    $bukuId = $_POST['bukuId'];
    $ulasan = $_POST['ulasan'];
    $rating = $_POST['rating'];
    
    // Cek apakah user sudah memberikan ulasan untuk buku ini
    $checkStmt = $conn->prepare("SELECT UlasanID FROM ulasanbuku WHERE UserID = ? AND BukuID = ?");
    $checkStmt->bind_param("ii", $userId, $bukuId);
    $checkStmt->execute();
    
    if ($checkStmt->get_result()->num_rows > 0) {
        $error_message = "Anda sudah memberikan ulasan untuk buku ini";
    } else {
        $stmt = $conn->prepare("INSERT INTO ulasanbuku (UserID, BukuID, Ulasan, Rating) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iisi", $userId, $bukuId, $ulasan, $rating);
        
        if ($stmt->execute()) {
            $success_message = "Ulasan berhasil ditambahkan";
        } else {
            $error_message = "Gagal menambahkan ulasan";
        }
    }
}

// Dapatkan semua kategori
$categories = $conn->query("SELECT DISTINCT NamaKategori FROM kategoribuku ORDER BY NamaKategori ASC");

// Dapatkan buku yang tersedia
$books = $conn->query("
    SELECT b.*, 
           GROUP_CONCAT(DISTINCT k.NamaKategori SEPARATOR ', ') as Kategori,
           COALESCE(AVG(ub.Rating), 0) as AvgRating,
           COUNT(DISTINCT ub.UlasanID) as RatingCount
    FROM buku b
    LEFT JOIN kategoribuku_relasi kr ON b.BukuID = kr.BukuID
    LEFT JOIN kategoribuku k ON kr.KategoriID = k.KategoriID
    LEFT JOIN ulasanbuku ub ON b.BukuID = ub.BukuID
    GROUP BY b.BukuID, b.Judul, b.Penulis, b.Penerbit, b.TahunTerbit
    ORDER BY b.Judul ASC
");

// Dapatkan buku yang dipinjam oleh user
$stmt = $conn->prepare("
    SELECT p.*, 
           b.Judul, b.Penulis, b.Penerbit, b.TahunTerbit,
           GROUP_CONCAT(DISTINCT k.NamaKategori SEPARATOR ', ') as Kategori,
           COALESCE(AVG(ub.Rating), 0) as AvgRating,
           COUNT(DISTINCT ub.UlasanID) as RatingCount
    FROM peminjaman p
    JOIN buku b ON p.BukuID = b.BukuID
    LEFT JOIN kategoribuku_relasi kr ON b.BukuID = kr.BukuID
    LEFT JOIN kategoribuku k ON kr.KategoriID = k.KategoriID
    LEFT JOIN ulasanbuku ub ON b.BukuID = ub.BukuID
    WHERE p.UserID = ?
    GROUP BY p.PeminjamanID, b.BukuID, b.Judul, b.Penulis, b.Penerbit, b.TahunTerbit
    ORDER BY p.StatusPeminjaman ASC, p.TanggalPeminjaman DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$borrowed = $stmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Buku</title>
    <link rel="stylesheet" href="beranda.css">
    <!-- Add Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <style>
        .content {
            padding: 20px;
        }
        
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        
        .alert-error {
            background-color: #fee;
            color: #e33;
            border: 1px solid #fcc;
        }
        
        .alert-success {
            background-color: #efe;
            color: #3c3;
            border: 1px solid #cfc;
        }

        .filter-container {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .ngiri {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .filter-select, .search-input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            min-width: 150px;
        }

        .btn-filter, .btn-search {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #007bff;
            color: white;
        }

        .btn-filter:hover, .btn-search:hover {
            background: #0056b3;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        th {
            background-color: #007bff;
            color: white;
            font-weight: 600;
            padding: 15px;
            text-align: left;
        }

        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }

        tr:hover {
            background-color: #f8f9fa;
        }

        .rating-stars {
            color: #ffc107;
            letter-spacing: 2px;
        }

        .rating-text {
            color: #666;
            margin-left: 5px;
            font-size: 0.9em;
        }

        .btn-pinjam {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }

        .btn-pinjam:hover {
            background-color: #0056b3;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .book-link {
            color: #007bff;
            text-decoration: none;
            font-weight: 500;
        }

        .book-link:hover {
            color: #0056b3;
            text-decoration: underline;
        }

        .no-results {
            display: none;
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin: 20px 0;
            color: #666;
        }

        .no-results i {
            font-size: 48px;
            color: #007bff;
            margin-bottom: 10px;
            display: block;
        }

        .no-results h3 {
            color: #333;
            margin-bottom: 10px;
        }

        .no-results p {
            color: #666;
            margin-bottom: 0;
        }

        .reviews-section {
            flex-direction: column;
            gap: 15px;
        }
        
        .review-form {
            margin-top: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .rating-input {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .rating-input label {
            min-width: 60px;
            margin: 0;
            color: #666;
            font-weight: 600;
        }
        
        .rating-input select {
            flex: 1;
            max-width: 200px;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
            font-size: 14px;
            color: #333;
        }
        
        .review-input {
            margin-bottom: 15px;
        }
        
        .review-input label {
            display: block;
            margin-bottom: 8px;
            color: #666;
            font-weight: 600;
        }
        
        .review-input textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            min-height: 80px;
            resize: vertical;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .review-input textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        
        .btn-submit-review {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }
        
        .btn-submit-review:hover {
            background-color: #218838;
            transform: translateY(-1px);
        }
        
        .btn-submit-review i {
            font-size: 14px;
        }
        
        .review-list {
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }
        
        .review-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .review-item:last-child {
            border-bottom: none;
        }
        
        .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .review-author {
            font-weight: 600;
            color: #16404D;
        }
        
        .review-rating {
            color: #ffc107;
            font-size: 14px;
            letter-spacing: 2px;
        }
        
        .review-content {
            color: #666;
            line-height: 1.5;
            font-size: 14px;
        }

        /* Modal Styles */
        .book-modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            position: relative;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: modalFadeIn 0.3s ease;
            overflow-y: auto;
        }

        /* Styling scrollbar untuk modal */
        .modal-content::-webkit-scrollbar {
            width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
            background: #666;
        }

        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .close-btn {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }

        .close-btn:hover {
            color: #333;
        }

        .book-details {
            margin-top: 20px;
        }

        .book-title {
            font-size: 24px;
            color: #16404D;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #007bff;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .book-title i {
            color: #007bff;
        }

        .detail-row {
            display: flex;
            margin-bottom: 15px;
            align-items: center;
            padding: 10px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .detail-row:hover {
            background-color: #f8f9fa;
        }

        .detail-label {
            width: 120px;
            color: #666;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .detail-label i {
            width: 20px;
            color: #007bff;
            text-align: center;
        }

        .detail-value {
            flex: 1;
            color: #333;
        }

        .modal-footer {
            margin-top: 30px;
            text-align: right;
        }

        .btn-pinjam-modal {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        }

        .btn-pinjam-modal:hover {
            background-color: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .btn-pinjam-modal i {
            font-size: 16px;
        }

        .btn-kembali {
            background-color: #ff9800;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-kembali:hover {
            background-color: #f57c00;
        }

        .status-dipinjam {
            color: #ff9800;
            font-weight: bold;
        }

        .status-dikembalikan {
            color: #4CAF50;
            font-weight: bold;
        }

        h2 {
            color: #333;
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #4CAF50;
        }

        .mt-4 {
            margin-top: 2rem;
        }

        .btn-show-reviews {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
            transition: all 0.3s ease;
        }

        .btn-show-reviews:hover {
            background-color: #5a6268;
            transform: translateY(-1px);
        }

        .reviews-title {
            font-size: 20px;
            color: #16404D;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #007bff;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .reviews-title i {
            color: #ffc107;
        }

        .btn-detail {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
            font-size: 14px;
        }

        .btn-detail:hover {
            background-color: #5a6268;
        }

        .btn-edit-review {
            background-color: #ffc107;
            color: #000;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
        }

        .btn-edit-review:hover {
            background-color: #ffb300;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Perpustakaan Digital</h1>
    </div>
    <?php include 'sidebar.php'; ?>
    <div class="content">
        <?php if (isset($error_message)): ?>
            <div class="alert alert-error">
                <?php echo $error_message; ?>
            </div>
        <?php endif; ?>

        <?php if (isset($success_message)): ?>
            <div class="alert alert-success">
                <?php echo $success_message; ?>
            </div>
        <?php endif; ?>

        <h2>Daftar Buku yang Tersedia</h2>
        <p>Berikut adalah daftar buku yang tersedia di perpustakaan:</p>

        <!-- Filter Buku -->
        <div class="filter-container">
            <div class="ngiri">
                <select id="filter-kategori" class="filter-select">
                    <option value="all">Semua Kategori</option>
                    <?php while($category = $categories->fetch_assoc()): ?>
                        <option value="<?php echo strtolower($category['NamaKategori']); ?>">
                            <?php echo $category['NamaKategori']; ?>
                        </option>
                    <?php endwhile; ?>
                </select>
                <button class="btn-filter" onclick="filterBuku()">Filter</button>
                <input type="text" id="search-judul" class="search-input" placeholder="Cari Judul Buku...">
                <button class="btn-search" onclick="searchBuku()">Search</button>
            </div>
        </div>

        <!-- Tabel List Buku -->
        <table id="tabel-buku">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Judul Buku</th>
                    <th>Penulis</th>
                    <th>Penerbit</th>
                    <th>Tahun Terbit</th>
                    <th>Kategori</th>
                    <th>Rating</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                $no = 1;
                while($book = $books->fetch_assoc()): 
                    $rating = round($book['AvgRating']);
                    $ratingText = $rating > 0 ? "(" . $rating . "/5)" : "";
                    $stars = str_repeat("★", $rating) . str_repeat("☆", 5 - $rating);
                ?>
                <tr data-kategori="<?php echo strtolower($book['Kategori'] ?? ''); ?>">
                    <td><?php echo $no++; ?></td>
                    <td>
                        <a href="javascript:void(0)" class="book-link" onclick='showBookDetail(<?php echo json_encode($book); ?>)'>
                            <?php echo htmlspecialchars($book['Judul']); ?>
                        </a>
                    </td>
                    <td><?php echo htmlspecialchars($book['Penulis']); ?></td>
                    <td><?php echo htmlspecialchars($book['Penerbit']); ?></td>
                    <td><?php echo $book['TahunTerbit']; ?></td>
                    <td><?php echo htmlspecialchars($book['Kategori'] ?? 'Tidak ada kategori'); ?></td>
                    <td>
                        <span class="rating-stars"><?php echo $stars; ?></span>
                        <span class="rating-text"><?php echo $ratingText; ?></span>
                    </td>
                    <td>
                        <button onclick='showBookDetail(<?php echo json_encode($book); ?>)' class="btn-pinjam">
                            <i class="fas fa-info-circle"></i> Detail
                        </button>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

        <div id="noResults" class="no-results">
            <i class="fas fa-search"></i>
            <h3>Tidak Ada Hasil</h3>
            <p>Maaf, buku yang Anda cari tidak ditemukan.</p>
            <p>Coba gunakan kata kunci lain atau reset filter.</p>
        </div>

        <h2 class="" style="margin-top: 100px;">Riwayat Peminjaman</h2>
        <table id="tabel-pinjaman">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Judul Buku</th>
                    <th>Tanggal Pinjam</th>
                    <th>Tanggal Kembali</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                $no = 1;
                while($pinjam = $borrowed->fetch_assoc()): 
                ?>
                <tr>
                    <td><?php echo $no++; ?></td>
                    <td><?php echo htmlspecialchars($pinjam['Judul']); ?></td>
                    <td><?php echo date('d/m/Y', strtotime($pinjam['TanggalPeminjaman'])); ?></td>
                    <td><?php echo $pinjam['TanggalPengembalian'] ? date('d/m/Y', strtotime($pinjam['TanggalPengembalian'])) : '-'; ?></td>
                    <td class="status-<?php echo strtolower($pinjam['StatusPeminjaman']); ?>">
                        <?php echo ucfirst($pinjam['StatusPeminjaman']); ?>
                    </td>
                    <td>
                        <button onclick='showBorrowedDetail(<?php echo json_encode($pinjam); ?>)' class="btn-detail">
                            <i class="fas fa-info-circle"></i> Detail
                        </button>
                        <?php if ($pinjam['StatusPeminjaman'] == 'dipinjam'): ?>
                            <form method="POST" style="display: inline;">
                                <input type="hidden" name="peminjamanId" value="<?php echo $pinjam['PeminjamanID']; ?>">
                                <button type="submit" name="kembali" class="btn-kembali">
                                    <i class="fas fa-undo"></i> Kembalikan
                                </button>
                            </form>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Copyright &copy; 2025 | Perpustakaan Digital</p>
    </div>

    <!-- Book Detail Modal -->
    <div id="bookDetailModal" class="book-modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal()">&times;</span>
            <div class="book-details">
                <h3 class="book-title">
                    <i class="fas fa-book"></i>
                    <span id="modalBookTitle"></span>
                </h3>
                <div class="detail-row">
                    <div class="detail-label">
                        <i class="fas fa-user-edit"></i>
                        Penulis
                    </div>
                    <div class="detail-value" id="modalBookAuthor"></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">
                        <i class="fas fa-building"></i>
                        Penerbit
                    </div>
                    <div class="detail-value" id="modalBookPublisher"></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">
                        <i class="fas fa-calendar-alt"></i>
                        Tahun
                    </div>
                    <div class="detail-value" id="modalBookYear"></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">
                        <i class="fas fa-bookmark"></i>
                        Kategori
                    </div>
                    <div class="detail-value" id="modalBookCategory"></div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">
                        <i class="fas fa-star"></i>
                        Rating
                    </div>
                    <div class="detail-value">
                        <span class="rating-stars" id="modalBookRating"></span>
                        <button onclick="showReviews()" class="btn-show-reviews">
                            <i class="fas fa-comments"></i> Lihat Ulasan
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <form method="POST" id="modalPinjamForm">
                        <input type="hidden" name="bukuId" id="modalBookId">
                        <button type="submit" name="pinjam" class="btn-pinjam-modal">
                            <i class="fas fa-book-reader"></i>
                            Pinjam Buku
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Reviews Modal -->
    <div id="reviewsModal" class="book-modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeReviewsModal()">&times;</span>
            <div class="reviews-container">
                <h3 class="reviews-title">
                    <i class="fas fa-star"></i>
                    Ulasan Buku: <span id="reviewsBookTitle"></span>
                </h3>
                <div id="bookReviews"></div>
                <form method="POST" id="reviewForm" class="review-form" style="display: none;">
                    <input type="hidden" name="bukuId" id="reviewBookId">
                    <div class="rating-input">
                        <label>Rating:</label>
                        <select name="rating" id="reviewRating" required>
                            <option value="1">1 - Sangat Buruk</option>
                            <option value="2">2 - Buruk</option>
                            <option value="3">3 - Cukup</option>
                            <option value="4">4 - Bagus</option>
                            <option value="5">5 - Sangat Bagus</option>
                        </select>
                    </div>
                    <div class="review-input">
                        <label>Ulasan:</label>
                        <textarea name="ulasan" id="reviewText" required placeholder="Tulis ulasan Anda..."></textarea>
                    </div>
                    <input type="hidden" name="ulasanId" id="reviewId">
                    <button type="submit" name="submit_review" class="btn-submit-review">
                        <i class="fas fa-paper-plane"></i>
                        <span id="reviewButtonText">Kirim Ulasan</span>
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
        let currentBookId = null;
        let currentBookTitle = null;

        function showReviews() {
            const reviewsModal = document.getElementById('reviewsModal');
            document.getElementById('reviewsBookTitle').textContent = currentBookTitle;
            document.getElementById('reviewBookId').value = currentBookId;
            reviewsModal.style.display = 'flex';
            fetchBookReviews(currentBookId);
        }

        function closeReviewsModal() {
            const reviewsModal = document.getElementById('reviewsModal');
            reviewsModal.style.display = 'none';
        }

        function showBookDetail(book) {
            const modal = document.getElementById('bookDetailModal');
            currentBookId = book.BukuID;
            currentBookTitle = book.Judul;
            
            document.getElementById('modalBookTitle').textContent = book.Judul;
            document.getElementById('modalBookAuthor').textContent = book.Penulis;
            document.getElementById('modalBookPublisher').textContent = book.Penerbit;
            document.getElementById('modalBookYear').textContent = book.TahunTerbit;
            document.getElementById('modalBookCategory').textContent = book.Kategori || 'Tidak ada kategori';
            
            // Tampilkan rating di modal
            const rating = Math.round(book.AvgRating);
            document.getElementById('modalBookRating').innerHTML = 
                '★'.repeat(rating) + '☆'.repeat(5-rating) + 
                (rating > 0 ? ` (${rating}/5)` : '');

            // Reset modal footer untuk menampilkan tombol pinjam
            const modalFooter = document.querySelector('.modal-footer');
            modalFooter.innerHTML = `
                <form method="POST" id="modalPinjamForm">
                    <input type="hidden" name="bukuId" value="${book.BukuID}">
                    <button type="submit" name="pinjam" class="btn-pinjam-modal">
                        <i class="fas fa-book-reader"></i>
                        Pinjam Buku
                    </button>
                </form>
            `;
            
            modal.style.display = 'flex';
        }

        function showBorrowedDetail(book) {
            const modal = document.getElementById('bookDetailModal');
            currentBookId = book.BukuID;
            currentBookTitle = book.Judul;
            
            document.getElementById('modalBookTitle').textContent = book.Judul;
            document.getElementById('modalBookAuthor').textContent = book.Penulis;
            document.getElementById('modalBookPublisher').textContent = book.Penerbit;
            document.getElementById('modalBookYear').textContent = book.TahunTerbit;
            document.getElementById('modalBookCategory').textContent = book.Kategori || 'Tidak ada kategori';
            
            // Tampilkan rating jika tersedia
            const rating = Math.round(book.AvgRating || 0);
            document.getElementById('modalBookRating').innerHTML = 
                '★'.repeat(rating) + '☆'.repeat(5-rating) + 
                (rating > 0 ? ` (${rating}/5)` : '');
            
            // Tampilkan tombol kembalikan atau status
            const modalFooter = document.querySelector('.modal-footer');
            if (book.StatusPeminjaman === 'dipinjam') {
                modalFooter.innerHTML = `
                    <form method="POST">
                        <input type="hidden" name="peminjamanId" value="${book.PeminjamanID}">
                        <button type="submit" name="kembali" class="btn-kembali">
                            <i class="fas fa-undo"></i> Kembalikan Buku
                        </button>
                    </form>
                `;
            } else {
                modalFooter.innerHTML = `
                    <div class="status-${book.StatusPeminjaman.toLowerCase()}">
                        Status: ${book.StatusPeminjaman}
                    </div>
                `;
            }
            
            modal.style.display = 'flex';
        }

        function filterBuku() {
            const kategori = document.getElementById("filter-kategori").value;
            const rows = document.querySelectorAll("#tabel-buku tbody tr");
            let found = false;

            rows.forEach(row => {
                const rowKategori = row.getAttribute("data-kategori");
                if (kategori === "all" || rowKategori.includes(kategori)) {
                    row.style.display = "";
                    found = true;
                } else {
                    row.style.display = "none";
                }
            });

            // Tampilkan/sembunyikan pesan tidak ada hasil
            document.getElementById("noResults").style.display = found ? "none" : "block";
            document.getElementById("tabel-buku").style.display = found ? "table" : "none";
        }

        function searchBuku() {
            const searchInput = document.getElementById("search-judul").value.toLowerCase();
            const rows = document.querySelectorAll("#tabel-buku tbody tr");
            let found = false;

            rows.forEach(row => {
                const judulBuku = row.cells[1].innerText.toLowerCase();
                if (judulBuku.includes(searchInput)) {
                    row.style.display = "";
                    found = true;
                } else {
                    row.style.display = "none";
                }
            });

            // Tampilkan/sembunyikan pesan tidak ada hasil
            document.getElementById("noResults").style.display = found ? "none" : "block";
            document.getElementById("tabel-buku").style.display = found ? "table" : "none";
        }

        function fetchBookReviews(bukuId) {
            fetch(`get_reviews.php?bukuId=${bukuId}`)
                .then(response => response.json())
                .then(data => {
                    const reviewsContainer = document.getElementById('bookReviews');
                    const reviewForm = document.getElementById('reviewForm');
                    const reviews = data.reviews;
                    
                    if (reviews.length === 0) {
                        reviewsContainer.innerHTML = '<p>Belum ada ulasan untuk buku ini.</p>';
                    } else {
                        const reviewsHtml = reviews.map(review => `
                            <div class="review-item">
                                <div class="review-header">
                                    <span class="review-author">${review.Username}</span>
                                    <div>
                                        <span class="review-rating">
                                            ${'★'.repeat(review.Rating)}${'☆'.repeat(5-review.Rating)}
                                        </span>
                                        ${review.IsOwnReview ? `
                                            <button onclick="editReview(${review.UlasanID}, ${review.Rating}, '${review.Ulasan}')" class="btn-edit-review">
                                                <i class="fas fa-edit"></i> Edit
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                                <div class="review-content">${review.Ulasan}</div>
                            </div>
                        `).join('');
                        
                        reviewsContainer.innerHTML = `
                            <div class="review-list">
                                ${reviewsHtml}
                            </div>
                        `;
                    }

                    // Tampilkan/sembunyikan form review berdasarkan apakah user sudah memberikan ulasan
                    reviewForm.style.display = data.hasReviewed ? 'none' : 'block';
                    
                    // Reset form
                    document.getElementById('reviewId').value = '';
                    document.getElementById('reviewRating').value = '5';
                    document.getElementById('reviewText').value = '';
                    document.getElementById('reviewButtonText').textContent = 'Kirim Ulasan';
                })
                .catch(error => {
                    console.error('Error fetching reviews:', error);
                    document.getElementById('bookReviews').innerHTML = 
                        '<p>Gagal memuat ulasan.</p>';
                });
        }

        function editReview(ulasanId, rating, ulasan) {
            const form = document.getElementById('reviewForm');
            form.style.display = 'block';
            
            document.getElementById('reviewId').value = ulasanId;
            document.getElementById('reviewRating').value = rating;
            document.getElementById('reviewText').value = ulasan;
            document.getElementById('reviewButtonText').textContent = 'Perbarui Ulasan';
            
            // Scroll ke form
            form.scrollIntoView({ behavior: 'smooth' });
        }

        // Update handler submit form review
        document.getElementById('reviewForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const ulasanId = document.getElementById('reviewId').value;
            const rating = document.getElementById('reviewRating').value;
            const ulasan = document.getElementById('reviewText').value;
            const bukuId = document.getElementById('reviewBookId').value;
            
            if (ulasanId) {
                // Update ulasan yang ada
                fetch('edit_review.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ulasanId: ulasanId,
                        rating: rating,
                        ulasan: ulasan
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fetchBookReviews(currentBookId);
                        // Refresh halaman setelah edit ulasan
                        window.location.reload();
                    } else {
                        alert(data.error || 'Gagal memperbarui ulasan');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Gagal memperbarui ulasan');
                });
            } else {
                // Submit ulasan baru
                fetch('submit_review.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bukuId: bukuId,
                        rating: rating,
                        ulasan: ulasan
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fetchBookReviews(currentBookId);
                        // Refresh halaman setelah menambahkan ulasan
                        window.location.reload();
                    } else {
                        alert(data.error || 'Gagal menambahkan ulasan');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Gagal menambahkan ulasan');
                });
            }
        });

        function closeModal() {
            document.getElementById('bookDetailModal').style.display = 'none';
        }

        // Menutup modal saat mengklik di luar
        window.onclick = function(event) {
            const bookModal = document.getElementById('bookDetailModal');
            const reviewsModal = document.getElementById('reviewsModal');
            
            if (event.target === bookModal) {
                closeModal();
            }
            if (event.target === reviewsModal) {
                closeReviewsModal();
            }
        }
    </script>
</body>
</html> 