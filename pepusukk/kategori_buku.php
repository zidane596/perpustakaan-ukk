<?php
session_start();
include 'koneksi.php';

// Cek apakah pengguna sudah login dan memiliki peran yang sesuai
if (!isset($_SESSION['Username']) || ($_SESSION['role'] != 'administrator' && $_SESSION['role'] != 'superadmin')) {
    header("Location: login.php");
    exit();
}

$message = ''; // Untuk menyimpan pesan sukses/error

// Handle penghapusan kategori
if (isset($_POST['delete'])) {
    $kategoriId = $_POST['kategoriId'];
    
    // Cek apakah kategori sedang digunakan
    $check = $conn->prepare("SELECT COUNT(*) as count FROM kategoribuku_relasi WHERE KategoriID = ?");
    $check->bind_param("i", $kategoriId);
    $check->execute();
    $result = $check->get_result();
    $count = $result->fetch_assoc()['count'];
    
    if ($count > 0) {
        $message = '<div style="color: red; margin-bottom: 10px;">Kategori tidak dapat dihapus karena sedang digunakan oleh buku!</div>';
    } else {
        $stmt = $conn->prepare("DELETE FROM kategoribuku WHERE KategoriID = ?");
        $stmt->bind_param("i", $kategoriId);
        if ($stmt->execute()) {
            $message = '<div style="color: green; margin-bottom: 10px;">Kategori berhasil dihapus!</div>';
        } else {
            $message = '<div style="color: red; margin-bottom: 10px;">Gagal menghapus kategori!</div>';
        }
    }
}

// Handle category addition/edit
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit'])) {
    $namaKategori = $_POST['namaKategori'];
    
    // Cek apakah nama kategori sudah ada
    $check = $conn->prepare("SELECT COUNT(*) as count FROM kategoribuku WHERE NamaKategori = ? AND KategoriID != ?");
    $kategoriId = isset($_POST['kategoriId']) ? $_POST['kategoriId'] : 0;
    $check->bind_param("si", $namaKategori, $kategoriId);
    $check->execute();
    $result = $check->get_result();
    $count = $result->fetch_assoc()['count'];
    
    if ($count > 0) {
        $message = '<div style="color: red; margin-bottom: 10px;">Kategori dengan nama tersebut sudah ada!</div>';
    } else {
        if (isset($_POST['kategoriId']) && !empty($_POST['kategoriId'])) { // Edit kategori yang ada
            $kategoriId = $_POST['kategoriId'];
            $stmt = $conn->prepare("UPDATE kategoribuku SET NamaKategori=? WHERE KategoriID=?");
            $stmt->bind_param("si", $namaKategori, $kategoriId);
            if ($stmt->execute()) {
                $message = '<div style="color: green; margin-bottom: 10px;">Kategori berhasil diupdate!</div>';
            } else {
                $message = '<div style="color: red; margin-bottom: 10px;">Gagal mengupdate kategori!</div>';
            }
        } else { // Tambahkan kategori baru
            $stmt = $conn->prepare("INSERT INTO kategoribuku (NamaKategori) VALUES (?)");
            $stmt->bind_param("s", $namaKategori);
            if ($stmt->execute()) {
                $message = '<div style="color: green; margin-bottom: 10px;">Kategori baru berhasil ditambahkan!</div>';
            } else {
                $message = '<div style="color: red; margin-bottom: 10px;">Gagal menambahkan kategori!</div>';
            }
        }
    }
}

