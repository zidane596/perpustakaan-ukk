<?php
// Konfigurasi database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "perpustakaan";

// Membuat koneksi ke database
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Mengambil data dari form
$nama = $_POST['nama'];
$judulBuku = $_POST['judulBuku'];

// Mengecek apakah buku tersedia
$sqlCheck = "SELECT stok FROM buku WHERE judul_buku = '$judulBuku'";
$resultCheck = $conn->query($sqlCheck);
if ($resultCheck->num_rows > 0) {
    $row = $resultCheck->fetch_assoc();
    $stok = $row['stok'];

    if ($stok > 0) {
        // Menyimpan data peminjaman ke dalam tabel peminjaman
        $sqlInsert = "INSERT INTO peminjaman (nama, judul_buku) VALUES ('$nama', '$judulBuku')";
        if ($conn->query($sqlInsert) === TRUE) {
            // Mengurangi stok buku
            $sqlUpdate = "UPDATE buku SET stok = stok - 1 WHERE judul_buku = '$judulBuku'";
            if ($conn->query($sqlUpdate) === TRUE) {
                echo "Buku berhasil dipinjam.";
            } else {
                echo "Gagal mengurangi stok buku.";
            }
        } else {
            echo "Gagal memproses peminjaman: " . $conn->error;
        }
    } else {
        echo "Stok buku tidak cukup.";
    }
} else {
    echo "Buku tidak ditemukan.";
}

$conn->close();
?>
