<?php
include "koneksi.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = mysqli_real_escape_string($conn, $_POST['password']);
    if (!empty($username) && !empty($email) && !empty($password)) {
        $check_username = "SELECT * FROM user WHERE username = '$username'";
        $result = $conn->query($check_username);
        
        if ($result->num_rows > 0) {
            echo "<script>
                alert('Username sudah digunakan! Silakan pilih username lain.');
                window.history.back();
            </script>";
        } else {
            $sql = "INSERT INTO user (username, email, password, role) VALUES ('$username', '$email', '$password', 'peminjam')";

            if ($conn->query($sql) === TRUE) {
                echo "<script>
                    alert('Registrasi berhasil! Silakan login.');
                    window.location.href = 'login.php';
                </script>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    } else {
        echo "<script>
            alert('Harap isi semua bidang!');
            window.history.back();
        </script>";
    }
}
$conn->close();
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
            <form method="POST" action="register.php">
                <h1>Register</h1>
                <hr>
                <p>Perpustakaan Digital</p>
                <label for="username">Username</label>
                <input type="text" id="username" name="username" placeholder="Username" required>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="example@gmail.com" required>
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Password" required>
                <button type="submit">Register</button>
                <p>
                    Sudah Punya Akun?
                    <a href="login.php">Login disini</a>
                </p>
            </form>
        </div>
        <div class="right">
            <img src="Ai_Generiert_Kleines_Mädchen_-_Kostenloses_Bild_auf_Pixabay-removebg-preview.png" alt="">
        </div>
    </div>
</body>
</html>