// Dapatkan semua kategori
$result = $conn->query("SELECT * FROM kategoribuku ORDER BY KategoriID DESC");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Kategori Buku</title>
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

        .btn-search {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }

        .btn-search:hover {
            background-color: #0056b3;
        }

        /* Table Styles */
        #tabel-kategori {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
        }

        #tabel-kategori th {
            background-color: #007bff;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }

        #tabel-kategori td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }

        #tabel-kategori tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        #tabel-kategori tr:hover {
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
            width: 100%;
            background-color: #007bff;
            color: white;
            font-weight: bold;
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
            width: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .ab:hover {
            background-color: #0d2a33;
        }

        .action-wrapper {
            display: grid;
            grid-template-columns: 80px 80px;
            gap: 8px;
            align-items: center;
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

        .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .form-group input:focus {
            border-color: #007bff;
            outline: none;
            box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
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
        <h2>Daftar Kategori Buku</h2>
        <p>Berikut adalah daftar kategori buku yang tersedia di perpustakaan:</p>
        
        <!-- Display Messages -->
        <?php if (!empty($message)) echo $message; ?>
        
        <!-- Filter Container -->
        <div class="filter-container">
            <div class="nganan">
                <button onclick="openModal()" class="btn">
                    <i class="fas fa-plus"></i> Tambah Kategori
                </button>
            </div>
            <div class="ngiri">
                <input type="text" id="search-input" class="search-input" placeholder="Cari kategori...">
                <button onclick="searchKategori()" class="btn-search">Search</button>
            </div>
        </div>

        <!-- Modal -->
        <div id="categoryModal" class="popup">
            <div class="popup-content">
                <span class="close-btn" onclick="closeModal()">&times;</span>
                <h3 style="margin-bottom: 20px;">Tambah/Edit Kategori</h3>
                <form method="POST" onsubmit="return validateForm()">
                    <input type="hidden" name="kategoriId" id="kategoriId">
                    <div class="form-group">
                        <label for="namaKategori">Nama Kategori:</label>
                        <input type="text" name="namaKategori" id="namaKategori" required>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" name="submit" class="action-btn" style="background-color: #007bff; color: white;">Simpan</button>
                        <button type="button" onclick="closeModal()" class="ab">Batal</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Table Container -->
        <div class="table-container">
            <table id="tabel-kategori">
                <thead>
                    <tr>
                        <th width="10%">No</th>
                        <th>Nama Kategori</th>
                        <th width="25%">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $no = 1;
                    while($row = $result->fetch_assoc()): 
                    ?>
                    <tr>
                        <td><?php echo $no++; ?></td>
                        <td><?php echo htmlspecialchars($row['NamaKategori']); ?></td>
                        <td>
                            <div class="action-wrapper">
                                <button onclick="editCategory(<?php echo htmlspecialchars(json_encode($row)); ?>)" class="action-btn">Edit</button>
                                <form method="POST" style="display: inline;">
                                    <input type="hidden" name="kategoriId" value="<?php echo $row['KategoriID']; ?>">
                                    <button type="submit" name="delete" class="ab" onclick="return confirm('Yakin ingin menghapus kategori ini?')">Hapus</button>
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

    <script>
    // Get the modal
    var modal = document.getElementById('categoryModal');

    // Fungsi untuk membuka modal
    function openModal() {
        modal.style.display = "flex";
        resetForm();
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

    function editCategory(category) {
        document.getElementById('kategoriId').value = category.KategoriID;
        document.getElementById('namaKategori').value = category.NamaKategori;
        openModal();
    }
    
    function resetForm() {
        document.getElementById('kategoriId').value = '';
        document.getElementById('namaKategori').value = '';
    }
    
    function validateForm() {
        var namaKategori = document.getElementById('namaKategori').value.trim();
        if (namaKategori === '') {
            alert('Nama kategori tidak boleh kosong!');
            return false;
        }
        return true;
    }

    // Tambahkan fungsi pencarian
    function searchKategori() {
        const searchText = document.getElementById('search-input').value.toLowerCase();
        const rows = document.querySelectorAll('#tabel-kategori tbody tr');
        
        rows.forEach(row => {
            const kategoriCell = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            if (kategoriCell.includes(searchText)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    // Tambahkan event listener untuk input pencarian
    document.getElementById('search-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchKategori();
        }
    });
    </script>
</body>
</html> 