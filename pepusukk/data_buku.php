<?php
session_start();
include 'koneksi.php';

// Cek apakah user sudah login dan memiliki peran yang sesuai
if (!isset($_SESSION['Username']) || ($_SESSION['role'] != 'superadmin' && $_SESSION['role'] != 'administrator' && $_SESSION['role'] != 'petugas')) {
    header("Location: login.php");
    exit();
}

// Handle penghapusan buku
if (isset($_POST['delete'])) {
    $bukuId = $_POST['bukuId'];
    // Hapus hubungan kategori terlebih dahulu
    $stmt = $conn->prepare("DELETE FROM kategoribuku_relasi WHERE BukuID = ?");
    $stmt->bind_param("i", $bukuId);
    $stmt->execute();
    // Kemudian hapus buku
    $stmt = $conn->prepare("DELETE FROM buku WHERE BukuID = ?");
    $stmt->bind_param("i", $bukuId);
    $stmt->execute();
}

// Handle penambahan/edit buku
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit'])) {
    $judul = $_POST['judul'];
    $penulis = $_POST['penulis'];
    $penerbit = $_POST['penerbit'];
    $tahunTerbit = $_POST['tahunTerbit'];
    $kategori = $_POST['kategori'];
    
    if (isset($_POST['bukuId']) && !empty($_POST['bukuId'])) { // Edit buku yang ada
        $bukuId = $_POST['bukuId'];
        $stmt = $conn->prepare("UPDATE buku SET Judul=?, Penulis=?, Penerbit=?, TahunTerbit=? WHERE BukuID=?");
        $stmt->bind_param("sssii", $judul, $penulis, $penerbit, $tahunTerbit, $bukuId);
        if ($stmt->execute()) {
            // Update kategori
            $stmt = $conn->prepare("DELETE FROM kategoribuku_relasi WHERE BukuID = ?");
            $stmt->bind_param("i", $bukuId);
            $stmt->execute();
            
            // Insert hubungan kategori baru
            $stmt = $conn->prepare("INSERT INTO kategoribuku_relasi (BukuID, KategoriID) VALUES (?, ?)");
            $stmt->bind_param("ii", $bukuId, $kategori);
            $stmt->execute();
        }
    } else { // Tambah buku baru
        $stmt = $conn->prepare("INSERT INTO buku (Judul, Penulis, Penerbit, TahunTerbit) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $judul, $penulis, $penerbit, $tahunTerbit);
        if ($stmt->execute()) {
            $bukuId = $conn->insert_id;
            // Insert hubungan kategori
            $stmt = $conn->prepare("INSERT INTO kategoribuku_relasi (BukuID, KategoriID) VALUES (?, ?)");
            $stmt->bind_param("ii", $bukuId, $kategori);
            $stmt->execute();
        }
    }
}

// Dapatkan semua buku dengan kategori mereka
$query = "SELECT b.*, k.NamaKategori as Kategori, k.KategoriID 
          FROM buku b 
          LEFT JOIN kategoribuku_relasi kr ON b.BukuID = kr.BukuID 
          LEFT JOIN kategoribuku k ON kr.KategoriID = k.KategoriID 
          ORDER BY b.BukuID DESC";
$result = $conn->query($query);

