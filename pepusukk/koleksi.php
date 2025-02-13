<?php
session_start();
include 'koneksi.php';

// Cek apakah pengguna sudah login
if (!isset($_SESSION['Username'])) {
    header("Location: login.php");
    exit();
}

$userId = $_SESSION['UserID'];

// Handle menambahkan buku ke koleksi
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['tambah'])) {
    $bukuId = $_POST['bukuId'];
    
    // Cek apakah buku sudah ada dalam koleksi
    $check = $conn->prepare("SELECT * FROM koleksipribadi WHERE UserID = ? AND BukuID = ?");
    $check->bind_param("ii", $userId, $bukuId);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        $error_message = "Buku sudah ada dalam koleksi";
    } else {
        $stmt = $conn->prepare("INSERT INTO koleksipribadi (UserID, BukuID) VALUES (?, ?)");
        $stmt->bind_param("ii", $userId, $bukuId);
        
        if ($stmt->execute()) {
            $success_message = "Buku berhasil ditambahkan ke koleksi";
        } else {
            $error_message = "Gagal menambahkan buku ke koleksi";
        }
    }
}

// Handle menghapus buku dari koleksi
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['hapus'])) {
    $bukuId = $_POST['bukuId'];
    $stmt = $conn->prepare("DELETE FROM koleksipribadi WHERE UserID = ? AND BukuID = ?");
    $stmt->bind_param("ii", $userId, $bukuId);
    
    if ($stmt->execute()) {
        $success_message = "Buku berhasil dihapus dari koleksi";
    } else {
        $error_message = "Gagal menghapus buku dari koleksi";
    }
}

// Dapatkan koleksi pengguna (semua buku, tidak peduli status peminjaman)
$collection = $conn->query("
    SELECT DISTINCT b.*, 
           GROUP_CONCAT(DISTINCT k.NamaKategori) as Kategori,
           p.StatusPeminjaman
    FROM koleksipribadi kp
    JOIN buku b ON kp.BukuID = b.BukuID
    LEFT JOIN kategoribuku_relasi kr ON b.BukuID = kr.BukuID
    LEFT JOIN kategoribuku k ON kr.KategoriID = k.KategoriID
    LEFT JOIN peminjaman p ON b.BukuID = p.BukuID AND p.UserID = kp.UserID
    WHERE kp.UserID = $userId
    GROUP BY b.BukuID, b.Judul, b.Penulis, b.Penerbit, b.TahunTerbit
    ORDER BY b.Judul ASC
");

// Dapatkan buku yang dipinjam oleh pengguna tetapi belum ada dalam koleksi
$available_books = $conn->query("
    SELECT DISTINCT b.*, 
           GROUP_CONCAT(DISTINCT k.NamaKategori) as Kategori
    FROM peminjaman p
    JOIN buku b ON p.BukuID = b.BukuID
    LEFT JOIN kategoribuku_relasi kr ON b.BukuID = kr.BukuID
    LEFT JOIN kategoribuku k ON kr.KategoriID = k.KategoriID
    WHERE p.UserID = $userId 
    AND p.StatusPeminjaman = 'dipinjam'
    AND b.BukuID NOT IN (
        SELECT BukuID FROM koleksipribadi WHERE UserID = $userId
    )
    GROUP BY b.BukuID, b.Judul, b.Penulis, b.Penerbit, b.TahunTerbit
    ORDER BY b.Judul ASC
");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Koleksi Pribadi</title>
    <link rel="stylesheet" href="beranda.css">
    <style>
        .book-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .book-card {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .book-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .book-card p {
            margin: 5px 0;
            color: #666;
        }
        .action-btn {
            width: 100%;
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            color: white;
        }
        .add-btn {
            background: #4CAF50;
        }
        .remove-btn {
            background: #f44336;
        }
        .section-title {
            margin: 20px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .message {
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .error {
            background: #fee;
            color: red;
        }
        .success {
            background: #efe;
            color: green;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>Perpustakaan Digital</h1>
    </div>
    <?php include 'sidebar.php'; ?>
    <div class="content">
        <?php if (isset($error_message)): ?>
            <div class="message error"><?php echo $error_message; ?></div>
        <?php endif; ?>

        <?php if (isset($success_message)): ?>
            <div class="message success"><?php echo $success_message; ?></div>
        <?php endif; ?>

        <h2 class="section-title">Koleksi Saya</h2>
        <div class="book-list">
            <?php while($book = $collection->fetch_assoc()): ?>
            <div class="book-card">
                <h3><?php echo htmlspecialchars($book['Judul']); ?></h3>
                <p><strong>Penulis:</strong> <?php echo htmlspecialchars($book['Penulis']); ?></p>
                <p><strong>Penerbit:</strong> <?php echo htmlspecialchars($book['Penerbit']); ?></p>
                <p><strong>Tahun:</strong> <?php echo $book['TahunTerbit']; ?></p>
                <p><strong>Kategori:</strong> <?php echo htmlspecialchars($book['Kategori'] ?? 'Tidak ada kategori'); ?></p>
                <form method="POST">
                    <input type="hidden" name="bukuId" value="<?php echo $book['BukuID']; ?>">
                    <button type="submit" name="hapus" class="action-btn remove-btn">Hapus dari Koleksi</button>
                </form>
            </div>
            <?php endwhile; ?>
        </div>

        <h2 class="section-title">Tambah ke Koleksi</h2>
        <div class="book-list">
            <?php while($book = $available_books->fetch_assoc()): ?>
            <div class="book-card">
                <h3><?php echo htmlspecialchars($book['Judul']); ?></h3>
                <p><strong>Penulis:</strong> <?php echo htmlspecialchars($book['Penulis']); ?></p>
                <p><strong>Penerbit:</strong> <?php echo htmlspecialchars($book['Penerbit']); ?></p>
                <p><strong>Tahun:</strong> <?php echo $book['TahunTerbit']; ?></p>
                <p><strong>Kategori:</strong> <?php echo htmlspecialchars($book['Kategori'] ?? 'Tidak ada kategori'); ?></p>
                <form method="POST">
                    <input type="hidden" name="bukuId" value="<?php echo $book['BukuID']; ?>">
                    <button type="submit" name="tambah" class="action-btn add-btn">Tambah ke Koleksi</button>
                </form>
            </div>
            <?php endwhile; ?>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Copyright &copy; 2025 | Perpustakaan Digital</p>
    </div>
</body>
</html> 