// ============================================================
// DATA SALATIGA STUDENT HUB
// Sumber utama: Pengumuman Rektor UIN Salatiga Nomor B-1047/Un.29/R/PP.00.1/07/2026
// (Teknis dan Jadwal Kegiatan Praperkuliahan Mahasiswa Baru TA 2026/2027)
// ============================================================

const SOURCE_PRAPERKULIAHAN = 'https://placementtest.uinsalatiga.ac.id/public/templatev1/docs/jadwal-praperkuliahan-maba-2026-2027.pdf';

// ---------- 1. ALUR MAHASISWA BARU ----------
const alurData = [
    {
        id: 'registrasi',
        title: 'Registrasi dan Ambil Akun SIAKAD',
        date: 'Setelah dinyatakan lolos seleksi',
        mode: 'Daring',
        summary: 'Lakukan registrasi/daftar ulang di web Registrasi UIN Salatiga. Dari sini kamu mendapatkan Nomor Induk Mahasiswa (NIM) dan password untuk masuk SIAKAD.',
        details: [
            'Buka web registrasi resmi dan ikuti tahapan daftar ulang sesuai jalur seleksi yang kamu lolosi.',
            'Simpan NIM dan password dengan aman. Keduanya dipakai untuk login SIAKAD dan aplikasi SMART MHS.',
            'Jadwal registrasi tiap jalur seleksi berbeda dan diumumkan di uinsalatiga.ac.id.'
        ],
        links: [{ label: 'Buka web Registrasi', url: 'https://registrasi.uinsalatiga.ac.id/' }]
    },
    {
        id: 'placement',
        title: 'Placement Test Bahasa Arab dan Inggris',
        date: '10-11 Agustus 2026',
        time: '07.30-15.00 WIB',
        mode: 'Daring',
        summary: 'Tes untuk memetakan kemampuan Bahasa Arab dan Bahasa Inggris. Hasilnya tidak memengaruhi nilai atau kelulusan mata kuliah.',
        details: [
            'Dikerjakan daring lewat laman placementtest.uinsalatiga.ac.id. Kamu bebas memilih waktu mengerjakan antara pukul 07.30 sampai 15.00 WIB pada hari yang sesuai dengan prodimu.',
            'Kerjakan sendiri tanpa membuka referensi atau bantuan orang lain, karena tujuannya memetakan kemampuanmu.',
            'Pembagian hari ujian per fakultas dan prodi ada pada lampiran pengumuman resmi (tautan di bawah).'
        ],
        links: [
            { label: 'Laman Placement Test', url: 'https://placementtest.uinsalatiga.ac.id/' },
            { label: 'Pengumuman resmi (PDF)', url: SOURCE_PRAPERKULIAHAN }
        ]
    },
    {
        id: 'baca-quran',
        title: 'Tes Baca Al-Qur\'an',
        date: 'Kamis, 13 Agustus 2026',
        time: '07.30-11.45 WIB',
        mode: 'Daring',
        summary: 'Tes baca Al-Qur\'an dilakukan secara daring lewat WhatsApp Video Call atau Zoom.',
        details: [
            'Pastikan nomor HP di SIAKAD adalah milikmu sendiri (bukan milik orang tua) dan terhubung dengan WhatsApp.',
            'Kamu akan dimasukkan ke grup WhatsApp sesuai penguji.',
            'Pastikan tempat mengikuti tes terjangkau sinyal internet yang baik.'
        ],
        links: []
    },
    {
        id: 'pbak',
        title: 'PBAK (Pengenalan Budaya Akademik dan Kemahasiswaan)',
        date: '18-21 Agustus 2026',
        mode: null,
        summary: 'Kegiatan pengenalan budaya akademik dan kemahasiswaan untuk mahasiswa baru, berlangsung Selasa sampai Jumat.',
        details: [
            'Ketentuan pelaksanaan selengkapnya diumumkan di Instagram @pbakuinsalatiga.',
            'Di akun yang sama tersedia data Kakak Asuh PBAK yang bisa dihubungi saat kamu butuh bantuan.'
        ],
        links: [{ label: 'Instagram @pbakuinsalatiga', url: 'https://www.instagram.com/pbakuinsalatiga' }]
    },
    {
        id: 'validasi',
        title: 'Validasi Data dan Update Biodata SIAKAD',
        date: '24-27 Agustus 2026',
        mode: 'Daring',
        summary: 'Masuk SIAKAD, cocokkan data pokokmu dengan KTP, lalu perbarui biodata.',
        details: [
            'Login lewat siakad.uinsalatiga.ac.id atau aplikasi SMART MHS (Play Store) memakai NIM dan password dari web Registrasi.',
            'Menu "Validasi Data Terkait Dikti": periksa nama, tempat lahir, tanggal lahir, NIK, dan nama ibu kandung (untuk pelaporan PDDikti).',
            'Menu "Account Update Biodata TA 2026/2027 Ganjil": perbarui alamat, nomor HP, dan data pribadi lain.',
            'Jika ada perbedaan data dengan KTP, hubungi Subbag Layanan Akademik: 0812-2748-1708 atau 0811-2820-505.'
        ],
        links: [{ label: 'Buka SIAKAD', url: 'https://siakad.uinsalatiga.ac.id/' }]
    },
    {
        id: 'krs',
        title: 'Pengisian KRS (Kartu Rencana Studi)',
        date: '24-27 Agustus 2026',
        mode: 'Daring',
        summary: 'Pilih mata kuliah semester pertamamu lewat SIAKAD atau aplikasi SMART MHS.',
        details: [
            'Isi KRS sesuai jadwal yang ditentukan.',
            'Mahasiswa yang tidak mengisi KRS sesuai jadwal tidak akan tercantum dalam daftar peserta kelas.',
            'Kesulitan mengisi KRS? Konsultasikan dengan Kakak Asuh PBAK masing-masing.'
        ],
        links: [{ label: 'Buka SIAKAD', url: 'https://siakad.uinsalatiga.ac.id/' }]
    },
    {
        id: 'user-education',
        title: 'User Education Perpustakaan',
        date: '24-27 Agustus 2026',
        mode: 'Daring',
        summary: 'Pengenalan layanan perpustakaan untuk mahasiswa baru lewat web perpustakaan.',
        details: [
            'Masuk ke web perpustakaan, lalu buka menu User Education.',
            'Isi data kehadiran sesuai fakultasmu.',
            'Pedoman lengkap ada pada lampiran pengumuman resmi.'
        ],
        links: [{ label: 'Web Perpustakaan', url: 'https://perpus.uinsalatiga.ac.id/' }]
    },
    {
        id: 'kuliah-umum',
        title: 'Kuliah Umum',
        date: 'Kamis, 27 Agustus 2026',
        time: '07.30-11.30 WIB',
        mode: null,
        summary: 'Kuliah umum untuk mahasiswa baru.',
        details: [
            'Ketentuan lebih lanjut diumumkan melalui laman uinsalatiga.ac.id.'
        ],
        links: [{ label: 'uinsalatiga.ac.id', url: 'https://uinsalatiga.ac.id/' }]
    }
];

