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
$ulasanId = $data['ulasanId'];
$rating = $data['rating'];
$ulasan = $data['ulasan'];
$userId = $_SESSION['UserID'];

// Verify ulasan
$stmt = $conn->prepare("SELECT 1 FROM ulasanbuku WHERE UlasanID = ? AND UserID = ?");
$stmt->bind_param("ii", $ulasanId, $userId);
$stmt->execute();

if ($stmt->get_result()->num_rows === 0) {
    http_response_code(403);
    echo json_encode(['error' => 'Not authorized to edit this review']);
    exit();
}

// Update ulasan
$updateStmt = $conn->prepare("UPDATE ulasanbuku SET Rating = ?, Ulasan = ? WHERE UlasanID = ? AND UserID = ?");
$updateStmt->bind_param("isii", $rating, $ulasan, $ulasanId, $userId);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Ulasan berhasil diperbarui']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal memperbarui ulasan']);
} 