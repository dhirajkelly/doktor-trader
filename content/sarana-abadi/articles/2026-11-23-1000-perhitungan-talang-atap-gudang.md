---
title: "Perhitungan Talang Atap Gudang: Rumus, Contoh, dan Detail Pasang"
slug: perhitungan-talang-atap-gudang
publish_at: "2026-11-23 10:00"
meta_title: "Perhitungan Talang Atap Gudang dan Contohnya"
meta_description: "Cara perhitungan talang atap gudang: debit air hujan, kapasitas talang, jumlah pipa turun, contoh hitungan langkah demi langkah, dan detail pemasangan."
focus_keyword: perhitungan talang atap gudang
categories: [Engineering & Design, Fabrication & Construction]
tags: [talang atap, drainase atap, pipa turun, atap gudang]
excerpt: "Langkah praktis menghitung debit air hujan, kapasitas talang, dan jumlah pipa turun untuk atap gudang, lengkap dengan contoh angka."
image_alt: "Gambar sampul artikel PT Sarana Abadi Raya tentang perhitungan talang atap gudang"
faq:
  - q: "Data apa saja yang dibutuhkan untuk menghitung talang atap gudang?"
    a: "Luas tangkapan atap per talang, intensitas hujan rencana untuk lokasi proyek, koefisien limpasan atap, dimensi dan kemiringan talang, serta kapasitas pipa turun yang akan dipakai."
  - q: "Berapa intensitas hujan yang dipakai untuk desain talang?"
    a: "Intensitas hujan sebaiknya diambil dari data curah hujan lokal dengan durasi pendek dan periode ulang yang disepakati. Angka 200 mm/jam dalam artikel ini hanya contoh untuk ilustrasi perhitungan."
  - q: "Mengapa talang gudang sering meluap padahal ukurannya besar?"
    a: "Penyebab yang umum adalah jumlah atau ukuran pipa turun yang kurang, saringan outlet tersumbat, kemiringan talang yang terbalik karena lendutan, dan tidak adanya saluran limpahan darurat."
  - q: "Apa beda sistem talang gravitasi dan siphonic?"
    a: "Sistem gravitasi mengandalkan aliran bebas sehingga butuh lebih banyak pipa turun. Sistem siphonic dirancang agar pipa terisi penuh sehingga satu pipa bisa melayani area lebih luas, tetapi desain dan pemasangannya harus mengikuti perhitungan khusus pemasok."
---

> Atap yang kuat tetap bocor bila air hujannya tidak punya jalan keluar yang cukup.

Gudang dan pabrik di Karawang, Bekasi, dan sekitarnya memiliki atap yang luas, sehingga satu kali hujan deras bisa menghasilkan debit air yang sangat besar dalam waktu singkat. Jika talang dan pipa turun tidak sanggup menampungnya, air meluap ke dalam bangunan, membasahi barang, merusak panel listrik, dan membuat lantai licin. Karena itu, **perhitungan talang atap gudang** perlu dilakukan sejak tahap desain, bukan ditentukan berdasarkan kebiasaan atau ukuran yang "biasa dipakai".

Artikel ini menjelaskan langkah perhitungan secara sederhana, dilengkapi contoh angka, serta detail pemasangan yang sering menentukan apakah talang benar-benar bekerja di lapangan. Perhitungan di sini bersifat pendekatan praktis; untuk desain final, gunakan data hujan lokal dan standar yang disepakati dalam spesifikasi proyek.

## Komponen Sistem Drainase Atap Gudang

Sistem drainase atap terdiri dari beberapa bagian yang bekerja bersama:

- **Bidang atap**, yang menangkap air hujan dan mengalirkannya ke tepi.
- **Talang**, baik talang tepi (eaves gutter) maupun talang dalam atau box gutter di antara dua bentang atap.
- **Outlet dan saringan**, titik air masuk dari talang ke pipa turun.
- **Pipa turun (downpipe)**, yang membawa air ke saluran di permukaan tanah.
- **Saluran limpahan darurat (overflow)**, jalur keluar air bila outlet tersumbat atau hujan melebihi rencana.
- **Saluran di permukaan**, misalnya saluran beton atau U-ditch di sekeliling bangunan.

