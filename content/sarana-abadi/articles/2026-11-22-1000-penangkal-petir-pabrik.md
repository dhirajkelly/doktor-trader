---
title: "Penangkal Petir Pabrik: Komponen, Grounding, dan Pemeriksaan Berkala"
slug: penangkal-petir-pabrik
publish_at: "2026-11-22 10:00"
meta_title: "Penangkal Petir Pabrik: Komponen & Grounding"
meta_description: "Panduan penangkal petir pabrik: komponen proteksi eksternal dan internal, grounding maksimal 5 ohm, contoh hitungan elektroda, dan pemeriksaan berkala."
focus_keyword: penangkal petir pabrik
categories: ["Engineering & Design", "Safety, Health & Environment (SHE)"]
tags: [penangkal petir, grounding, instalasi listrik pabrik, K3 listrik]
excerpt: "Cara kerja penangkal petir pabrik, komponen yang wajib ada, cara menurunkan tahanan grounding, dan jadwal pemeriksaan berkala sesuai aturan."
image_alt: "Gambar sampul artikel PT Sarana Abadi Raya tentang penangkal petir pabrik dan sistem grounding"
faq:
  - q: "Berapa batas tahanan pembumian penangkal petir?"
    a: "Permenaker PER.02/MEN/1989 tentang Pengawasan Instalasi Penyalur Petir menyebut tahanan pembumian seluruh sistem tidak boleh lebih dari 5 ohm. Pengukuran dianjurkan dilakukan pada musim kemarau."
  - q: "Seberapa sering penangkal petir pabrik harus diperiksa?"
    a: "Menurut Permenaker 02/1989, instalasi diperiksa sebelum diserahkan kepada pemakai, setelah ada perubahan atau perbaikan, secara berkala setiap dua tahun, dan setelah ada kerusakan akibat sambaran petir."
  - q: "Apakah grounding panel listrik boleh dipisah dari grounding penangkal petir?"
    a: "Sistem pembumian yang terpisah tanpa ikatan dapat menimbulkan beda potensial berbahaya saat terjadi sambaran. Praktik yang umum adalah mengikat (bonding) sistem-sistem pembumian sesuai desain perencana, ditambah pemasangan SPD pada panel."
  - q: "Apakah penangkal petir saja cukup untuk melindungi mesin dan PLC?"
    a: "Tidak. Penangkal petir eksternal melindungi bangunan, sedangkan peralatan elektronik membutuhkan proteksi internal berupa equipotential bonding dan surge protective device (SPD) yang dikoordinasikan."
---

> Petir tidak bisa dicegah, tetapi jalurnya ke tanah bisa direncanakan.

Pabrik memiliki atap luas, struktur baja tinggi, cerobong, tangki, dan peralatan elektronik yang sensitif. Satu sambaran petir dapat merusak panel, menghentikan produksi, bahkan memicu kebakaran. Itulah sebabnya **penangkal petir pabrik** bukan aksesori, melainkan sistem keselamatan yang harus dirancang, dipasang, dan diperiksa secara berkala.

Artikel ini menjelaskan komponen sistem proteksi petir, hubungan penangkal petir dengan grounding instalasi listrik, contoh perhitungan elektroda pembumian, ketentuan pemeriksaan menurut peraturan ketenagakerjaan, serta kesalahan yang sering ditemui di lapangan.

## Cara Kerja Sistem Proteksi Petir

Sistem proteksi petir bekerja dengan menyediakan jalur yang terencana bagi arus petir dari titik sambar ke tanah, sehingga arus tidak mencari jalannya sendiri melalui struktur, pipa, atau kabel. Secara umum, sistem terbagi menjadi dua:

- **Proteksi eksternal**: menangkap sambaran dan menyalurkannya ke tanah. Terdiri atas terminal udara (air terminal), penghantar penurunan (down conductor), dan sistem pembumian.
- **Proteksi internal**: mencegah beda potensial dan lonjakan tegangan di dalam bangunan. Terdiri atas ikatan ekuipotensial (equipotential bonding) dan surge protective device (SPD).

Perencanaan sistem biasanya diawali dengan penilaian risiko yang mempertimbangkan lokasi, dimensi bangunan, jenis isi bangunan, dan konsekuensi kerusakan. Rujukan yang sering dipakai perencana di Indonesia antara lain SNI 03-7015-2004 tentang sistem proteksi petir pada bangunan gedung dan seri standar internasional IEC 62305.

## Komponen Penangkal Petir Pabrik

### Terminal Udara

Terminal udara adalah bagian yang menerima sambaran. Bentuknya dapat berupa batang tegak (finial), konduktor horizontal yang membentuk jala (mesh) di atas atap, atau kombinasi keduanya. Pada atap metal yang luas, perencana dapat memanfaatkan atap dan rangka sebagai bagian sistem bila ketebalan dan sambungannya memenuhi syarat. Ada pula produk terminal dengan klaim radius proteksi besar; pilihan sistem sebaiknya mengikuti perhitungan perencana dan standar yang dirujuk dalam desain.

