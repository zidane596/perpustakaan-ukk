const Beranda = require("../imag/Beranda.png");
const Peminjaman = require("../imag/Peminjaman.png");
const DaftarBuku = require("../imag/DaftarBuku.png");
const Laporan = require("../imag/Laporan.png");
const Akun = require("../imag/Akun.png");

export const Admin = [
    {
        key : 'beranda admin',
        label : 'Beranda',
        path : '/beranda-admin',
        icon : Beranda,
    },
    {
        key : 'peminjaman admin',
        label : 'Peminjaman',
        path : '/peminjaman-admin',
        icon : Peminjaman
    },
    {
        key : 'daftar akun admin',
        label : 'Daftar Akun',
        path : '/daftar-user-admin',
        icon : Akun
    },
    {
        key : 'daftar buku admin',
        label : 'Daftar Buku',
        path : '/daftar-buku-admin',
        icon : DaftarBuku
    },
    {
        key : 'laporan admin',
        label : 'Laporan',
        path : '/laporan-admin',
        icon : Laporan
    }

]

export const User = [
    {
        key : 'beranda user',
        label : 'Beranda',
        path : '/beranda',
        icon : Beranda
    },
    {
        key : 'peminjaman user',
        label : 'Peminjaman',
        path : '/peminjaman',
        icon : Peminjaman
    },
    {
        key : 'koleksi buku user',
        label : 'Koleksi Buku',
        path : '/koleksi-buku',
        icon : DaftarBuku
    },
    {
        key : 'akun user',
        label : 'Akun',
        path : '/akun',
        icon : Akun
    }
]
export const Petugas = [
    {
        key : 'beranda petugas',
        label : 'Beranda',
        path : '/beranda-petugas',  
        icon : Beranda
    },
    {
        key : 'peminjaman petugas',
        label : 'Peminjaman',
        path : '/peminjaman-petugas',
        icon : Peminjaman
    },
    {
        key : 'daftar buku petugas',
        label : 'Koleksi Buku',
        path : '/daftar-buku-petugas',
        icon : DaftarBuku
    },
    {
        key : 'akun petugas',
        label : 'Akun',
        path : '/akun-petugas',
        icon : Akun
    }
]