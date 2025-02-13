<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daftar Buku</title>
    <link rel="stylesheet" href="beranda.css">
</head>
<body>
    <div id="formPopup" class="popup">
        <div class="popup-content">
            <span class="close-btn" id="closePopup">&times;</span>
            <form id="formEdit">
                <label for="judul">Judul Buku:</label>
                <input type="text" id="judul" name="judul"><br><br>

                <label for="penulis">Penulis:</label>
                <input type="text" id="penulis" name="penulis"><br><br>

                <label for="penerbit">Penerbit:</label>
                <input type="text" id="penerbit" name="penerbit"><br><br>

                <label for="tahun">Tahun Terbit:</label>
                <input type="number" id="tahun" name="tahun"><br><br>

                <label for="kategori">Kategori:</label>
                <input type="text" id="kategori" name="kategori"><br><br>

                <button type="submit">Simpan Perubahan</button>
                <a href="data_buku.html">Batal</a>
            </form>
        </div>
    </div>

    <div class="header">
        <h1>Perpustakaan Digital</h1>
    </div>
    <div class="sidebar">
        <img src="inorasi-removebg-preview.png" width="100%">
        <ul>
            <li><a href="homepage.html">Beranda</a></li>
            <li><a href="data_buku.html">Pendataan Barang</a></li>
            <li><a href="laporan.html">Generate Laporan</a></li>
        </ul>
    </div>
    <div class="content">
        <h2>Daftar Buku yang Tersedia</h2>
        <p>Berikut adalah daftar buku yang tersedia di perpustakaan:</p>

        <!-- Filter Buku -->
        <div class="filter-container">
            <div class="nganan">
                <a href="tambah_buku.html" class="btn">Tambah Buku</a>
            </div>
            <div class="ngiri">
                <select id="filter-kategori" class="filter-select">
                    <option value="all">Semua</option>
                    <option value="novel">Novel</option>
                    <option value="cerita">Cerita</option>
                    <option value="pendidikan">Pendidikan</option>
                    <option value="kamus">Kamus</option>
                </select>
                <button class="btn-filter" onclick="filterBuku()">Filter</button>
                <input type="text" id="search-judul" class="search-input" placeholder="Cari Judul Buku...">
                <button class="btn-search" onclick="searchBuku()">Search</button>
            </div>
        </div>

        <!-- Tabel List Buku -->
        <table id="tabel-buku">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Judul Buku</th>
                    <th>Penulis</th>
                    <th>Penerbit</th>
                    <th>Tahun Terbit</th>
                    <th>Kategori</th>
                    <th>Aksi</th> <!-- Kolom untuk tombol Edit dan Hapus -->
                </tr>
            </thead>
            <tbody>
                <tr data-kategori="pendidikan">
                    <td>1</td>
                    <td>Belajar Pemrograman</td>
                    <td>John Doe</td>
                    <td>dewi fatma</td>
                    <td>2021</td>
                    <td>Pendidikan</td>
                    <td>
                        <button class="openPopupBtn">Edit</button>
                        <a class="ab" href="hapus.html?id=1">Hapus</a>
                    </td>
                </tr>
                <tr data-kategori="pendidikan">
                    <td>2</td>
                    <td>Panduan HTML & CSS</td>
                    <td>Jane Smith</td>
                    <td>clara putih</td>
                    <td>2020</td>
                    <td>Pendidikan</td>
                    <td>
                        <button class="openPopupBtn">Edit</button>
                        <a class="ab" href="hapus.html?id=2">Hapus</a>
                    </td>
                </tr>
                <tr data-kategori="pendidikan">
                    <td>3</td>
                    <td>Algoritma dan Struktur Data</td>
                    <td>Clara Johnson</td>
                    <td>sinta ayu</td>
                    <td>2019</td>
                    <td>Pendidikan</td>
                    <td>
                        <button class="openPopupBtn">Edit</button>
                        <a class="ab" href="hapus.html?id=3">Hapus</a>
                    </td>
                </tr>
                <!-- More rows -->
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Copyright &copy; 2025 | Perpustakaan Digital</p>
    </div>

    <script>
        const closePopupButton = document.getElementById('closePopup');
        const popup = document.getElementById('formPopup');
        const openPopupButtons = document.querySelectorAll('.openPopupBtn');

        // Open the popup for each button
        openPopupButtons.forEach(button => {
            button.addEventListener('click', function() {
                popup.style.display = 'flex';
            });
        });

        // Close the popup
        closePopupButton.addEventListener('click', function() {
            popup.style.display = 'none';
        });

        // Close the popup if clicked outside the form
        window.addEventListener('click', function(event) {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        });

        function filterBuku() {
            const kategori = document.getElementById("filter-kategori").value;
            const rows = document.querySelectorAll("#tabel-buku tbody tr");

            rows.forEach(row => {
                const rowKategori = row.getAttribute("data-kategori");
                if (kategori === "all" || rowKategori === kategori) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        }

        function searchBuku() {
            const searchInput = document.getElementById("search-judul").value.toLowerCase();
            const rows = document.querySelectorAll("#tabel-buku tbody tr");

            rows.forEach(row => {
                const judulBuku = row.cells[1].innerText.toLowerCase();
                if (judulBuku.includes(searchInput)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        }
    </script>
</body>
</html>