Kapasitas sistem ditentukan oleh bagian yang paling lemah. Talang besar tidak ada artinya bila pipa turunnya kurang, dan pipa turun yang cukup tetap gagal bila saluran di bawahnya terlalu kecil. Pemilihan saluran permukaan bisa Anda baca di artikel kami tentang [saluran U-ditch vs pasangan batu kali](https://sarana-abadi.co.id/2026/11/18/saluran-u-ditch-vs-pasangan-batu-kali/).

## Langkah 1: Menghitung Debit Air Hujan dari Atap

Debit air yang masuk ke satu talang dapat didekati dengan rumus rasional dalam satuan yang praktis untuk atap:

**Q = C × I × A / 3.600**

dengan:

- Q = debit air hujan (liter/detik);
- C = koefisien limpasan, untuk atap metal umumnya diambil mendekati 1,0;
- I = intensitas hujan rencana (mm/jam);
- A = luas tangkapan atap yang mengalir ke talang tersebut, diukur pada proyeksi horizontal (m²).

Rumus ini berasal dari fakta sederhana bahwa hujan 1 mm di atas 1 m² sama dengan 1 liter air. Hujan I mm/jam di atas A m² menghasilkan I × A liter per jam, lalu dibagi 3.600 untuk mendapatkan liter per detik.

### Memilih intensitas hujan

Intensitas hujan adalah parameter yang paling menentukan. Untuk talang, yang dipakai adalah hujan berdurasi pendek karena atap merespons dalam hitungan menit. Nilainya sebaiknya diambil dari analisis data curah hujan setempat dengan periode ulang yang disepakati pemilik dan perencana. Angka yang kami pakai di contoh bawah murni ilustrasi.

### Luas tangkapan

Pada atap pelana dengan bubungan di tengah, setiap sisi atap mengalir ke talangnya sendiri. Pada gudang multi-bentang, box gutter di antara dua bentang menerima air dari dua sisi atap sekaligus, sehingga luas tangkapannya dua kali lebih besar. Beberapa standar juga memperhitungkan tambahan luas akibat dinding tegak atau kemiringan atap yang tertiup angin; ikuti ketentuan spesifikasi proyek Anda.

## Langkah 2: Menghitung Kapasitas Talang

Untuk talang dengan kemiringan, kapasitas aliran dapat didekati dengan rumus Manning:

**Q = (1/n) × A × R^(2/3) × S^(1/2)**

dengan:

- n = koefisien kekasaran (untuk pelat baja atau stainless yang licin sering diambil sekitar 0,012);
- A = luas penampang basah (m²);
- R = jari-jari hidrolis = A / keliling basah (m);
- S = kemiringan talang (m/m).

Pendekatan ini cukup untuk perkiraan awal. Untuk talang yang sangat landai atau datar, perencana biasanya memakai metode khusus drainase atap yang memperhitungkan tinggi muka air di outlet. Yang penting, jangan memakai tinggi talang penuh sebagai tinggi air: sisakan ruang bebas (freeboard) agar air tidak melimpas saat ada gelombang atau kotoran.

## Langkah 3: Menentukan Jumlah dan Jarak Pipa Turun

Jumlah pipa turun dihitung dari total debit dibagi kapasitas desain satu pipa:

**Jumlah pipa = Q total / Q per pipa**, dibulatkan ke atas.

Kapasitas desain per pipa diambil dari standar yang dipakai atau data teknis pemasok sistem, dan sangat dipengaruhi diameter pipa serta bentuk outlet. Selain jumlah, perhatikan juga jarak: makin rapat outlet, makin kecil debit yang harus mengalir di dalam talang menuju outlet.

## Contoh Perhitungan Talang Atap Gudang

Berikut contoh ilustrasi. Angka intensitas hujan dan kapasitas pipa adalah asumsi untuk latihan, bukan nilai desain.

**Data:**

- Gudang 60 m × 40 m, atap pelana, bubungan memanjang di tengah.
- Setiap sisi atap mengalir ke satu talang sepanjang 60 m.
- Lebar proyeksi horizontal tiap sisi atap = 40 / 2 = 20 m.
- Intensitas hujan rencana (contoh) I = 200 mm/jam; C = 1,0.
- Talang kotak lebar 300 mm, tinggi air rencana 150 mm, kemiringan 0,5%.
- Kapasitas desain satu pipa turun (asumsi contoh) = 6 liter/detik.

**1) Debit per sisi atap**

A = 60 × 20 = 1.200 m²

Q = 1,0 × 200 × 1.200 / 3.600 = 66,7 liter/detik

**2) Kapasitas talang (Manning)**

- Luas basah A = 0,30 × 0,15 = 0,045 m²
- Keliling basah P = 0,30 + 2 × 0,15 = 0,60 m
- R = 0,045 / 0,60 = 0,075 m, sehingga R^(2/3) ≈ 0,178
- S^(1/2) = √0,005 ≈ 0,0707
- Q talang = (1/0,012) × 0,045 × 0,178 × 0,0707 ≈ 0,047 m³/detik ≈ 47 liter/detik

**3) Jumlah pipa turun**

66,7 / 6 = 11,1, dibulatkan menjadi **12 pipa turun** per sisi, dengan jarak sekitar 60 / 12 = 5 m.

Setiap pipa melayani 5 m × 20 m = 100 m², atau 200 × 100 / 3.600 ≈ 5,6 liter/detik, masih di bawah asumsi kapasitas 6 liter/detik.

**4) Mengecek aliran di dalam talang**

Dengan outlet setiap 5 m, air di talang paling jauh menempuh sekitar 2,5 m sebelum mencapai outlet. Debit terbesar di dalam talang hanya sekitar setengah dari debit satu outlet, kira-kira 2,8 liter/detik, jauh di bawah kapasitas talang 47 liter/detik.

