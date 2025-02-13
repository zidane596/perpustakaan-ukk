<?php
session_start();
if (!isset($_SESSION['Username'])) {
    header("Location: login.php");  // Redirect ke halaman login jika user tidak terautentikasi
    exit();
}

$role = $_SESSION['role'];
$user_name = $_SESSION['Username'];

include 'koneksi.php';

// Dapatkan ID pengguna terlebih dahulu
$query_user = "SELECT UserID FROM user WHERE Username = '$user_name'";  // Menggunakan nama variabel baru
$result_user = mysqli_query($conn, $query_user);
$user_data = mysqli_fetch_assoc($result_user);
$user_id = $user_data['UserID'];

// Dapatkan total buku
$query_total_books = "SELECT COUNT(*) as total FROM buku";
$result_total_books = mysqli_query($conn, $query_total_books);
$total_books = mysqli_fetch_assoc($result_total_books)['total'];

// Dapatkan buku yang dipinjam - query berbeda untuk peminjam vs admin/petugas
if ($role == 'peminjam') {
    $query_borrowed = "SELECT COUNT(*) as total FROM peminjaman 
                      WHERE StatusPeminjaman = 'dipinjam' 
                      AND UserID = $user_id";
    $query_returned = "SELECT COUNT(*) as total FROM peminjaman 
                      WHERE StatusPeminjaman = 'dikembalikan' 
                      AND UserID = $user_id";
} else {
    $query_borrowed = "SELECT COUNT(*) as total FROM peminjaman WHERE StatusPeminjaman = 'dipinjam'";
    $query_returned = "SELECT COUNT(*) as total FROM peminjaman WHERE StatusPeminjaman = 'dikembalikan'";
}

$result_borrowed = mysqli_query($conn, $query_borrowed);
$borrowed_books = mysqli_fetch_assoc($result_borrowed)['total'];

$result_returned = mysqli_query($conn, $query_returned);
$returned_books = mysqli_fetch_assoc($result_returned)['total'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perpustakaan Digital</title>
    <link rel="stylesheet" href="beranda.css">
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>Perpustakaan Digital</h1>
        <p>Selamat datang <?= htmlspecialchars($user_name) ?></p>
    </div>
    <?php include 'sidebar.php'; ?>
    <div class="content">
        <h2>Selamat Datang di Perpustakaan Digital</h2>
        
        <!-- Cards -->
        <div class="cards">
            <a href="#" class="card">
                <h3>Jumlah Buku</h3>
                <p><?php echo $total_books; ?></p>
            </a>
            <a href="#" class="card">
                <h3>Buku yang Dipinjam</h3>
                <p><?php echo $borrowed_books; ?></p>
            </a>
            <a href="#" class="card">
                <h3>Buku yang Dikembalikan</h3>
                <p><?php echo $returned_books; ?></p>
            </a>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Copyright &copy; 2025 | Perpustakaan Digital</p>
    </div>
</body>
</html>