### Penghantar Penurunan

Penghantar penurunan menyalurkan arus dari terminal udara ke pembumian melalui jalur terpendek dan selurus mungkin, tanpa tekukan tajam. Untuk bangunan yang luas, beberapa penghantar penurunan dipasang tersebar di keliling bangunan. Kolom baja struktur dapat dimanfaatkan sebagai penghantar alami bila kontinuitas listriknya terjamin.

### Sistem Pembumian

Pembumian terdiri atas elektroda (batang, pita, atau jaringan cincin di sekeliling bangunan), konduktor penghubung, dan bak kontrol untuk pengukuran. Di setiap ujung penghantar penurunan biasanya disediakan sambungan uji (test joint) agar tahanan pembumian bisa diukur tanpa membongkar instalasi.

### Proteksi Internal

- **Equipotential bonding**: mengikat rangka baja, pipa logam, rak kabel, dan sistem pembumian menjadi satu potensial.
- **SPD**: dipasang bertingkat di panel utama, panel distribusi, dan dekat peralatan sensitif seperti PLC, inverter, dan sistem kontrol.

## Hubungan Penangkal Petir dan Grounding Instalasi Listrik

Di banyak pabrik, grounding panel listrik, grounding peralatan, dan grounding penangkal petir dibuat terpisah tanpa ikatan. Saat petir menyambar, potensial pembumian penangkal petir bisa naik sangat tinggi dibanding pembumian panel. Beda potensial ini dapat menimbulkan loncatan (flashover) ke kabel atau peralatan.

Praktik yang dianjurkan dalam standar proteksi petir modern adalah mengintegrasikan atau mengikat sistem pembumian sesuai desain, lalu melindungi saluran listrik dan data yang masuk ke bangunan dengan SPD. Detail ikatan, ukuran konduktor, dan lokasi titik ikat harus ditentukan oleh perencana listrik yang kompeten, merujuk PUIL dan standar proteksi petir yang dipakai.

## Contoh Perhitungan Tahanan Elektroda Batang

Peraturan ketenagakerjaan membatasi tahanan pembumian sistem penyalur petir maksimal 5 ohm. Berikut contoh ilustrasi bagaimana jenis tanah dan panjang elektroda memengaruhi tahanan. Rumus pendekatan untuk satu batang tegak:

R = ρ ÷ (2πL) × [ln(4L/d) − 1]

dengan ρ = resistivitas tanah (ohm·m), L = panjang batang (m), d = diameter batang (m).

**Data contoh:** ρ = 100 ohm·m, diameter batang 16 mm (0,016 m).

| Panjang batang | ρ ÷ (2πL) | ln(4L/d) − 1 | Tahanan R |
|---|---|---|---|
| 3 m | 100 ÷ 18,85 = 5,31 | ln(750) − 1 = 5,62 | ± 29,8 ohm |
| 12 m (disambung) | 100 ÷ 75,40 = 1,33 | ln(3.000) − 1 = 7,01 | ± 9,3 ohm |

Dari contoh ini terlihat bahwa satu batang 3 m di tanah dengan resistivitas tersebut masih jauh di atas 5 ohm. Cara yang umum dipakai untuk menurunkannya:

1. Memperdalam elektroda dengan batang sambung.
2. Menambah jumlah elektroda yang dipasang paralel dengan jarak yang cukup. Tahanan gabungan tidak turun sebanding jumlah batang karena ada pengaruh tahanan bersama antarelektroda.
3. Membuat jaringan cincin (ring earth) di sekeliling bangunan.
4. Memakai bahan perbaikan tanah (earth enhancing compound) sesuai rekomendasi produsen.

Resistivitas tanah sebenarnya harus diukur di lokasi, misalnya dengan metode Wenner, karena nilainya bervariasi menurut jenis tanah, kadar air, dan kedalaman.

## Ketentuan Pemeriksaan Menurut Peraturan

