function editBuku(id) {
    alert("Edit buku dengan ID: " + id);
    // Tambahkan logika untuk mengedit data buku
}

function hapusBuku(id) {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus buku dengan ID: " + id + "?");
    if (confirmDelete) {
        alert("Buku dengan ID " + id + " dihapus.");
        // Tambahkan logika untuk menghapus data buku
    }
}
