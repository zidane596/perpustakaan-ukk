<div class="sidebar">
    <img src="inorasi-removebg-preview.png" width="100%">
    <ul>
        <li><a href="homepage.php">Beranda</a></li>
        <?php if (isset($_SESSION['role']) && ($_SESSION['role'] == 'superadmin')): ?>
            <li><a href="registrasi.php">Registrasi</a></li>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['role']) && ($_SESSION['role'] == 'administrator' || $_SESSION['role'] == 'superadmin')): ?>
            <li><a href="data_buku.php">Pendataan Buku</a></li>
            <li><a href="kategori_buku.php">Kategori Buku</a></li>
        <?php endif; ?>
        <?php if (isset($_SESSION['role']) && ($_SESSION['role'] == 'petugas' )): ?>
            <li><a href="data_buku.php">Pendataan Buku</a></li>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['role']) && ($_SESSION['role'] == 'peminjam')): ?>
            <li><a href="peminjaman.php">Peminjaman</a></li>
            <li><a href="koleksi.php">Koleksi Pribadi</a></li>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['role']) && ($_SESSION['role'] == 'superadmin' || $_SESSION['role'] == 'administrator' || $_SESSION['role'] == 'petugas')): ?>
            <li><a href="laporan.php">Generate Laporan</a></li>
        <?php endif; ?>
        
        <li><a href="logout.php">Keluar</a></li>
    </ul>
</div>