**Pembanding:** bila hanya dipasang dua outlet di kedua ujung, setiap outlet harus menerima 33,3 liter/detik. Talang masih sanggup mengalirkannya (33,3 < 47), tetapi pipa turun dengan kapasitas 6 liter/detik jelas tidak cukup. Inilah pola kegagalan yang sering terjadi: talang tampak besar, tetapi jumlah pipa turunnya terlalu sedikit.

| Skenario | Jumlah outlet per sisi | Debit per outlet | Status (asumsi 6 L/detik) |
|---|---|---|---|
| A | 12 | ±5,6 L/detik | Memenuhi |
| B | 6 | ±11,1 L/detik | Tidak memenuhi |
| C | 2 | ±33,3 L/detik | Tidak memenuhi |

## Detail Pemasangan yang Menentukan Kinerja

Perhitungan yang benar bisa gagal karena detail di lapangan. Hal-hal berikut perlu masuk gambar kerja dan diperiksa saat pemasangan:

1. **Kemiringan konsisten ke arah outlet.** Periksa dengan waterpass atau alat ukur. Lendutan dudukan talang dapat membuat genangan di titik tertentu.
2. **Dudukan dan penggantung yang cukup rapat.** Talang yang penuh air cukup berat; jarak dudukan harus memperhitungkan beban air dan orang saat perawatan.
3. **Sambungan kedap air.** Sambungan pelat dilas, dikeling dengan sealant, atau memakai sambungan pabrikan sesuai material.
4. **Sambungan muai.** Talang logam yang panjang memuai dan menyusut karena panas. Sediakan sambungan muai pada jarak yang dianjurkan pemasok.
5. **Saringan outlet.** Saringan berbentuk kubah mencegah daun dan plastik masuk ke pipa turun.
6. **Saluran limpahan darurat.** Pada box gutter, sediakan overflow yang membuang air ke luar bangunan, bukan ke dalam, bila outlet tersumbat.
7. **Pertemuan dengan atap.** Ujung lembaran atap harus menjorok cukup ke dalam talang dan diberi penahan, agar air tidak merembes balik ke bawah atap.

Pemilihan dan pemasangan lembaran atap yang tepat juga memengaruhi aliran ke talang. Detailnya kami bahas di artikel [jasa pemasangan atap spandek gudang](https://sarana-abadi.co.id/2026/11/22/jasa-pemasangan-atap-spandek-gudang/).

### Pilihan material talang

| Material | Kelebihan | Hal yang perlu diperhatikan |
|---|---|---|
| Pelat baja galvanis | Mudah difabrikasi, ekonomis | Perlu perlindungan tambahan di lingkungan korosif |
| Baja lapis aluminium-seng | Tahan karat lebih baik dari galvanis biasa | Hindari kontak langsung dengan tembaga atau beton basah |
| Stainless steel | Tahan korosi, umur panjang | Biaya lebih tinggi, pengelasan butuh keahlian khusus |
| PVC/uPVC | Ringan, tidak berkarat | Cocok untuk bentang dan debit kecil, sensitif terhadap UV dan panas |

Untuk box gutter pada gudang besar, pelat baja berlapis atau stainless lebih umum dipakai karena dimensinya dapat dibuat sesuai kebutuhan.

## Perawatan Talang Gudang

Talang yang dirancang dengan baik tetap membutuhkan perawatan rutin:

- bersihkan talang dan saringan secara berkala, terutama menjelang musim hujan;
- periksa sambungan dan sealant yang retak atau terlepas;
- pastikan tidak ada genangan permanen yang mempercepat korosi;
- sediakan akses aman ke atap (tangga, jalur pijak, titik angkur) bagi petugas perawatan.

Genangan di talang juga bisa memengaruhi kelembapan dan sirkulasi udara di bawah atap. Bila Anda sedang mengevaluasi kenyamanan termal gudang, artikel kami tentang [sistem ventilasi gudang](https://sarana-abadi.co.id/2026/11/21/sistem-ventilasi-gudang/) dapat menjadi referensi tambahan.

## Kesimpulan

Perhitungan talang atap gudang dimulai dari debit air hujan per luas tangkapan, lalu dicek terhadap kapasitas talang dan, yang sering terlupakan, kapasitas serta jumlah pipa turun. Contoh di atas menunjukkan bahwa talang yang besar tetap bisa meluap bila outletnya terlalu sedikit. Detail pemasangan seperti kemiringan, sambungan muai, saringan outlet, dan saluran limpahan darurat menentukan apakah hasil hitungan benar-benar bekerja saat hujan deras.

Bila Anda sedang merencanakan gudang baru atau mengatasi talang yang sering meluap, tim engineering PT Sarana Abadi Raya dapat membantu meninjau perhitungan dan detail pemasangannya. Silakan berkonsultasi dengan kami.