// ---------- 2. FAKULTAS DAN PROGRAM STUDI (S1) ----------
const fakultasData = [
    {
        id: 'ftik',
        kampus: 'Kampus 3 Terpadu',
        name: 'Fakultas Tarbiyah dan Ilmu Keguruan',
        short: 'FTIK',
        kampusTag: 'k3',
        alamat: 'Jl. Lingkar Salatiga Km. 2, Pulutan, Sidorejo, Salatiga',
        telp: '(0298) 323706',
        mapsUrl: 'https://www.google.com/maps?q=Kampus+UIN+Salatiga&ll=-7.3099524,110.4776987&z=17',
        website: 'https://tarbiyah.uinsalatiga.ac.id/',
        icon: 'fa-chalkboard-user',
        prodi: [
            'Pendidikan Agama Islam',
            'Pendidikan Bahasa Arab',
            'Tadris Bahasa Inggris',
            'Pendidikan Guru Madrasah Ibtidaiyah',
            'Pendidikan Islam Anak Usia Dini (PIAUD)',
            'Tadris IPA',
            'Tadris Matematika',
            'Bimbingan dan Konseling Pendidikan Islam'
        ]
    },
    {
        id: 'syariah',
        kampus: 'Kampus 2',
        name: 'Fakultas Syariah',
        short: 'Syariah',
        kampusTag: 'k2',
        alamat: 'Jl. Nakula Sadewa V No. 9, Salatiga',
        telp: '(0298) 323706',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jalan+Nakula+Sadewa+V+No.+9+Salatiga',
        website: 'https://syariah.uinsalatiga.ac.id/',
        icon: 'fa-scale-balanced',
        prodi: [
            'Hukum Keluarga Islam (Ahwal Syakhshiyyah)',
            'Hukum Ekonomi Syariah (Mu\'amalah)',
            'Hukum Tata Negara (Siyasah Syar\'iyyah)'
        ]
    },
    {
        id: 'fuah',
        kampus: 'Kampus 2',
        name: 'Fakultas Ushuluddin, Adab dan Humaniora',
        short: 'FUAH',
        kampusTag: 'k2',
        alamat: 'Jl. Nakula Sadewa V No. 9, Salatiga',
        telp: '(0298) 323706',
        mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jalan+Nakula+Sadewa+V+No.+9+Salatiga',
        website: 'https://fuadah.uinsalatiga.ac.id/',
        icon: 'fa-book-quran',
        prodi: [
            'Bahasa dan Sastra Arab',
            'Aqidah dan Filsafat Islam',
            'Ilmu Al-Qur\'an dan Tafsir',
            'Sejarah Peradaban Islam',
            'Ilmu Hadis'
        ]
    },
    {
        id: 'saintek',
        kampus: 'Kampus 3 Terpadu (sementara; gedung fakultas masih dalam pembangunan)',
        name: 'Fakultas Sains dan Teknologi',
        short: 'Sains & Teknologi',
        kampusTag: 'k3',
        alamat: 'Jl. Lingkar Salatiga Km. 2, Pulutan, Sidorejo, Salatiga',
        telp: '(0298) 323706',
        mapsUrl: 'https://www.google.com/maps?q=Kampus+UIN+Salatiga&ll=-7.3099524,110.4776987&z=17',
        website: null,
        icon: 'fa-microchip',
        prodi: [
            'Sains Data',
            'Teknologi Informasi',
            'Perpustakaan dan Sains Informasi'
        ]
    },
    {
        id: 'dakwah',
        kampus: 'Kampus 3 Terpadu',
        name: 'Fakultas Dakwah',
        short: 'Dakwah',
        kampusTag: 'k3',
        alamat: 'Jl. Lingkar Salatiga Km. 2, Pulutan, Sidorejo, Salatiga',
        telp: '(0298) 323706',
        mapsUrl: 'https://www.google.com/maps?q=Kampus+UIN+Salatiga&ll=-7.3099524,110.4776987&z=17',
        website: 'https://dakwah.uinsalatiga.ac.id/',
        icon: 'fa-bullhorn',
        prodi: [
            'Komunikasi dan Penyiaran Islam',
            'Pengembangan Masyarakat Islam',
            'Manajemen Dakwah',
            'Psikologi Islam'
        ]
    },
    {
        id: 'febi',
        kampus: 'Kampus 3 Terpadu',
        name: 'Fakultas Ekonomi dan Bisnis Islam',
        short: 'FEBI',
        kampusTag: 'k3',
        alamat: 'Jl. Lingkar Salatiga Km. 2, Pulutan, Sidorejo, Salatiga',
        telp: '(0298) 323706',
        mapsUrl: 'https://www.google.com/maps?q=Kampus+UIN+Salatiga&ll=-7.3099524,110.4776987&z=17',
        website: 'https://febi.uinsalatiga.ac.id/',
        icon: 'fa-coins',
        prodi: [
            'Perbankan Syariah',
            'Ekonomi Syariah',
            'Akuntansi Syariah',
            'Manajemen Bisnis Syariah',
            'Bisnis Digital'
        ]
    }
];