Instalasi penyalur petir di tempat kerja diatur oleh Peraturan Menteri Tenaga Kerja Nomor PER.02/MEN/1989 tentang Pengawasan Instalasi Penyalur Petir, yang telah diubah dengan [Peraturan Menteri Ketenagakerjaan Nomor 31 Tahun 2015](https://jdih.kemnaker.go.id/peraturan/detail/1154/peraturan-menteri-ketenagakerjaan-nomor-31-tahun-2015). Beberapa ketentuan pokok dalam Permenaker 02/1989:

- Tahanan pembumian seluruh sistem tidak boleh lebih dari 5 ohm (Pasal 54).
- Pemeriksaan dan pengujian dilakukan sebelum instalasi diserahkan kepada pemakai, setelah ada perubahan atau perbaikan bangunan atau instalasi, secara berkala setiap dua tahun sekali, dan setelah ada kerusakan akibat sambaran petir (Pasal 50).
- Pemeriksaan dilakukan oleh pegawai pengawas, ahli keselamatan kerja, dan/atau jasa inspeksi yang ditunjuk (Pasal 51), dan hasil pengukuran dicatat dalam buku khusus (Pasal 53).

Perubahan melalui Permenaker 31/2015 antara lain mengatur pemeriksaan dan pengujian oleh pengawas ketenagakerjaan spesialis K3 listrik dan/atau ahli K3 bidang listrik. Untuk kebutuhan kepatuhan, pastikan Anda merujuk teks peraturan yang berlaku dan berkoordinasi dengan pihak berwenang.

Dokumen proteksi petir juga sering diminta saat pengurusan kelaikan fungsi bangunan; lihat [panduan PBG dan SLF pabrik](https://sarana-abadi.co.id/2026/11/18/pbg-dan-slf-pabrik/).

## Checklist Pemeriksaan Lapangan

Selain pengujian formal, tim pemeliharaan pabrik dapat melakukan pemeriksaan visual rutin dengan checklist berikut:

- Terminal udara tegak, tidak bengkok, dan sambungannya kencang.
- Penghantar penurunan tidak putus, tidak dipakai menggantung barang, dan klemnya tidak lepas.
- Sambungan uji dan bak kontrol dapat diakses, tidak terendam, dan tidak tertutup cor.
- Tidak ada korosi berat pada sambungan antarlogam yang berbeda.
- SPD di panel dalam kondisi baik (indikator normal) dan dicatat setelah ada petir besar.
- Penambahan bangunan, kanopi, atau peralatan atap baru sudah masuk dalam zona proteksi.
- Hasil pengukuran tahanan dicatat, dan tren kenaikan ditindaklanjuti.

## Urutan Pekerjaan Pemasangan di Proyek Pabrik

Penangkal petir paling efisien direncanakan sejak tahap desain, bukan ditambahkan setelah bangunan selesai. Urutan kerja yang kami sarankan:

1. **Survei dan penilaian risiko.** Mengumpulkan data dimensi bangunan, bahan atap, isi bangunan, dan peralatan sensitif.
2. **Pengukuran resistivitas tanah** di beberapa titik sebelum desain pembumian difinalkan.
3. **Desain dan gambar kerja.** Menentukan jenis terminal udara, jumlah dan posisi penghantar penurunan, desain pembumian, titik bonding, dan lokasi SPD.
4. **Koordinasi dengan pekerjaan sipil.** Jaringan cincin dan konduktor yang tertanam dipasang sebelum pengecoran lantai atau jalan di sekeliling bangunan, sehingga tidak perlu membongkar beton belakangan.
5. **Koordinasi dengan pekerjaan struktur dan atap.** Titik sambung ke kolom baja dan klem di atap disiapkan bersama tim struktur dan atap.
6. **Pemasangan, pengukuran, dan dokumentasi.** Hasil ukur tahanan, foto sambungan tertanam, dan gambar as-built diserahkan sebagai bagian dokumen serah terima.

Dengan urutan ini, biaya perubahan dapat ditekan dan seluruh komponen dapat diakses untuk pemeriksaan berkala di kemudian hari.

## Kesalahan yang Sering Ditemukan

- Penghantar penurunan dibuat berkelok mengikuti talang dengan banyak tekukan tajam.
- Elektroda ditanam di area yang kemudian dicor tanpa bak kontrol sehingga tidak bisa diukur.
- Perluasan pabrik atau kanopi baru tidak dimasukkan dalam desain proteksi.
- Sistem pembumian panel dan penangkal petir terpisah tanpa ikatan dan tanpa SPD.
- Pengukuran hanya dilakukan sekali saat serah terima, lalu tidak pernah diulang.

Pekerjaan perbaikan di atap atau pengelasan dekat konduktor juga perlu prosedur kerja yang aman. Untuk pekerjaan panas, lihat artikel [izin kerja panas di pabrik](https://sarana-abadi.co.id/2026/11/19/izin-kerja-panas/).

## Kesimpulan

Penangkal petir pabrik yang efektif terdiri atas terminal udara, penghantar penurunan, dan pembumian yang dirancang berdasarkan penilaian risiko, ditambah proteksi internal berupa bonding dan SPD. Tahanan pembumian dibatasi maksimal 5 ohm dan instalasi wajib diperiksa sebelum serah terima, setelah perubahan, setiap dua tahun, dan setelah ada kerusakan akibat petir.

Jika Anda sedang membangun pabrik baru, memperluas bangunan, atau ingin mengevaluasi sistem yang ada, tim PT Sarana Abadi Raya dapat membantu Anda menyiapkan desain, pemasangan, dan koordinasi pengujiannya. Silakan berkonsultasi dengan kami.
