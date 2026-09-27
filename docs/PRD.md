# Product Requirements Document: Next Store

## 1. Informasi Dokumen

| Item | Nilai |
|---|---|
| Produk | Next Store |
| Jenis | E-commerce single-store B2C |
| Pasar awal | Indonesia |
| Frontend | Next.js 16, React 19, TypeScript |
| Backend | Go REST API |
| Database | PostgreSQL |
| Mata uang awal | IDR |
| Sumber rancangan data | `docs/schema.md` |
| Status dokumen | Draft untuk validasi |

## 2. Ringkasan Produk

Next Store adalah aplikasi e-commerce single-store yang memungkinkan pengunjung menemukan produk, memilih varian, mengelola keranjang, memakai kupon, checkout sebagai tamu atau pengguna terdaftar, membayar melalui payment gateway, dan melacak status pesanan. Tim internal mengelola katalog, stok, pesanan, pembayaran, kupon, pengguna, dan hak akses melalui area admin.

MVP berfokus pada alur transaksi lengkap dan dapat dioperasikan: katalog hingga pembayaran terkonfirmasi dan pesanan selesai. Fitur marketplace, multi-store, multi-currency, loyalty, review, dan otomasi logistik lanjutan tidak masuk MVP.

## 3. Latar Belakang

Project saat ini berisi aplikasi frontend Next.js awal dan rancangan database PostgreSQL. Schema telah menyediakan domain utama:

- pengguna dan RBAC;
- brand, kategori, produk, gambar, varian, dan atribut;
- keranjang pengguna maupun tamu;
- alamat pelanggan dan snapshot alamat pesanan;
- pesanan dan item pesanan;
- pembayaran dan riwayat transaksi gateway;
- kupon dan pemakaian kupon.

PRD ini mengubah domain tersebut menjadi ruang lingkup produk, aturan bisnis, kontrak sistem, acceptance criteria, dan urutan pengembangan.

## 4. Visi dan Tujuan

### 4.1 Visi

Menyediakan pengalaman belanja online yang cepat, jelas, aman, dan mudah dioperasikan oleh tim toko kecil hingga menengah.

### 4.2 Tujuan MVP

1. Pelanggan dapat menyelesaikan pembelian tanpa wajib membuat akun.
2. Pelanggan terdaftar dapat menyimpan alamat dan melihat riwayat pesanan.
3. Harga, stok, diskon, ongkir, dan total pesanan dihitung konsisten oleh backend.
4. Pembayaran dapat dibuat, diverifikasi melalui webhook, dan direkonsiliasi.
5. Admin dapat menjalankan operasi harian tanpa akses langsung ke database.
6. Sistem mencegah overselling, pembayaran ganda, dan pemrosesan webhook ganda.
7. Storefront memiliki SEO dasar, performa baik, dan responsif pada mobile maupun desktop.

### 4.3 Non-goals MVP

- multi-vendor atau marketplace;
- multi-store dan multi-warehouse;
- multi-currency dan multi-language;
- review/rating produk;
- wishlist;
- loyalty points, referral, dan gift card;
- retur mandiri dan reverse logistics;
- refund parsial dari dashboard;
- integrasi kurir real-time dan label pengiriman otomatis;
- rekomendasi berbasis machine learning;
- native mobile app;
- social login.

## 5. Asumsi Produk MVP

Keputusan berikut dipakai agar implementasi memiliki batas jelas. Semua perlu dikonfirmasi sebelum Sprint 1.

| Area | Asumsi MVP |
|---|---|
| Model bisnis | Satu toko menjual produk milik sendiri |
| Wilayah | Pengiriman domestik Indonesia |
| Bahasa | Bahasa Indonesia |
| Mata uang | IDR saja |
| Pajak | Harga dianggap sudah termasuk pajak; `tax_amount = 0` kecuali kebijakan berubah |
| Ongkir | Tarif tetap atau gratis di atas ambang tertentu, dikonfigurasi di backend |
| Gateway | Midtrans sebagai gateway pertama; Xendit disiapkan sebagai ekspansi |
| Pembayaran | Metode yang didukung mengikuti konfigurasi akun gateway |
| Akun | Email dan password; checkout tamu tetap tersedia |
| Stok | Stok dikelola per varian; produk tanpa opsi tetap memiliki satu varian default |
| Kupon | Maksimal satu kupon per pesanan |
| Pengiriman | Admin memasukkan nomor resi dan kurir secara manual setelah MVP schema mendukung shipment |
| Pembatalan | Pelanggan hanya dapat membatalkan pesanan sebelum pembayaran berhasil |
| Refund | Diproses manual oleh admin/gateway pada MVP, lalu status direkonsiliasi ke aplikasi |
| Soft delete | Data transaksi tidak dihapus permanen melalui aplikasi |

## 6. Persona dan Hak Akses

### 6.1 Pengunjung/Tamu

- melihat dan mencari katalog;
- memilih varian dan memasukkan produk ke keranjang;
- checkout dengan email, telepon, dan alamat;
- membayar dan melihat status pesanan melalui tautan aman;
- mendaftar atau login.

### 6.2 Pelanggan Terdaftar

- seluruh kemampuan tamu;
- mengelola profil dan alamat;
- memiliki keranjang lintas perangkat setelah login;
- melihat riwayat dan detail pesanan;
- membatalkan pesanan yang masih memenuhi syarat.

### 6.3 Admin Operasional

- melihat dashboard ringkas;
- mengelola katalog dan stok sesuai permission;
- mengelola pesanan, pengiriman, pembayaran, dan kupon;
- melihat pelanggan sesuai permission;
- tidak dapat mengubah role/permission tanpa hak khusus.

### 6.4 Super Admin

- seluruh kemampuan admin;
- mengelola admin, role, dan permission;
- mengakses konfigurasi operasional yang tersedia;
- melihat audit aktivitas sensitif.

### 6.5 Role Awal

| Role | Tanggung jawab |
|---|---|
| `customer` | Fitur akun pelanggan |
| `catalog_admin` | Brand, kategori, atribut, produk, gambar, varian, stok |
| `order_admin` | Pesanan, pembayaran, shipment, refund manual |
| `marketing_admin` | Kupon |
| `super_admin` | Seluruh permission dan RBAC |

Backend wajib memeriksa permission per aksi. Menyembunyikan menu di frontend bukan kontrol keamanan.

## 7. Metrik Keberhasilan

### 7.1 KPI Produk

