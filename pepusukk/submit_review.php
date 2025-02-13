<?php
session_start();
include 'koneksi.php';

if (!isset($_SESSION['Username'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$bukuId = $data['bukuId'];
$rating = $data['rating'];
$ulasan = $data['ulasan'];
$userId = $_SESSION['UserID'];

// Cek apakah user sudah memberikan ulasan untuk buku ini
$checkStmt = $conn->prepare("SELECT UlasanID FROM ulasanbuku WHERE UserID = ? AND BukuID = ?");
$checkStmt->bind_param("ii", $userId, $bukuId);
$checkStmt->execute();

if ($checkStmt->get_result()->num_rows > 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Anda sudah memberikan ulasan untuk buku ini']);
    exit();
}

// Insert ulasan baru
$stmt = $conn->prepare("INSERT INTO ulasanbuku (UserID, BukuID, Ulasan, Rating) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iisi", $userId, $bukuId, $ulasan, $rating);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Ulasan berhasil ditambahkan']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal menambahkan ulasan']);
} 