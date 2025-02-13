<?php
include("koneksi.php");

if (isset($_POST['submit'])) {
    $id_buku = $_POST['id_buku'];
    $judul = $_POST['judul'];
    $pengarang = $_POST['pengarang'];
    $penerbit = $_POST['penerbit'];
    $tahun_terbit = $_POST['tahun_terbit'];

    $query = "INSERT INTO buku (id_buku, judul, pengarang, penerbit, tahun_terbit) VALUES ('$id_buku', '$judul', '$pengarang', '$penerbit', '$tahun_terbit')";
    $result = mysqli_query($sambung, $query);

    if ($result) {
        header("Location: buku.php");
    } else {
        echo "Gagal menambahkan data!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tambah Buku</title>
    <link rel="stylesheet" href="homepage.css">
    <link rel="manifest" href="style.css">
</head>
<>
<div class="kepala">
        <img src="buku.jpg" height="100%" width="100%">
    </div>
<div class="menu">
        <ul class="list_menu">
            <li><a href="homepage.php">Home</a></li>
            <li><a href="buku.php">Data Buku</a></li>
            <li><a href="peminjaman.php">Peminjaman</a></li>
            <li><a href="laporan.php">Laporan</a></li>
        </ul>
    </div>
    <div class="container">
        <h1>Tambah Buku</h1>
        <form action="" method="POST">
            <label for="id_buku">ID Buku</label>
            <input type="text" name="id_buku" id="id_buku" required>
            
            <label for="judul">Judul</label>
            <input type="text" name="judul" id="judul" required>
            
            <label for="pengarang">Pengarang</label>
            <input type="text" name="pengarang" id="pengarang" required>
            
            <label for="penerbit">Penerbit</label>
            <input type="text" name="penerbit" id="penerbit" required>
            
            <label for="tahun_terbit">Tahun Terbit</label>
            <input type="text" name="tahun_terbit" id="tahun_terbit" required>
            
            <button type="submit" name="submit" class="btn">Simpan</button>
        </form>
    </div>
    <div class="konten">
        <?php
        if (isset ($_GET['page'])) {
            $page = $_GET['page'];
            switch ($page) {
                case 'home';
                include "halaman/homepage.php";
                break;
                case 'buku';
                include "halaman/buku/buku.php";
                break;
                case 'pinjam';
                include "halaman/pinjam/peminjaman.php";
                break;
                case 'bukutambah';
                include "halaman/tambah/bukutambah.php";
                break;
                default:
                echo "Maaf halaman yang anda tuju tidak tersedia";
                break;
            }
        }
        ?>
    </div>
    <div class="kaki">
        copyright @2025 | SMK Negeri 2 Singosari
    </div>
</body>
</html>