- checkout completion rate: persentase sesi checkout yang menghasilkan order;
- payment success rate: persentase pembayaran yang berstatus `paid`;
- cart abandonment rate;
- conversion rate dari kunjungan produk ke order terbayar;
- median waktu dari order dibuat sampai pembayaran berhasil;
- cancellation dan refund rate;
- persentase kegagalan checkout karena stok berubah;
- persentase pencarian tanpa hasil.

### 7.2 Target Teknis Awal

- availability bulanan API dan storefront minimal 99,5%, di luar maintenance terjadwal;
- p95 read API utama di bawah 500 ms pada beban normal, di luar latency pihak ketiga;
- p95 write API utama di bawah 800 ms, di luar payment gateway;
- Core Web Vitals storefront berstatus baik pada p75 data lapangan;
- error rate server di bawah 1% per 5 menit;
- tidak ada kehilangan order, overselling, atau pemrosesan webhook ganda pada acceptance test.

Target angka bisnis final ditetapkan setelah baseline analytics tersedia.

## 8. Ruang Lingkup Fungsional

### 8.1 Storefront dan Katalog

**FR-CAT-01 - Beranda**

- menampilkan navigasi kategori, produk pilihan/terbaru, dan promosi sederhana;
- hanya menampilkan produk `active`, varian aktif, dan entitas yang belum dihapus;
- seluruh CTA utama menuju daftar atau detail produk.

**FR-CAT-02 - Daftar produk**

- filter berdasarkan kategori, brand, rentang harga, dan ketersediaan;
- urutkan berdasarkan terbaru, harga terendah, dan harga tertinggi;
- pagination berbasis cursor atau page yang stabil;
- filter dan pagination tersimpan di URL;
- empty state dan error state tersedia.

**FR-CAT-03 - Pencarian**

- mencari nama, SKU, brand, dan kategori;
- input dinormalisasi dan dibatasi panjangnya;
- MVP memakai pencarian PostgreSQL, tanpa search engine tambahan;
- hasil tidak menampilkan produk nonaktif, draft, archived, atau soft-deleted.

**FR-CAT-04 - Detail produk**

- menampilkan nama, galeri, deskripsi, brand, kategori, harga, harga pembanding, opsi varian, stok, berat, dan SKU;
- harga dan stok berubah sesuai varian terpilih;
- tombol tambah ke keranjang nonaktif bila kombinasi varian belum lengkap atau stok habis;
- metadata SEO, canonical URL, Open Graph, dan structured data Product tersedia;
- slug tidak ditemukan menghasilkan halaman 404.

### 8.2 Autentikasi dan Akun

**FR-AUTH-01 - Registrasi**

- menerima nama, email, dan password;
- email dinormalisasi menjadi lowercase dan unik;
- password minimal 8 karakter; aturan final mengikuti kebijakan keamanan;
- akun baru memperoleh role `customer`;
- verifikasi email dikirim dan endpoint verifikasi bersifat single-use serta kedaluwarsa.

**FR-AUTH-02 - Login/logout**

- login memakai email dan password;
- sesi disimpan menggunakan cookie `HttpOnly`, `Secure`, dan `SameSite` yang sesuai;
- akun `inactive` atau `suspended` ditolak;
- login berhasil memperbarui `last_login_at`;
- logout mencabut sesi aktif.

**FR-AUTH-03 - Lupa/reset password**

- permintaan selalu memberi respons generik untuk mencegah enumerasi email;
- token reset single-use dan kedaluwarsa;
- reset berhasil mencabut sesi lama yang relevan.

**FR-AUTH-04 - Profil dan alamat**

- pelanggan dapat membaca dan mengubah nama serta telepon;
- pelanggan dapat CRUD alamat miliknya;
- satu alamat dapat ditandai default;
- hanya satu alamat default aktif per pengguna.

### 8.3 Keranjang

**FR-CART-01 - Keranjang tamu**

- backend membuat token tamu acak dengan entropy tinggi;
- token disimpan pada cookie aman dan tidak dapat ditebak;
- tamu dapat tambah, ubah kuantitas, hapus item, dan melihat ringkasan;
- cart memiliki masa kedaluwarsa dan dapat ditandai `abandoned`.

**FR-CART-02 - Keranjang pengguna**

- satu pengguna memiliki maksimal satu cart `active`;
- cart tersedia lintas perangkat setelah login;
- login menggabungkan cart tamu ke cart pengguna;
- item sama digabung dengan batas kuantitas sesuai stok.

**FR-CART-03 - Validasi**

- backend mengambil harga terbaru; harga dari client tidak dipercaya;
- produk dan varian harus aktif dan belum dihapus;
- kuantitas minimal 1 dan tidak melebihi stok maupun batas pembelian bila ada;
- `unit_price` cart adalah snapshot sementara untuk tampilan, bukan sumber final checkout;
- perubahan harga/stok ditampilkan sebelum pengguna melanjutkan checkout.

### 8.4 Checkout

**FR-CHK-01 - Identitas pelanggan**

- pengguna login memakai data akun dan dapat memilih alamat tersimpan;
- tamu wajib mengisi email, telepon, nama penerima, dan alamat lengkap;
- billing address dapat sama dengan shipping address;
- input divalidasi di server.

**FR-CHK-02 - Ringkasan biaya**

- backend menghitung ulang subtotal dari harga varian aktif;
- backend memvalidasi kupon dan menghitung diskon;
- backend menghitung ongkir dan pajak;
- rumus total: `subtotal - discount_amount + shipping_amount + tax_amount`;
- seluruh nilai uang memakai decimal/numeric, tidak memakai floating point.

**FR-CHK-03 - Pembuatan order**

- satu permintaan checkout memakai idempotency key;
- order, item, alamat snapshot, kupon, reservasi stok, dan inisiasi payment dicatat secara konsisten;
- kegagalan sebelum order valid tidak mengurangi stok permanen;
- respons berisi nomor order dan instruksi/URL pembayaran;
- cart menjadi `converted` setelah order berhasil dibuat.

### 8.5 Kupon

**FR-CPN-01 - Validasi kupon**

- kode diperlakukan case-insensitive setelah normalisasi;
- kupon harus aktif, sudah mulai, belum kedaluwarsa, dan belum mencapai limit;
- subtotal harus memenuhi `minimum_order_amount`;
- diskon percentage tidak boleh melebihi 100%;
- diskon fixed tidak boleh membuat total item negatif;
- `maximum_discount_amount` membatasi diskon persentase;
- ongkir dan pajak tidak didiskon pada MVP;
- pemakaian dihitung ketika order dibuat dan dilepas bila order kedaluwarsa/dibatalkan sebelum dibayar, sesuai keputusan bisnis final.

