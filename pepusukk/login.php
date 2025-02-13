<?php
session_start();
include 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') { 
    // Pastikan input 'Username' dan 'Password' ada di dalam array $_POST
    $username = isset($_POST['Username']) ? trim($_POST['Username']) : '';
    $password = isset($_POST['Password']) ? trim($_POST['Password']) : '';

    // Cek apakah input username dan password sudah diisi
    if (empty($username) || empty($password)) {
        $_SESSION['error'] = "Semua kolom harus diisi!";
    } else {
        // Menyiapkan query untuk memeriksa username di database
        $query = "SELECT * FROM user WHERE Username = ?";
        $stmt = $conn->prepare($query);
    
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        // Cek apakah ada data yang ditemukan
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Memverifikasi password menggunakan password_verify()
            if ($password === $user['Password']) { 
                // Menyimpan Username ke session
                $_SESSION['Username'] = $user['Username'];  
                $_SESSION['role'] = $user['role']; 
                $_SESSION['UserID'] = $user['UserID']; 
            

                // Redirect ke halaman menu setelah login berhasil
                header("Location: homepage.php");
                exit();
            } else {
                $error_message = "Password salah!";
            }            
        } else {
            $error_message = "Username tidak ditemukan!";
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
    <title>Perpustakaan</title>
    <link rel="stylesheet" href="login2.css">
</head>
<body>
    <div class="container">
        <div class="login">
            <form action="" method="POST">
                <h1>Login</h1>
                <hr>
                <p>Perpustakaan Digital</p>

                <?php if (isset($error_message)): ?>
                    <p style="color: red;"><?php echo $error_message; ?></p>
                <?php endif; ?>

                <label for="Username">Username</label>
                <input type="text" name="Username" placeholder="Username" required>

                <label for="Password">Password</label>
                <input type="password" name="Password" placeholder="Password" required>

                <button type="submit">Login</button>

                <p>
                    peminjam?
                    <a href="register.php">Daftar disini</a>
                </p>
            </form>
        </div>
        <div class="right">
            <img src="Ai_Generiert_Kleines_Mädchen_-_Kostenloses_Bild_auf_Pixabay-removebg-preview.png" alt="Image">
        </div>
    </div>
</body>
</html>
