const Beranda = require("../imag/Beranda.png");
const Peminjaman = require("../imag/Peminjaman.png");
const DaftarBuku = require("../imag/DaftarBuku.png");
const Laporan = require("../imag/Laporan.png");
const Akun = require("../imag/Akun.png");

export const Admin = [
    {
        key : 'beranda',
        label : 'Beranda',
        path : '/beranda',
        icon : Beranda
    },
    {
        key : 'peminjaman',
        label : 'Peminjaman',
        path : '/peminjaman',
        icon : Peminjaman
    },
    {
        key : 'daftar Buku',
        label : 'Daftar Buku',
        path : '/daftar-buku',
        icon : DaftarBuku
    },
    {
        key : 'laporan',
        label : 'Laporan',
        path : '/laporan',
        icon : Laporan
    }

]

export const User = [
    {
        key : 'beranda',
        label : 'Beranda',
        path : '/beranda',
        icon : Beranda
    },
    {
        key : 'peminjaman',
        label : 'Peminjaman',
        path : '/peminjaman',
        icon : Peminjaman
    },
    {
        key : 'koleksi Buku',
        label : 'Koleksi Buku',
        path : '/koleksi-buku',
        icon : DaftarBuku
    },
    {
        key : 'akun',
        label : 'Akun',
        path : '/akun',
        icon : Akun
    }
]