### 8.6 Pesanan

**FR-ORD-01 - Nomor dan snapshot**

- nomor order unik, tidak mengandung data pribadi, dan mudah dipakai customer support;
- order item menyimpan snapshot nama, nama varian, SKU, harga, kuantitas, dan subtotal;
- order address menyimpan snapshot sehingga perubahan alamat akun tidak mengubah order lama.

**FR-ORD-02 - Status pelanggan**

- pelanggan login dapat melihat daftar dan detail order miliknya;
- tamu mengakses detail melalui nomor order dan token rahasia, bukan nomor order saja;
- halaman detail menampilkan status order, status pembayaran, item, total, alamat, dan status pengiriman;
- informasi gateway mentah tidak pernah ditampilkan kepada pelanggan.

**FR-ORD-03 - Pembatalan**

- pelanggan dapat membatalkan order `pending` yang belum dibayar;
- admin dapat membatalkan sesuai permission dan wajib mengisi alasan;
- pembatalan melepaskan reservasi stok dan pemakaian kupon secara idempotent;
- order berbayar memerlukan alur refund, bukan pembatalan biasa.

**FR-ORD-04 - Fulfillment**

- admin mengubah order terkonfirmasi menjadi `processing`;
- admin mencatat kurir, layanan, dan nomor resi sebelum `shipped`;
- order dapat ditandai `delivered`, lalu `completed` sesuai konfirmasi/manual policy;
- perubahan status dicatat sebagai riwayat dan aktivitas admin.

### 8.7 Pembayaran

**FR-PAY-01 - Inisiasi**

- backend membuat transaksi ke Midtrans dengan external order ID unik;
- amount gateway harus sama dengan `orders.total_amount`;
- secret key hanya berada di backend;
- response gateway yang diperlukan disimpan untuk rekonsiliasi dengan redaksi data sensitif.

**FR-PAY-02 - Webhook**

- endpoint memverifikasi signature atau mekanisme autentikasi resmi gateway;
- payload diproses secara idempotent;
- event duplikat tidak membuat transaksi atau transisi status ganda;
- status tidak hanya dipercaya dari redirect browser;
- payload valid mendapat respons cepat; proses lanjutan dapat dilakukan asynchronous;
- event out-of-order tidak boleh menurunkan status final yang sah.

**FR-PAY-03 - Sinkronisasi status**

- transaksi sukses mengubah payment ke `paid` dan order ke `confirmed` secara atomic;
- pembayaran gagal, kedaluwarsa, atau dibatalkan memperbarui payment dan order sesuai state machine;
- status ambigu dapat direkonsiliasi dengan API gateway oleh admin/job;
- setiap percobaan tercatat pada `payment_transactions`.

**FR-PAY-04 - Refund**

- MVP mendukung pencatatan hasil refund manual;
- full refund mengubah payment dan order menjadi `refunded`;
- partial refund memerlukan nilai refund kumulatif dan audit trail sebelum diaktifkan.

### 8.8 Admin

**FR-ADM-01 - Dashboard**

- menampilkan order baru, order perlu diproses, pembayaran bermasalah, stok rendah, dan ringkasan penjualan;
- angka pendapatan hanya menghitung payment `paid`, dikurangi refund sesuai definisi laporan.

**FR-ADM-02 - Katalog**

- CRUD brand, kategori bertingkat, atribut, dan nilai atribut;
- CRUD produk, gambar, varian, harga, berat, SKU, dan stok;
- produk dapat disimpan sebagai draft lalu dipublikasikan;
- validasi mencegah kategori menjadi parent dirinya sendiri atau membentuk cycle;
- minimal satu gambar dapat ditandai primary;
- perubahan stok dan harga sensitif masuk audit log.

**FR-ADM-03 - Pesanan dan pembayaran**

- daftar dapat dicari dan difilter berdasarkan nomor, email, status, dan tanggal;
- detail menampilkan timeline, item, alamat, pembayaran, dan transaksi;
- aksi status hanya tersedia bila transisi valid;
- admin dapat mencatat shipment dan memicu rekonsiliasi pembayaran;
- data kartu, secret, dan payload sensitif tidak ditampilkan.

**FR-ADM-04 - Kupon**

- CRUD kupon percentage/fixed;
- validasi nilai, periode aktif, batas pemakaian, minimum order, dan maksimum diskon;
- kode tidak dapat diduplikasi setelah normalisasi;
- usage count tidak dapat diedit manual.

**FR-ADM-05 - Pengguna dan RBAC**

- mencari pengguna, melihat status, dan suspend/reactivate sesuai permission;
- mengelola admin, role, serta permission;
- pelanggan tidak dapat meningkatkan role sendiri;
- super admin terakhir tidak boleh dihapus atau kehilangan akses secara tidak sengaja.

## 9. Sitemap dan Halaman

### 9.1 Storefront

```text
/
|-- /products
|   `-- /products/[slug]
|-- /categories/[slug]
|-- /brands/[slug]
|-- /search?q=
|-- /cart
|-- /checkout
|-- /checkout/payment
|-- /order/[orderNumber]
|-- /login
|-- /register
|-- /forgot-password
|-- /reset-password
`-- /account
    |-- /account/profile
    |-- /account/addresses
    `-- /account/orders/[orderNumber]
```

### 9.2 Admin

```text
/admin
|-- /admin/products
|-- /admin/categories
|-- /admin/brands
|-- /admin/attributes
|-- /admin/orders
|-- /admin/payments
|-- /admin/coupons
|-- /admin/customers
|-- /admin/users
`-- /admin/roles
```

Setiap halaman wajib memiliki state loading, kosong, error, unauthorized, dan sukses yang relevan.

## 10. Alur Utama End-to-End

### 10.1 Pembelian Tamu

