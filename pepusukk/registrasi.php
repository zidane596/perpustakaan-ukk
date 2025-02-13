<?php
session_start();
include 'koneksi.php';

// Cek apakah pengguna sudah login dan adalah superadmin
if (!isset($_SESSION['Username']) || $_SESSION['role'] !== 'superadmin') {
    header("Location: login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = isset($_POST['Username']) ? trim($_POST['Username']) : '';
    $password = isset($_POST['Password']) ? trim($_POST['Password']) : '';
    $role = isset($_POST['role']) ? trim($_POST['role']) : '';

    if (empty($username) || empty($password) || empty($role)) {
        $error_message = "Semua kolom harus diisi!";
    } else {
        $query = "INSERT INTO user (Username, Password, role) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        
        $stmt->bind_param("sss", $username, $password, $role);
        
        if ($stmt->execute()) {
            $success_message = "User berhasil didaftarkan!";
        } else {
            $error_message = "Gagal mendaftarkan user!";
        }
        $stmt->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrasi User</title>
    <link rel="stylesheet" href="beranda.css">
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1>Perpustakaan Digital</h1>
        <p>Registrasi User Baru</p>
    </div>
    <?php include 'sidebar.php'; ?>
    <div class="content">
        <h2>Registrasi User Baru</h2>
        
        <?php if (isset($error_message)): ?>
            <p style="color: red;"><?php echo $error_message; ?></p>
        <?php endif; ?>
        
        <?php if (isset($success_message)): ?>
            <p style="color: green;"><?php echo $success_message; ?></p>
        <?php endif; ?>

        <form action="" method="POST" style="max-width: 500px; margin: 0 auto;">
            <div style="margin-bottom: 15px;">
                <label for="Username">Username:</label>
                <input type="text" name="Username" required style="width: 100%; padding: 8px;">
            </div>

            <div style="margin-bottom: 15px;">
                <label for="Password">Password:</label>
                <input type="password" name="Password" required style="width: 100%; padding: 8px;">
            </div>

            <div style="margin-bottom: 15px;">
                <label for="role">Role:</label>
                <select name="role" required style="width: 100%; padding: 8px;">
                    <option value="">Pilih Role</option>
                    <option value="administrator">Administrator</option>
                    <option value="petugas">Petugas</option>
                    <option value="peminjam">Peminjam</option>
                </select>
            </div>

            <button type="submit" style="width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer;">
                Daftar
            </button>
        </form>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Copyright &copy; 2025 | Perpustakaan Digital</p>
    </div>
</body>
</html> 