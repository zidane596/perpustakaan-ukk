<?php
session_start();

// Check jika user sudah login
if (isset($_SESSION['Username'])) {
    // User sudah login, redirect ke homepage
    header("Location: homepage.php");

    exit();
} else {
    // User belum login, redirect ke halaman login
    header("Location: login.php");
    exit();
}

?>