1. Pengunjung membuka katalog dan detail produk.
2. Pengunjung memilih varian aktif dan kuantitas.
3. Frontend meminta backend menambahkan item; backend memvalidasi stok dan harga.
4. Backend membuat atau memakai cart tamu berdasarkan token aman.
5. Pengunjung membuka checkout dan mengisi kontak serta alamat.
6. Backend menghitung ulang item, kupon, ongkir, pajak, dan total.
7. Pengunjung menyetujui ringkasan dan memilih pembayaran.
8. Backend, dalam transaksi database, membuat order snapshot dan reservasi stok dengan idempotency key.
9. Backend membuat payment ke gateway dan mengembalikan instruksi pembayaran.
10. Pelanggan menyelesaikan pembayaran di channel gateway.
11. Gateway mengirim webhook; backend memverifikasi, menyimpan event, dan memperbarui payment/order secara idempotent.
12. Frontend membaca status dari backend, bukan menganggap redirect sebagai bukti pembayaran.
13. Admin memproses, mengirim, dan menyelesaikan order.
14. Tamu melihat status melalui tautan bertoken yang dikirim ke email.

### 10.2 Pembelian Pengguna Login

Alur sama dengan tamu, dengan perbedaan:

- cart terikat ke `user_id`;
- alamat dapat dipilih dari address book;
- order otomatis muncul di riwayat akun;
- login setelah memiliki cart tamu memicu merge cart.

### 10.3 Pengelolaan Produk

1. Admin membuat brand/kategori/atribut bila diperlukan.
2. Admin membuat produk berstatus `draft`.
3. Admin mengunggah gambar dan menentukan gambar utama.
4. Admin membuat varian beserta kombinasi atribut, SKU, harga, berat, dan stok.
5. Backend memvalidasi SKU unik dan kombinasi atribut tidak duplikat.
6. Admin melakukan preview lalu mengubah status produk menjadi `active`.
7. Cache/revalidation storefront dijalankan setelah publikasi.

## 11. Aturan Bisnis dan State Machine

### 11.1 Status Order

| Dari | Ke | Pemicu |
|---|---|---|
| `pending` | `confirmed` | Pembayaran sukses atau konfirmasi admin untuk metode khusus |
| `pending` | `cancelled` | Pelanggan/admin membatalkan atau pembayaran kedaluwarsa |
| `confirmed` | `processing` | Admin mulai fulfillment |
| `processing` | `shipped` | Shipment dan nomor resi tercatat |
| `shipped` | `delivered` | Konfirmasi kurir/admin |
| `delivered` | `completed` | Konfirmasi pelanggan atau job setelah periode tertentu |
| status berbayar | `refunded` | Full refund berhasil |

Transisi lain ditolak dengan HTTP `409 Conflict`. `cancelled`, `completed`, dan `refunded` dianggap terminal untuk MVP.

### 11.2 Status Pembayaran

| Gateway/event | Payment status |
|---|---|
| transaksi dibuat | `pending` |
| settlement/capture sukses dan tervalidasi | `paid` |
| deny/failure | `failed` |
| expiry | `expired` |
| cancel | `cancelled` |
| full refund | `refunded` |
| partial refund | `partially_refunded` |

Mapping event harus ditulis eksplisit per gateway dan diuji memakai fixture resmi.

### 11.3 Stok

- `stock_quantity` tidak boleh negatif;
- checkout mengunci baris stok atau memakai conditional atomic update;
- reservasi stok memiliki expiry yang mengikuti expiry pembayaran;
- pembayaran sukses mengubah reservasi menjadi committed;
- payment expired/cancelled melepaskan reservasi tepat satu kali;
- admin stock adjustment menyimpan nilai sebelum, nilai sesudah, alasan, dan pelaku;
- produk tanpa variasi tetap memakai satu `product_variant` agar satu sumber stok/harga tersedia.

### 11.4 Harga

- `product_variants.price` menjadi harga jual final untuk varian;
- `products.base_price` dipakai untuk tampilan mulai-dari atau default administratif, bukan sumber checkout bila variant tersedia;
- `compare_at_price` harus kosong atau lebih besar dari harga jual;
- seluruh nilai harus non-negatif;
- order menyimpan snapshot agar perubahan katalog tidak mengubah histori.

## 12. Kontrak API Awal

API menggunakan prefix `/api/v1`, JSON, UTC ISO 8601, dan request ID. Daftar ini kontrak level produk, bukan spesifikasi OpenAPI final.

### 12.1 Public dan Auth

| Method | Path | Fungsi |
|---|---|---|
| `GET` | `/api/v1/products` | Daftar, filter, sort, pagination produk |
| `GET` | `/api/v1/products/{slug}` | Detail produk |
| `GET` | `/api/v1/categories` | Pohon kategori aktif |
| `GET` | `/api/v1/brands` | Brand aktif |
| `POST` | `/api/v1/auth/register` | Registrasi |
| `POST` | `/api/v1/auth/login` | Login |
| `POST` | `/api/v1/auth/logout` | Logout |
| `POST` | `/api/v1/auth/verify-email` | Verifikasi email |
| `POST` | `/api/v1/auth/forgot-password` | Minta reset password |
| `POST` | `/api/v1/auth/reset-password` | Reset password |
| `GET` | `/api/v1/me` | Profil saat ini |
| `PATCH` | `/api/v1/me` | Ubah profil |

### 12.2 Cart dan Checkout

| Method | Path | Fungsi |
|---|---|---|
| `GET` | `/api/v1/cart` | Ambil cart aktif |
| `POST` | `/api/v1/cart/items` | Tambah item |
| `PATCH` | `/api/v1/cart/items/{id}` | Ubah kuantitas |
| `DELETE` | `/api/v1/cart/items/{id}` | Hapus item |
| `POST` | `/api/v1/cart/merge` | Gabungkan cart tamu setelah login |
| `POST` | `/api/v1/checkout/quote` | Validasi dan hitung ringkasan final |
| `POST` | `/api/v1/checkout/orders` | Buat order idempotent |
| `POST` | `/api/v1/coupons/validate` | Validasi kupon terhadap cart |

### 12.3 Customer

| Method | Path | Fungsi |
|---|---|---|
| `GET/POST` | `/api/v1/me/addresses` | List/tambah alamat |
| `PATCH/DELETE` | `/api/v1/me/addresses/{id}` | Ubah/hapus alamat |
| `GET` | `/api/v1/me/orders` | Riwayat order |
| `GET` | `/api/v1/me/orders/{number}` | Detail order milik pengguna |
| `POST` | `/api/v1/me/orders/{number}/cancel` | Batalkan order yang memenuhi syarat |
| `GET` | `/api/v1/guest/orders/{number}` | Detail order tamu memakai token |

### 12.4 Payment dan Admin

