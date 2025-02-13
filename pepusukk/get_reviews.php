<?php
session_start();
include 'koneksi.php';

if (!isset($_SESSION['Username'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if (!isset($_GET['bukuId'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Book ID is required']);
    exit();
}

$bukuId = $_GET['bukuId'];
$userId = $_SESSION['UserID'];

// Cek apakah user sudah memberikan ulasan untuk buku ini
$checkStmt = $conn->prepare("SELECT UlasanID FROM ulasanbuku WHERE UserID = ? AND BukuID = ?");
$checkStmt->bind_param("ii", $userId, $bukuId);
$checkStmt->execute();
$hasReviewed = $checkStmt->get_result()->num_rows > 0;

// Dapatkan ulasan dengan informasi pengguna
$stmt = $conn->prepare("
    SELECT ub.UlasanID, u.Username, ub.Rating, ub.Ulasan, ub.UserID
    FROM ulasanbuku ub
    JOIN user u ON ub.UserID = u.UserID
    WHERE ub.BukuID = ?
    ORDER BY ub.UlasanID DESC
");

$stmt->bind_param("i", $bukuId);
$stmt->execute();
$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = [
        'UlasanID' => $row['UlasanID'],
        'Username' => htmlspecialchars($row['Username']),
        'Rating' => (int)$row['Rating'],
        'Ulasan' => htmlspecialchars($row['Ulasan']),
        'IsOwnReview' => $row['UserID'] == $userId
    ];
}

$response = [
    'hasReviewed' => $hasReviewed,
    'reviews' => $reviews
];

header('Content-Type: application/json');
echo json_encode($response); 