export const reviews = [
    {
        id: 1,
        name: "John Doe",
        comment:
            "Pelayanan sangat memuaskan, hasil vaporblasting seperti baru! Tim AWM Garage sangat profesional dan ramah.",
        image: "/portofolio/portofolio1.jpeg",
        rating: 5, // Tambahkan rating (1-5)
    },
    {
        id: 2,
        name: "Jane Smith",
        comment:
            "Chrome coating-nya sangat mengkilap dan tahan lama, terima kasih AWM Garage atas hasil yang luar biasa!",
        image: "/portofolio/portofolio2.jpeg",
        rating: 4, // Tambahkan rating
    },
    {
        id: 3,
        name: "Alice Johnson",
        comment:
            "Sandblasting cepat, rapi, dan hasilnya memuaskan. Bengkel ini benar-benar recommended!",
        image: "/portofolio/portofolio3.jpg",
        rating: 5, // Tambahkan rating
    },
    {
        id: 4,
        name: "Bob Brown",
        comment:
            "Bengkel yang sangat profesional dengan harga bersaing, pasti kembali lagi untuk layanan lainnya!",
        image: "/portofolio/portofolio4.jpg",
        rating: 4, // Tambahkan rating
    },
];

// Data untuk Portofolio
export const portfolios = [
    "/portofolio/portofolio1.jpeg",
    "/portofolio/portofolio2.jpeg",
    "/portofolio/portofolio3.jpeg",
    "/portofolio/portofolio4.jpg",
    "/portofolio/portofolio5.jpg",
    "/portofolio/portofolio6.jpg",
    "/portofolio/portofolio7.jpg",
    "/portofolio/portofolio8.jpg",
    "/portofolio/portofolio9.jpg",
    "/portofolio/portofolio10.jpg",
    "/portofolio/portofolio11.jpg",
    "/portofolio/portofolio12.jpg",
    "/portofolio/portofolio13.jpg",
    "/portofolio/portofolio14.jpg",
    "/portofolio/portofolio15.jpg",
    "/portofolio/portofolio16.jpeg",
    "/portofolio/portofolio17.jpeg",
    "/portofolio/portofolio18.jpeg",
    "/portofolio/portofolio19.jpeg",
    "/portofolio/portofolio20.jpeg",
    "/portofolio/portofolio21.jpeg",
    "/portofolio/portofolio22.jpeg",
    "/portofolio/portofolio23.jpeg",
    "/portofolio/portofolio24.jpeg",
    "/portofolio/portofolio25.jpeg",
    "/portofolio/portofolio26.jpeg",
    "/portofolio/portofolio27.jpg",
    "/portofolio/portofolio28.jpeg",
    "/portofolio/portofolio29.jpeg",
    "/portofolio/portofolio30.jpeg",
];

// Data untuk Layanan Unggulan
export const services = [
    {
        icon: "/icons/icon-vaporblasting.webp",
        title: "Vaporblasting",
        desc: "Teknik pembersihan halus dengan kombinasi air dan media abrasif, ideal untuk komponen mesin agar kembali bersih dan seperti baru.",
    },
    {
        icon: "/icons/icon-sandblasting.webp",
        title: "Sandblasting",
        desc: "Proses pembersihan dengan semprotan abrasif bertekanan tinggi untuk menghilangkan karat, cat lama, dan kotoran membandel pada berbagai material.",
    },
    {
        icon: "/icons/icon-powdercoating.webp",
        title: "Powder Coating",
        desc: "Metode pelapisan tanpa cat cair yang menghasilkan lapisan tahan lama, anti karat, dan tersedia dalam berbagai warna serta finishing premium.",
    },
    {
        icon: "/icons/icon_zinc_plating.png",
        title: "Zinc Plating",
        desc: "Lapisan anti-karat yang melindungi baja dan logam besi dari korosi, menjaga tampilan tetap kinclong dan usia komponen lebih panjang.",
    },
    {
        icon: "/icons/icon-modification.webp",
        title: "Modification & Restoration",
        desc: "Transformasikan kendaraanmu menjadi lebih keren, bertenaga, dan terlihat seperti baru dengan modifikasi kustom dan restorasi berkualitas—tampil beda, rasakan sensasi berkendara yang tak terlupakan",
    },
    {
        icon: "/icons/icon-parts-custom.webp",
        title: "Parts & Custom",
        desc: "Layanan pembuatan dan modifikasi berbagai parts eksklusif yang dirancang sesuai kebutuhan kendaraan atau proyek khusus Anda.",
    },
];

// Data untuk Kelebihan Pemesanan
export const advantages = [
    {
        icon: "/icons/order.png",
        title: "Kemudahan Pemesanan",
        desc: "Pesan layanan hanya dalam beberapa klik dan semua sudah terkalkulasi dari semua biaya yang akan dikeluarkan.",
    },
    {
        icon: "/icons/cost.png",
        title: "Kemudahan Penghitungan Biaya dan Estimasi Pengerjaan",
        desc: "Estimasi biaya transparan dan Estimasi Lama Pengerjaan sebelum pemesanan.",
    },
    {
        icon: "/icons/queue.png",
        title: "Transparansi Antrian",
        desc: "Lihat status antrian secara real-time sebelum melakukan pemesanan.",
    },
    {
        icon: "/icons/complaint.png",
        title: "Kemudahan Komplain",
        desc: "Memastikan hasil pengerjaan pesanan sebelum dikirim.",
    },
    {
        icon: "/icons/shipping.png",
        title: "Cek Ongkir",
        desc: "Hitung ongkir untuk perencanaan anggaran dari berbagai pilihan kurir dan lokasi.",
    },
    {
        icon: "/icons/payment.png",
        title: "Pembayaran Mudah",
        desc: "Pembayaran bisa dilakukan DP dahulu dan opsi pembayaran beragam serta aman dan fleksibel.",
    },
];

// Data untuk Kontak (opsional, jika ingin dipisahkan juga)
export const contacts = [
    {
        icon: "/icons/phone.png",
        label: "Telepon",
        value: "+62 896 3889 2960",
    },
    {
        icon: "/icons/gmail.png",
        label: "Email",
        value: "aguswijaiia95@gmail.com",
    },
    {
        icon: "/icons/instagram.png",
        label: "Instagram",
        value: "@wiijaiaagus",
    },
    {
        icon: "/icons/whatsapp.png",
        label: "WhatsApp",
        value: "https://wa.me/6289638892960",
        isLink: true,
    },
];

export default {
    reviews,
    portfolios,
    services,
    advantages,
    contacts,
};