| Method | Path | Fungsi |
|---|---|---|
| `POST` | `/api/v1/webhooks/midtrans` | Terima webhook Midtrans |
| `POST` | `/api/v1/admin/payments/{id}/reconcile` | Cek status ke gateway |
| `GET/POST/PATCH` | `/api/v1/admin/products...` | Operasi katalog |
| `GET/PATCH` | `/api/v1/admin/orders...` | Operasi order |
| `POST` | `/api/v1/admin/orders/{id}/shipments` | Catat pengiriman |
| `GET/POST/PATCH` | `/api/v1/admin/coupons...` | Operasi kupon |
| `GET/PATCH` | `/api/v1/admin/users...` | Operasi pengguna |
| `GET/POST/PATCH` | `/api/v1/admin/roles...` | Operasi RBAC |

### 12.5 Format Error

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Stok produk tidak mencukupi.",
    "fields": {
      "quantity": "Maksimal 2 item."
    },
    "request_id": "..."
  }
}
```

- code stabil dan dapat dipakai frontend;
- message aman untuk pengguna;
- detail internal hanya masuk structured log;
- validation error memakai HTTP `422`, auth `401`, forbidden `403`, not found `404`, conflict `409`, dan rate limit `429`.

## 13. Arsitektur Sistem

### 13.1 Komponen

```text
Browser
|-- Next.js storefront/admin
|   `-- Go REST API
|       |-- PostgreSQL
|       |-- Object storage/CDN untuk gambar
|       |-- Midtrans
|       |-- Email provider
|       `-- Background worker/job scheduler
`-- Midtrans hosted payment UI

Midtrans webhook --> Go REST API
```

### 13.2 Tanggung Jawab Frontend

- rendering halaman, interaksi, validasi UX, dan accessibility;
- server rendering untuk halaman katalog yang penting bagi SEO;
- memanggil Go API sebagai sumber data bisnis;
- tidak menghitung total final, menentukan otorisasi, atau menyimpan secret;
- melindungi UX route admin, sementara otorisasi final tetap di backend;
- memakai generated API types dari OpenAPI bila pipeline telah tersedia.

### 13.3 Tanggung Jawab Backend

- autentikasi, sesi, RBAC, validasi, aturan bisnis, dan transaksi database;
- perhitungan harga, diskon, ongkir, pajak, dan total;
- locking/reservasi stok dan idempotensi checkout;
- integrasi payment, webhook, email, object storage, dan scheduled jobs;
- menyediakan OpenAPI dan migration database;
- audit log, observability, dan rekonsiliasi.

### 13.4 Prinsip Integrasi

- REST menjadi satu-satunya kontrak frontend-backend pada MVP;
- UTC disimpan di database; frontend menampilkan zona waktu lokal;
- UUID dibuat di backend/database;
- request mutasi penting menerima `Idempotency-Key`;
- outbound call memiliki timeout, retry terbatas dengan backoff, dan logging aman;
- transaksi database tidak ditahan selama network call ke gateway; gunakan state/outbox yang sesuai;
- background job menangani expiry cart/order, pelepasan stok, email, dan rekonsiliasi.

## 14. Evaluasi Schema dan Perubahan Wajib

`docs/schema.md` merupakan fondasi baik, tetapi belum cukup untuk transaksi production. Perubahan berikut harus diselesaikan sebelum endpoint checkout dianggap selesai.

### 14.1 Penambahan Wajib Sebelum MVP

| Kebutuhan | Rekomendasi minimum | Alasan |
|---|---|---|
| Auth session | `sessions` dengan token hash, `user_id`, expiry, revoked timestamp, metadata terbatas | Login aman dan revocation |
| Verifikasi/reset | tabel token one-time dengan token hash, purpose, expiry, used timestamp | Verifikasi email dan reset password |
| Reservasi stok | `inventory_reservations` terkait order/variant, quantity, status, expiry | Mencegah overselling dan melepas stok secara aman |
| Shipment | `shipments` berisi order, courier, service, tracking number, status, timestamps | Schema sekarang tidak dapat menyimpan resi |
| Riwayat status | `order_status_histories` | Timeline dan audit transisi |
| Webhook inbox | `payment_webhook_events` dengan gateway event ID/payload hash dan unique constraint | Idempotensi dan investigasi webhook |
| Idempotency | `idempotency_keys` atau kolom unik checkout key | Mencegah order ganda akibat retry |
| Audit log | `audit_logs` untuk actor, action, entity, before/after aman, timestamp | Akuntabilitas aksi admin |
| Refund | `refunds` dengan amount, reason, external ID, status | Mendukung full/partial refund dengan benar |
| Stock movement | `inventory_movements` | Audit adjustment, reserve, release, sale, restock |

### 14.2 Constraint dan Index Wajib

- check `quantity > 0` pada cart/order/reservation;
- check seluruh amount, weight, stock, dan usage count `>= 0`;
- check diskon percentage `> 0 AND <= 100` dan fixed `> 0`;
- unique item cart berdasarkan cart + varian aktif agar item tidak terduplikasi;
- partial unique index satu cart aktif per `user_id` dan satu cart aktif per `guest_token`;
- partial unique index satu default address aktif per user;
- unique normalisasi email dan coupon code, misalnya dengan `lower(...)`;
- unique external payment/transaction ID yang memang unik per gateway;
- foreign key memiliki kebijakan `ON DELETE` eksplisit;
- index seluruh foreign key dan query filter utama;
- satu gambar primary aktif per produk;
- satu kombinasi atribut unik per varian perlu validasi transactional atau signature kombinasi;
- payment amount dan order total harus konsisten melalui business invariant;
- `updated_at` diperbarui oleh aplikasi atau trigger secara konsisten.

### 14.3 Klarifikasi Model Saat Implementasi

- `products.sku` sebaiknya dihapus atau hanya dipakai pada produk tanpa varian; satu sumber SKU lebih aman pada `product_variants`;
- `base_price/base_weight` perlu definisi tegas terhadap harga/berat varian;
- `payment_transactions.status` dan `payments.status` memakai enum berbeda; mapping wajib eksplisit;
- `order_status.refunded` mencampur fulfillment dan finansial, tetapi tetap dapat dipakai untuk full refund MVP;
- `order_coupons` memungkinkan banyak kupon, sedangkan MVP membatasi satu; tambahkan unique `order_id` bila keputusan tetap satu kupon;
- soft delete dan unique index perlu strategi agar slug/email/SKU dapat atau tidak dapat dipakai ulang secara sengaja;
- data `raw_request/raw_response` perlu redaksi, retention policy, dan kontrol akses.