// ---------- 3. HIDUP DI SALATIGA (DIREKTORI LAPANGAN REAL) ----------
const directoryData = [
    {
        id: 101,
        title: "Kost Putri Fa-Riz",
        category: "kost",
        campusTag: "k3",
        location: "Kawasan Ringroad / Pulutan · Near Kampus 3",
        price: "Hubungi Pengelola",
        numericPrice: null,
        jarakKm: 0.5,
        badge: "Kos Putri",
        image: "images/kost-fariz.jpeg", 
        contact: "085725836064",
        source: "Dokumentasi Langsung",
        description: "Kos khusus putri lokasi strategis dekat area kampus. Lingkungan tenang dan aman bagi mahasiswa baru.",
        facilities: ["Kamar Mandi", "Parkir Motor", "Ventilasi Bagus", "Akses 24 Jam"],
        mapQuery: "Kost%20Putri%20Fa-Riz%20Salatiga"
    },
    {
        id: 102,
        title: "Kost Putri Nana Fisa",
        category: "kost",
        campusTag: "k3",
        location: "Sekitar Area Kampus 3 UIN Salatiga",
        price: "Hubungi Pengelola",
        numericPrice: null,
        jarakKm: 0.4,
        badge: "Kos Putri 2 Lantai",
        image: "images/kost-nanafisa.jpeg", 
        source: "Dokumentasi Langsung",
        description: "Gedung kos putri 2 lantai dengan fasilitas bersih, akses mudah menuju jalan utama, dan dekat dengan fasilitas umum.",
        facilities: ["Gedung 2 Lantai", "Balkon Atas", "Parkir Motor", "Pagar Pengaman"],
        mapQuery: "Kost%20Putri%20Nana%20Fisa%20Salatiga"
    },
    {
        id: 103,
        title: "Kos Putri NUZULIS Pulutan",
        category: "kost",
        campusTag: "k3",
        location: "Jl. Darma Bakti No. 8, Pulutan · ±0,9 km dari Kampus 3",
        price: "Hubungi Pengelola",
        numericPrice: null,
        jarakKm: 0.9,
        badge: "Kos Putri Pulutan",
        image: "images/kost-nuzulis.png", 
        source: "Google Maps",
        description: "Kos khusus putri berlokasi di kawasan Pulutan, Sidorejo. Lingkungan tenang, aman, serta nyaman untuk mahasiswa UIN Salatiga yang berkuliah di Kampus 3 Terpadu.",
        facilities: ["Kamar Nyaman", "Parkir Motor", "Kamar Mandi", "Akses Mudah Kampus 3"],
        mapQuery: "Kos%20Putri%20Nuzulis%20Pulutan%20Salatiga"
    },
    {
        id: 104,
        title: "Kost Putra \"LANGIT\" (Khusus UIN Salatiga)",
        category: "kost",
        campusTag: "k3",
        location: "Pulutan, Sidorejo · ±0,5 km dari Kampus 3",
        price: "Hubungi Pengelola",
        numericPrice: null,
        jarakKm: 0.5,
        badge: "Kos Putra Khusus UIN",
        image: "images/kost-langit.png", 
        source: "Google Maps",
        description: "Kos khusus putra yang dikhususkan untuk mahasiswa UIN Salatiga. Berlokasi strategis di kawasan Pulutan dengan akses yang dekat menuju Kampus 3 Terpadu.",
        facilities: ["Khusus Mahasiswa UIN", "Parkir Motor", "Kamar Mandi", "Akses Dekat Kampus 3"],
        mapQuery: "Kost%20Putra%20%22Langit%22%20Salatiga"
    },
    {
        id: 105,
        title: "Kost Putra Ibu Nasikhah",
        category: "kost",
        campusTag: "k3",
        location: "Dsn. Krompakan, RT.003/RW.04, Pulutan · ±0,7 km dari Kampus 3",
        price: "Hubungi Pengelola",
        numericPrice: null,
        jarakKm: 0.7,
        badge: "Kos Putra Pulutan",
        image: "images/kost-nasikhah.png",
        source: "Google Maps",
        description: "Kos khusus putra yang berlokasi di Dusun Krompakan, Pulutan. Lingkungan asri, tenang, dan strategis dekat dengan area Kampus 3 Terpadu UIN Salatiga.",
        facilities: ["Lingkungan Tenang", "Parkir Motor", "Kamar Mandi", "Akses Mudah Kampus 3"],
        mapQuery: "Kost%20Putra%20Ibu%20Nasikhah%20Salatiga"
    },
    {
        id: 106,
        title: "ASA space 20",
        category: "cafe",
        campusTag: "k1",
        location: "Jl. Seruni, Sidorejo Lor · ±0,7 km dari Kampus 1",
        price: "Mulai Rp 15.000",
        numericPrice: 15000,
        jarakKm: 0.7,
        badge: "Kafe & Aesthetic Space",
        image: "images/cafe-space.png", 
        source: "Dokumentasi Langsung",
        description: "Kafe dengan konsep arsitektur minimalis modern dan area outdoor yang nyaman. Sangat cocok untuk mengerjakan tugas kuliah, diskusi kelompok, atau sekadar bersantai.",
        facilities: ["Wi-Fi Area", "Area Outdoor", "Stopkontak/Colokan", "Area Parkir", "Toilet"],
        mapQuery: "ASA%20space%20Salatiga"
    },
    {
        id: 107,
        title: "Bento Kopi / Bento Cafe",
        category: "cafe",
        campusTag: "k3",
        location: "Kawasan Pulutan / Ringroad · Near Kampus 3 UIN Salatiga",
        price: "Mulai Rp 10.000",
        numericPrice: 10000,
        jarakKm: 0.5,
        badge: "Kafe Space Luas & Murah",
        image: "images/cafe-bento.jpeg", 
        source: "Dokumentasi Langsung",
        description: "Tempat nongkrong andalan mahasiswa dengan area indoor & outdoor yang sangat luas. Menu ramah kantong, colokan melimpah, dan nyaman untuk nugas sampai malam.",
        facilities: ["Wi-Fi Kencang", "Area Outdoor & Indoor Luas", "Banyak Colokan", "Musholla", "Parkir Luas"],
        mapQuery: "Bento%20Kopi%20Salatiga"
    },
    {
        id: 108,
        title: "Scenery Coffee & Eatery",
        category: "cafe",
        campusTag: "k3",
        location: "Perumahan Green Hill, Blotongan · ±1,8 km dari Kampus 3",
        price: "Mulai Rp 20.000",
        numericPrice: 20000,
        jarakKm: 1.8,
        badge: "Kafe View & Eatery",
        image: "images/scenery-coffee.png",
        source: "Google Maps",
        description: "Kafe dan tempat makan dengan pemandangan terbuka yang estetik. Cocok untuk ajang meeting, kerja kelompok, maupun bersantai sore hari.",
        facilities: ["View Ciamik", "Wi-Fi Kencang", "Menu Makanan Berat & Ringan", "Area Parkir Luas"],
        mapQuery: "Scenery%20Coffee%20%26%20Eatery%20Salatiga"
    },
    {
        id: 109,
        title: "BESTER Coffee & Pastry",
        category: "cafe",
        campusTag: "k1",
        location: "Jl. DR. Muwardi No. 51, Kutowinangun Kidul, Tingkir · ±1,2 km dari Kampus 1",
        price: "Mulai Rp 18.000",
        numericPrice: 18000,
        jarakKm: 1.2,
        badge: "Coffee & Pastry",
        image: "images/bester-coffee.png",
        source: "Google Maps",
        description: "Kafe yang menyajikan pilihan aneka hidangan pastry segar dan varian racikan kopi nikmat. Suasana tempat bersih dan tenang untuk fokus nugas atau diskusi santai.",
        facilities: ["Wi-Fi", "Aneka Pastry & Roti", "Stopkontak", "Indoor AC", "Toilet"],
        mapQuery: "BESTER%20Coffee%20%26%20Pastry%20Salatiga"
    },
    {
        id: 110,
        title: "Toko Kopi Secerca #2 - Chapter Kemiri",
        category: "cafe",
        campusTag: "k1",
        location: "Kawasan Kemiri, Salatiga · ±1,2 km dari Kampus 1",
        price: "Mulai Rp 15.000",
        numericPrice: 15000,
        jarakKm: 1.2,
        badge: "Kopi & Space Nugas",
        image: "images/secerca-kemiri.png",
        source: "Google Maps",
        description: "Kedai kopi favorit mahasiswa dengan tempat terkonsep asri dan adem. Pilihan menu es kopi susu terjangkau serta pas untuk tempat berkumpul pasca kuliah.",
        facilities: ["Wi-Fi Area", "Area Indoor & Outdoor", "Stopkontak", "Parkir Motor"],
        mapQuery: "Toko%20Kopi%20Secerca%20-%20Chapter%20Kemiri%20Salatiga"
    },
    {
        id: 111,
        title: "ERHA JAYA Print Fotocopy Alat Tulis",
        category: "print",
        campusTag: "k2",
        location: "Jl. Merak No. 29, Mangunsari · ±0,5 km dari Kampus 2",
        price: "Harga Mahasiswa",
        numericPrice: null,
        jarakKm: 0.5,
        badge: "Fotokopi, Print & ATK",
        image: "images/erha-jaya.png", 
        source: "Google Maps",
        description: "Pusat penyedia jasa fotokopi, cetak dokumen, jilid berkas, serta penjualan alat tulis kantor (ATK) lengkap yang strategis dekat Kampus 2 UIN Salatiga.",
        facilities: ["Print Warna & Hitam Putih", "Fotokopi Berkas", "Jilid Dokumen", "Penjualan ATK Lengkap"],
        mapQuery: "ERHA%20JAYA%20Print%20Fotocopy%20Alat%20Tulis%20Salatiga"
    },
    {
        id: 112,
        title: "Master Fotocopy Pulutan",
        category: "print",
        campusTag: "k3",
        location: "Jl. Dipomenggolo, Pulutan · ±0,7 km dari Kampus 3",
        price: "Tanya pengelola",
        numericPrice: null,
        jarakKm: 0.7,
        badge: "Fotokopi & Print",
        source: "Google Maps",
        description: "Layanan fotokopi dan print di Jl. Dipomenggolo, Pulutan. Layanan, tarif, dan jam buka belum diverifikasi, jadi cek di Google Maps sebelum datang. Jarak sekitar 0,7 km dari Kampus 3 (garis lurus, perkiraan). Data dari Google Maps, dicek 17 Oktober 2026.",
        facilities: [],
        mapQuery: "Master%20Fotocopy%20Pulutan%20Salatiga&query_place_id=ChIJoW5Qy2Z4ei4RHeE4NI-1TTc"
    },
    {
        id: 113,
        title: "Fajar Photocopy",
        category: "print",
        campusTag: "k2",
        location: "Jl. Nakula Sadewa Raya No. 2, Dukuh · ±0,4 km dari Kampus 2",
        price: "Tanya pengelola",
        numericPrice: null,
        jarakKm: 0.4,
        badge: "Fotokopi & Print",
        source: "Google Maps",
        description: "Layanan fotokopi dan print di Jl. Nakula Sadewa Raya No. 2, Dukuh. Layanan, tarif, dan jam buka belum diverifikasi, jadi cek di Google Maps sebelum datang. Jarak sekitar 0,4 km dari Kampus 2 (garis lurus, perkiraan). Data dari Google Maps, dicek 17 Oktober 2026.",
        facilities: [],
        mapQuery: "Fajar%20Photocopy%20Salatiga&query_place_id=ChIJISZhCU14ei4RItojj9YCb60"
    },
    {
        id: 114,
        title: "Fotokopi DEO",
        category: "print",
        campusTag: "k2",
        location: "Jl. Nakula Sadewa VA, Dukuh · ±0,2 km dari Kampus 2",
        price: "Tanya pengelola",
        numericPrice: null,
        jarakKm: 0.2,
        badge: "Fotokopi & Print",
        source: "Google Maps",
        description: "Layanan fotokopi dan print di Jl. Nakula Sadewa VA, Dukuh. Layanan, tarif, dan jam buka belum diverifikasi, jadi cek di Google Maps sebelum datang. Jarak sekitar 0,2 km dari Kampus 2 (garis lurus, perkiraan). Data dari Google Maps, dicek 17 Oktober 2026.",
        facilities: [],
        mapQuery: "Fotokopi%20DEO%20Salatiga&query_place_id=ChIJj4bk8XZ5ei4Rsv0nuPp2Oag"
    }
];