// Dapatkan semua kategori untuk dropdown
$kategori_result = $conn->query("SELECT * FROM kategoribuku ORDER BY NamaKategori");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Buku</title>
    <link rel="stylesheet" href="beranda.css">
    <style>
        /* Popup Styles */
        .popup {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
        }

        .popup-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            width: 50%;
            max-width: 500px;
            position: relative;
        }

        .close-btn {
            position: absolute;
            right: 10px;
            top: 5px;
            font-size: 25px;
            cursor: pointer;
        }

        /* Filter Styles */
        .filter-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }

        .nganan {
            display: flex;
            align-items: center;
        }

        .ngiri {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        /* Button Styles */
        .btn {
            background-color: #007bff;
            color: white;
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            font-weight: bold;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        .btn-filter, .btn-search {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }

        .btn-filter:hover, .btn-search:hover {
            background-color: #0056b3;
        }

        /* Table Styles */
        #tabel-buku {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
        }

        #tabel-buku th {
            background-color: #007bff;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }

        #tabel-buku td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }

        #tabel-buku tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        #tabel-buku tr:hover {
            background-color: #f5f5f5;
        }

        /* Action Button Styles */
        .action-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 80px;
            height: 32px;
            background-color: #007bff;
            color: white;
            font-weight: bold;
            box-sizing: border-box;
        }

        .action-btn:hover {
            background-color: #0056b3;
        }

        .ab {
            background-color: #16404D;
            color: white;
            padding: 6px 12px;
            text-decoration: none;
            border-radius: 4px;
            min-width: 80px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 13px;
            box-sizing: border-box;
        }

        .ab:hover {
            background-color: #0d2a33;
        }

        .action-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            align-items: center;
        }

        /* Form Styles */
        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #16404D;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }

        .kategori-select {
            height: auto;
        }

        /* Form Button Styles */
        .form-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .form-buttons .action-btn,
        .form-buttons .ab {
            width: auto;
            min-width: 100px;
        }
    </style>
    <!-- Add Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>Perpustakaan Digital</h1>
    </div>
    <?php include 'sidebar.php'; ?>
    <div class="content">
        <h2>Daftar Buku yang Tersedia</h2>
        <p>Berikut adalah daftar buku yang tersedia di perpustakaan:</p>
        
        <!-- Filter Container -->
        <div class="filter-container">
            <div class="nganan">
                <button onclick="openModal()" class="btn">
                    <i class="fas fa-plus"></i> Tambah Buku
                </button>
            </div>
            <div class="ngiri">
                <select id="filter-kategori" class="filter-select">
                    <option value="all">Semua Kategori</option>
                    <?php 
                    $kategori_filter = $conn->query("SELECT DISTINCT NamaKategori FROM kategoribuku ORDER BY NamaKategori");
                    while($kat = $kategori_filter->fetch_assoc()): 
                    ?>
                        <option value="<?php echo htmlspecialchars($kat['NamaKategori']); ?>">
                            <?php echo htmlspecialchars($kat['NamaKategori']); ?>
                        </option>
                    <?php endwhile; ?>
                </select>
                <button onclick="filterBuku()" class="btn-filter">Filter</button>
                <input type="text" id="search-input" class="search-input" placeholder="Cari judul buku...">
                <button onclick="searchBuku()" class="btn-search">Search</button>
            </div>
        </div>

        <!-- Table Container -->
        <div class="table-container">
            <table id="tabel-buku">
                <thead>
                    <tr>
                        <th width="5%">No</th>
                        <th width="20%">Judul Buku</th>
                        <th width="15%">Penulis</th>
                        <th width="15%">Penerbit</th>
                        <th width="10%">Tahun Terbit</th>
                        <th width="15%">Kategori</th>
                        <th width="20%">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $no = 1;
                    while($row = $result->fetch_assoc()): 
                    ?>
                    <tr>
                        <td><?php echo $no++; ?></td>
                        <td><?php echo htmlspecialchars($row['Judul']); ?></td>
                        <td><?php echo htmlspecialchars($row['Penulis']); ?></td>
                        <td><?php echo htmlspecialchars($row['Penerbit']); ?></td>
                        <td><?php echo $row['TahunTerbit']; ?></td>
                        <td><?php echo htmlspecialchars($row['Kategori']); ?></td>
                        <td>
                            <div class="action-wrapper">
                                <button onclick='editBook(<?php echo json_encode([
                                    "BukuID" => $row['BukuID'],
                                    "Judul" => $row['Judul'],
                                    "Penulis" => $row['Penulis'],
                                    "Penerbit" => $row['Penerbit'],
                                    "TahunTerbit" => $row['TahunTerbit'],
                                    "KategoriID" => $row['KategoriID']
                                ]); ?>)' class="action-btn">Edit</button>
                                <form method="POST" style="display: inline;">
                                    <input type="hidden" name="bukuId" value="<?php echo $row['BukuID']; ?>">
                                    <button type="submit" name="delete" class="ab" onclick="return confirm('Yakin ingin menghapus buku ini?')">Hapus</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Copyright &copy; 2025 | Perpustakaan Digital</p>
    </div>

    <!-- Modal -->
    <div id="bookModal" class="popup">
        <div class="popup-content">
            <span class="close-btn" onclick="closeModal()">&times;</span>
            <h3>Tambah/Edit Buku</h3>
            <form method="POST" onsubmit="return validateForm()">
                <input type="hidden" name="bukuId" id="bukuId">
                <div class="form-group">
                    <label for="judul">Judul Buku:</label>
                    <input type="text" name="judul" id="judul" required>
                </div>
                <div class="form-group">
                    <label for="penulis">Penulis:</label>
                    <input type="text" name="penulis" id="penulis" required>
                </div>
                <div class="form-group">
                    <label for="penerbit">Penerbit:</label>
                    <input type="text" name="penerbit" id="penerbit" required>
                </div>
                <div class="form-group">
                    <label for="tahunTerbit">Tahun Terbit:</label>
                    <input type="number" name="tahunTerbit" id="tahunTerbit" required>
                </div>
                <div class="form-group">
                    <label for="kategori">Kategori:</label>
                    <select name="kategori" id="kategori" class="kategori-select" required>
                        <option value="">Pilih Kategori</option>
                        <?php 
                        mysqli_data_seek($kategori_result, 0);
                        while($kat = $kategori_result->fetch_assoc()): 
                        ?>
                            <option value="<?php echo $kat['KategoriID']; ?>">
                                <?php echo htmlspecialchars($kat['NamaKategori']); ?>
                            </option>
                        <?php endwhile; ?>
                    </select>
                </div>
                <div class="form-buttons">
                    <button type="submit" name="submit" class="action-btn">Simpan</button>
                    <button type="button" onclick="closeModal()" class="ab">Batal</button>
                </div>
            </form>
        </div>
    </div>

    <script>
    // Dapatkan modal
    var modal = document.getElementById('bookModal');

    // Fungsi untuk membuka modal
    function openModal() {
        modal.style.display = "flex";
    }

    // Fungsi untuk menutup modal
    function closeModal() {
        modal.style.display = "none";
        resetForm();
    }

    // Menutup modal saat mengklik di luar
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    function editBook(book) {
        console.log('Data buku:', book); // Log debug
        
        // Buka modal terlebih dahulu
        modal.style.display = "flex";
        
        // Kemudian set nilai-nilai
        document.getElementById('bukuId').value = book.BukuID;
        document.getElementById('judul').value = book.Judul;
        document.getElementById('penulis').value = book.Penulis;
        document.getElementById('penerbit').value = book.Penerbit;
        document.getElementById('tahunTerbit').value = book.TahunTerbit;
        
        // Kemudian set nilai kategori langsung
        const kategoriSelect = document.getElementById('kategori');
        if (book.KategoriID) {
            kategoriSelect.value = book.KategoriID;
        }
    }
    
    function resetForm() {
        document.getElementById('bukuId').value = '';
        document.getElementById('judul').value = '';
        document.getElementById('penulis').value = '';
        document.getElementById('penerbit').value = '';
        document.getElementById('tahunTerbit').value = '';
        document.getElementById('kategori').value = '';
    }
    
    function validateForm() {
        var judul = document.getElementById('judul').value.trim();
        var penulis = document.getElementById('penulis').value.trim();
        var penerbit = document.getElementById('penerbit').value.trim();
        var tahunTerbit = document.getElementById('tahunTerbit').value.trim();
        var kategori = document.getElementById('kategori').value;
        
        if (judul === '' || penulis === '' || penerbit === '' || tahunTerbit === '') {
            alert('Semua field harus diisi!');
            return false;
        }
        
        if (!kategori) {
            alert('Pilih kategori!');
            return false;
        }
        
        return true;
    }

    // Tambahkan fungsi-fungsi baru untuk filtering dan pencarian
    function filterBuku() {
        const kategori = document.getElementById('filter-kategori').value.toLowerCase();
        const rows = document.querySelectorAll('#tabel-buku tbody tr');
        
        rows.forEach(row => {
            const kategoriCell = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
            if (kategori === 'all' || kategoriCell.includes(kategori)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function searchBuku() {
        const searchText = document.getElementById('search-input').value.toLowerCase();
        const rows = document.querySelectorAll('#tabel-buku tbody tr');
        
        rows.forEach(row => {
            const judulCell = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            if (judulCell.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Tambahkan event listener untuk input pencarian
    document.getElementById('search-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchBuku();
        }
    });
    </script>
</body>
</html> 