## 15. Non-Functional Requirements

### 15.1 Security

- password di-hash dengan Argon2id atau bcrypt memakai parameter yang ditinjau;
- TLS wajib di seluruh environment non-lokal;
- cookie auth `HttpOnly`, `Secure`, dan konfigurasi `SameSite` yang benar;
- CSRF protection untuk mutasi berbasis cookie;
- CORS hanya mengizinkan origin resmi;
- rate limit login, reset password, coupon validation, checkout, dan webhook;
- validasi ownership pada seluruh resource pengguna;
- secret dikelola oleh secret manager/environment, tidak disimpan di repository;
- upload membatasi MIME type, ukuran, nama, dan melakukan validasi konten;
- query database parameterized;
- response/log tidak membocorkan password, token, secret gateway, atau data kartu;
- dependency dan container scanning dijalankan di CI;
- backup dienkripsi dan akses production mengikuti least privilege;
- mengikuti OWASP ASVS/Top 10 sebagai baseline review.

### 15.2 Privacy dan Retensi

- hanya mengumpulkan data yang dibutuhkan untuk transaksi dan fulfillment;
- privacy policy dan consent yang relevan tersedia;
- data pribadi disamarkan pada log;
- akses data pelanggan diaudit;
- retention order, payment, webhook, session, dan audit log ditentukan bersama kebutuhan legal/akuntansi Indonesia;
- proses permintaan akses/koreksi/penghapusan data dirancang tanpa merusak catatan transaksi wajib.

### 15.3 Accessibility

- target WCAG 2.2 AA untuk alur utama;
- seluruh fungsi dapat digunakan dengan keyboard;
- label, heading, focus state, error association, dan contrast memadai;
- galeri produk memiliki alt text;
- perubahan cart dan error checkout diumumkan melalui mekanisme screen reader yang tepat;
- dialog tidak menjebak atau kehilangan fokus.

### 15.4 Performance dan SEO

- gambar memakai format/ukuran responsif dan CDN;
- katalog publik memakai server rendering/caching yang cocok, dengan revalidation setelah perubahan;
- sitemap, robots, canonical, metadata, dan structured data tersedia;
- bundle client dijaga kecil; Client Components hanya ketika perlu interaksi;
- pagination dan query terindeks; hindari N+1 query;
- checkout dan account tidak di-cache secara publik.

### 15.5 Reliability dan Observability

- structured log memuat timestamp, level, service, request ID, actor ID bila aman, dan error code;
- metric minimum: request rate/error/latency, DB pool, checkout result, webhook result, payment mismatch, job failure;
- distributed tracing dapat ditambahkan saat service bertambah; request correlation wajib sejak MVP;
- alert untuk lonjakan 5xx, webhook gagal, payment mismatch, job expiry gagal, dan stok negatif;
- health endpoint memisahkan liveness dan readiness;
- PostgreSQL memiliki automated backup dan uji restore berkala;
- runbook tersedia untuk payment outage, webhook replay, rollback deploy, dan restore database.

## 16. Analytics dan Event

Event minimum dengan data pribadi seminimal mungkin:

- `view_item_list`;
- `view_item`;
- `search` dan `search_no_results`;
- `select_variant`;
- `add_to_cart`, `remove_from_cart`, `view_cart`;
- `begin_checkout`;
- `apply_coupon` dan hasilnya;
- `checkout_validation_failed` dengan reason code;
- `order_created`;
- `payment_started`, `payment_succeeded`, `payment_failed`;
- `order_cancelled`;
- `order_shipped`, `order_completed`, `order_refunded`.

Revenue analytics memakai event server-side payment sukses sebagai sumber utama, bukan event browser.

## 17. Notifikasi

Email MVP:

- verifikasi email;
- reset password;
- order dibuat dan instruksi pembayaran;
- pembayaran berhasil/gagal/kedaluwarsa;
- order diproses;
- order dikirim beserta resi;
- order dibatalkan;
- refund selesai.

Pengiriman email asynchronous. Kegagalan email tidak membatalkan transaksi bisnis; retry dan dead-letter handling wajib tersedia.

## 18. Acceptance Criteria MVP

MVP siap rilis bila seluruh kondisi berikut terpenuhi:

1. Produk aktif dapat ditemukan, difilter, dibuka, dan dipilih variannya pada mobile serta desktop.
2. Tamu dan pengguna login dapat mengelola cart; merge cart diuji untuk konflik kuantitas dan stok.
3. Harga, kupon, ongkir, pajak, dan total dihitung backend serta cocok dengan snapshot order.
4. Retry request checkout dengan idempotency key sama menghasilkan satu order.
5. Dua checkout konkuren untuk stok terakhir tidak dapat sama-sama berhasil.
6. Webhook valid mengubah payment/order sekali; webhook duplikat dan out-of-order aman.
7. Webhook dengan signature tidak valid ditolak dan dicatat tanpa mengekspos secret.
8. Order tamu tidak dapat dilihat hanya dengan menebak nomor order.
9. Pelanggan tidak dapat membaca/mengubah cart, alamat, atau order milik pengguna lain.
10. Admin tanpa permission menerima `403` dari backend untuk aksi terlarang.
11. Semua transisi order/payment di luar state machine ditolak.
12. Admin dapat membuat produk dengan varian, mengatur stok, mempublikasikan, dan melihatnya di storefront.
13. Admin dapat memproses order, mencatat shipment/resi, dan menyelesaikannya.
14. Payment expired/cancelled melepaskan reservasi stok dan hak pakai kupon tepat satu kali.
15. Build, lint, unit test, integration test, migration test, dan smoke E2E lulus di CI.
16. Backup database dan prosedur restore telah diuji di staging.
17. Monitoring, alert inti, runbook insiden, privacy policy, terms, dan kontak support tersedia.
18. Tidak ada temuan security severity critical/high yang belum ditangani.

## 19. Strategi Pengujian

### 19.1 Backend

- unit test untuk pricing, coupon, state machine, permission, dan mapping gateway;
- integration test dengan PostgreSQL nyata untuk transaction, constraint, locking, dan repository;
- contract test berdasarkan OpenAPI;
- fixture webhook resmi untuk sukses, gagal, expiry, refund, duplicate, dan out-of-order;
- race/concurrency test stok terakhir, usage limit kupon, dan idempotency;
- migration test dari database kosong dan rollback sesuai kebijakan migration.

### 19.2 Frontend

- component test untuk form dan state penting;
- integration test terhadap mock API contract;
- E2E desktop/mobile untuk browse, cart, guest checkout, login checkout, payment return, account order, dan admin fulfillment;
- accessibility test otomatis ditambah pemeriksaan keyboard/manual;
- visual check halaman utama dan state error/loading/empty.

### 19.3 Staging

- memakai sandbox Midtrans dan email sandbox;
- seed berisi produk tanpa varian visual, produk multi-varian, stok habis, harga diskon, dan kupon berbagai kondisi;
- UAT dilakukan oleh owner produk dan admin operasional;
- smoke test dijalankan setelah setiap deployment.

## 20. Langkah Pengembangan

Urutan ini berbasis dependency, bukan estimasi waktu. Sprint dapat disesuaikan dengan kapasitas tim.

### Fase 0 - Discovery dan Keputusan

**Hasil:** baseline produk disepakati.

1. Konfirmasi asumsi pada Bagian 5.
2. Pilih Midtrans sebagai gateway pertama dan metode pembayaran yang diaktifkan.
3. Tetapkan aturan pajak, ongkir, expiry pembayaran, pembatalan, completion, refund, dan kupon.
4. Definisikan katalog awal, struktur kategori, atribut, serta volume SKU/order yang diperkirakan.
5. Buat wireframe storefront, checkout, account, dan admin.
6. Tetapkan KPI baseline dan event analytics.
7. Putuskan topology repository/deployment frontend dan backend.

**Exit criteria:** keputusan bisnis tertulis, wireframe disetujui, scope MVP terkunci.

### Fase 1 - Foundation dan Schema

**Hasil:** local development, CI, database, dan kontrak dasar siap.

1. Buat service Go dengan konfigurasi, HTTP router, structured logging, validation, health checks, dan graceful shutdown.
2. Sediakan PostgreSQL lokal dan environment terpisah untuk test/staging.
3. Ubah DBML menjadi migration SQL versioned.
4. Tambahkan tabel/constraint wajib pada Bagian 14.
5. Buat seed role, permission, super admin, dan data katalog test.
6. Definisikan OpenAPI, format error, pagination, auth cookie, request ID, dan idempotency header.
7. Siapkan CI untuk lint, test, build, migration, secret scan, dan dependency scan.
8. Siapkan preview/staging deployment dan pengelolaan secret.

**Exit criteria:** environment dapat dibangun dari nol, migration dan smoke test lulus.

### Fase 2 - Auth dan RBAC

**Hasil:** autentikasi pelanggan/admin dan otorisasi backend berjalan.

1. Implement registrasi, login, logout, session, verifikasi email, dan reset password.
2. Implement profile dan address book.
3. Implement middleware auth dan permission checks.
4. Implement admin user/role/permission minimum.
5. Tambahkan rate limit, CSRF, cookie security, dan audit aksi sensitif.
6. Bangun halaman auth/account frontend.

**Exit criteria:** ownership dan RBAC integration test lulus; tidak ada privilege escalation pada review.

### Fase 3 - Katalog dan Admin Katalog

**Hasil:** katalog dapat dikelola dan dilihat publik.

1. Implement CRUD brand, kategori, atribut, dan nilai atribut.
2. Implement produk, gambar, varian, kombinasi atribut, harga, berat, SKU, dan stok.
3. Integrasikan object storage/CDN dengan validasi upload.
4. Implement endpoint listing/detail/search/filter/sort.
5. Bangun beranda, PLP, PDP, kategori, brand, dan search.
6. Tambahkan metadata SEO, sitemap, structured data, dan revalidation.
7. Uji aksesibilitas, responsive layout, dan performa katalog.

**Exit criteria:** admin dapat mempublikasikan produk; produk muncul benar di storefront.

### Fase 4 - Cart, Pricing, dan Kupon

**Hasil:** cart tamu/login dan pricing engine stabil.

1. Implement lifecycle cart tamu dan pengguna.
2. Implement add/update/remove dan validasi stok/harga.
3. Implement merge cart saat login.
4. Implement pricing service untuk subtotal, diskon, ongkir, pajak, dan total.
5. Implement admin kupon dan validasinya secara transactional.
6. Bangun halaman/mini-cart dan penanganan perubahan harga/stok.
7. Tambahkan job abandonment/expiry cart.

**Exit criteria:** seluruh unit test pricing dan concurrency kupon lulus.

### Fase 5 - Checkout, Order, dan Inventory

**Hasil:** order dapat dibuat secara idempotent tanpa overselling.

1. Implement checkout quote.
2. Implement snapshot item/alamat dan generator nomor order.
3. Implement inventory reservation, expiry, commit, release, dan movements.
4. Implement idempotent order creation dan cart conversion.
5. Implement order list/detail untuk pengguna dan secure guest access.
6. Implement cancellation rules dan status history.
7. Bangun checkout UI, success/pending/failure state, dan detail order.
8. Jalankan concurrency test stok terakhir dan retry checkout.

**Exit criteria:** invariants order, total, stok, kupon, dan idempotensi terbukti melalui integration test.

### Fase 6 - Payment

**Hasil:** pembayaran Midtrans end-to-end berjalan di sandbox.

1. Implement adapter Midtrans dan penyimpanan payment/transaction.
2. Implement webhook verification dan inbox idempotent.
3. Implement mapping state, reconciliation, expiry, dan retry aman.
4. Integrasikan hosted payment UI/redirect sesuai metode terpilih.
5. Implement email status payment/order.
6. Implement admin payment detail dan reconcile action.
7. Uji fixture duplicate, out-of-order, forged webhook, timeout, dan gateway outage.

**Exit criteria:** sandbox payment sukses/gagal/expiry terproses benar dan dapat direkonsiliasi.

### Fase 7 - Fulfillment dan Admin Operasional

**Hasil:** order berbayar dapat diproses sampai selesai.

1. Implement dashboard admin dan antrean order.
2. Implement state transition processing, shipped, delivered, completed.
3. Implement shipment, kurir, layanan, nomor resi, dan email pengiriman.
4. Implement refund record minimum dan sinkronisasi status.
5. Lengkapi audit log dan export operasional minimum bila dibutuhkan.
6. Uji seluruh permission role operasional.

**Exit criteria:** admin dapat menjalankan siklus order penuh tanpa akses database.

### Fase 8 - Hardening dan Launch

**Hasil:** production siap menerima transaksi.

1. Jalankan E2E, accessibility, performance, load, security, dan disaster recovery test.
2. Perbaiki race condition, N+1, slow query, dan failure mode pihak ketiga.
3. Aktifkan dashboard observability dan alert.
4. Finalisasi legal pages, email sender domain, analytics consent, dan support flow.
5. Migrasikan/seed katalog production dan verifikasi stok/harga.
6. Lakukan UAT dan dry run order-refund bersama operasional.
7. Siapkan rollback plan, on-call owner, runbook, dan launch checklist.
8. Soft launch ke pengguna terbatas, pantau KPI/error, lalu buka penuh.

**Exit criteria:** acceptance criteria Bagian 18 terpenuhi dan owner produk memberi sign-off.

### Fase 9 - Pasca Peluncuran

Prioritas berdasarkan data, bukan otomatis masuk scope:

1. integrasi ongkir/kurir real-time dan label otomatis;
2. refund otomatis dan retur;
3. Xendit sebagai gateway alternatif;
4. wishlist, review, dan notifikasi WhatsApp;
5. promotion rules lebih kompleks dan batas kupon per pengguna;
6. search engine khusus bila PostgreSQL tidak lagi memenuhi latency/relevance;
7. multi-warehouse bila operasi membutuhkannya;
8. laporan bisnis dan rekonsiliasi finansial lebih lengkap.

## 21. Pembagian Backlog MVP

| Epic | Dependensi | Prioritas |
|---|---|---|
| Platform foundation | Tidak ada | P0 |
| Database hardening | Foundation | P0 |
| Auth dan session | Database | P0 |
| RBAC | Auth | P0 |
| Catalog admin | RBAC, storage | P0 |
| Public catalog | Catalog | P0 |
| Cart | Public catalog, auth opsional | P0 |
| Pricing dan coupon | Cart | P0 |
| Inventory reservation | Catalog, database | P0 |
| Checkout dan order | Pricing, inventory, auth | P0 |
| Midtrans payment | Order | P0 |
| Customer orders | Order, auth | P0 |
| Admin fulfillment | Order, RBAC, shipment | P0 |
| Email notification | Auth, order, payment | P0 |
| Analytics dan observability | Foundation, tiap epic | P0 |
| Refund record | Payment, admin | P1 untuk launch bila refund manual di luar sistem diterima sementara |
| Advanced reports | Payment/order | P2 |

## 22. Definition of Done

Setiap story dianggap selesai bila:

- acceptance criteria story terpenuhi;
- validasi, authorization, error, loading, empty, dan retry state ditangani;
- unit/integration/E2E test relevan ditambahkan dan lulus;
- migration aman dan dapat dijalankan pada staging;
- OpenAPI dan generated client/type diperbarui bila kontrak berubah;
- accessibility dan responsive behavior diperiksa;
- log, metric, dan audit event relevan tersedia tanpa data sensitif;
- security review dilakukan untuk auth, payment, upload, dan akses data;
- dokumentasi operasional diperbarui;
- deploy ke staging dan smoke test berhasil;
- tidak ada bug severity critical/high terbuka.

## 23. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Overselling saat checkout bersamaan | Order tidak dapat dipenuhi | Reservasi stok transactional, locking/atomic update, concurrency test |
| Webhook duplicate/out-of-order | Status atau stok salah | Inbox event unik, state guard, idempotent handler |
| Client memanipulasi harga | Kerugian finansial | Hitung seluruh total di backend dari data database |
| Payment sukses tetapi webhook terlambat | Pelanggan melihat status salah | Pending UX, polling terbatas, reconciliation job/admin |
| Kupon melewati usage limit | Kerugian promosi | Counter transactional/locking dan unique redemption policy |
| Akun admin diambil alih | Kebocoran/kerusakan data | Session aman, rate limit, MFA pasca-MVP atau sebelum launch bila risiko tinggi, audit log |
| PII masuk log/raw payload | Risiko privasi | Redaction, access control, retention, secure logging review |
| Gateway atau email outage | Checkout/notifikasi terganggu | Timeout, retry aman, queue, circuit handling, runbook |
| Scope melebar | Launch tertunda | Non-goals tegas, change control, prioritasi P0/P1/P2 |
| Schema soft-delete dan unique tidak konsisten | Data duplikat atau gagal reuse | Putuskan policy dan gunakan partial unique indexes |

## 24. Pertanyaan Terbuka Sebelum Implementasi

1. Produk apa yang dijual dan apakah ada batas umur, barang digital, pre-order, atau regulasi khusus?
2. Apakah harga sudah termasuk pajak? Apakah invoice pajak dibutuhkan?
3. Bagaimana formula ongkir MVP dan wilayah mana yang dilayani?
4. Metode Midtrans mana yang akan diaktifkan dan berapa lama pembayaran berlaku?
5. Kapan stok dikurangi: saat order dibuat/reserved atau saat payment berhasil? PRD mengusulkan reserve saat order dibuat.
6. Apakah usage kupon dilepas saat order tidak dibayar?
7. Apakah satu pelanggan boleh memakai kupon sama berulang kali? Schema saat ini belum memiliki batas per pengguna.
8. Apakah guest checkout wajib verifikasi email atau cukup tautan order bertoken?
9. Apakah order selesai otomatis setelah status delivered? Jika ya, berapa hari?
10. Siapa yang boleh mengubah stok, harga, status order, dan refund?
11. Apakah admin wajib memakai MFA sebelum production?
12. Kurir apa yang dipakai dan apakah resi manual cukup untuk MVP?
13. Berapa estimasi jumlah SKU, traffic, dan order harian tahun pertama?
14. Berapa lama cart, data webhook, audit log, dan data pengguna disimpan?
15. Apakah desain storefront dan brand guideline sudah tersedia?

## 25. Launch Checklist Ringkas

- domain, TLS, DNS, CDN, dan environment production siap;
- migration production diuji pada salinan staging;
- role/permission dan akun super admin diverifikasi;
- katalog, harga, stok, gambar, berat, dan SKU diperiksa;
- Midtrans production key, webhook URL, signature verification, dan metode pembayaran diverifikasi;
- email domain SPF/DKIM/DMARC dan template diuji;
- backup, restore, monitoring, alert, dan runbook diuji;
- privacy policy, terms, refund/cancellation policy, dan support contact dipublikasi;
- order nyata bernilai kecil diuji dari katalog sampai refund;
- rollback owner dan incident contact tersedia;
- analytics conversion dan revenue server-side tervalidasi.
