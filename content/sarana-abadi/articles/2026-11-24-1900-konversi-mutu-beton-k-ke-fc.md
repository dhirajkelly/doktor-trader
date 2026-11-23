---
title: "Konversi Mutu Beton K ke fc': Rumus, Tabel, dan Cara Membacanya"
slug: konversi-mutu-beton-k-ke-fc
publish_at: "2026-11-24 19:00"
meta_title: "Konversi Mutu Beton K ke fc': Rumus dan Tabel"
meta_description: "Panduan konversi mutu beton K ke fc': beda benda uji kubus dan silinder, rumus konversi, tabel K-175 sampai K-400, contoh hitungan, dan penulisan spesifikasi."
focus_keyword: konversi mutu beton k ke fc
categories: [Engineering & Design, Quality & Standards]
tags: [mutu beton, fc, kuat tekan beton, ready mix]
excerpt: "Mengapa K-300 tidak sama dengan fc' 30 MPa, bagaimana rumus konversinya, dan cara menulis mutu beton yang tidak menimbulkan salah paham di proyek."
image_alt: "Gambar sampul artikel PT Sarana Abadi Raya tentang konversi mutu beton K ke fc'"
faq:
  - q: "Apa beda mutu beton K dan fc'?"
    a: "Mutu K menyatakan kuat tekan karakteristik dalam kg/cm² berdasarkan benda uji kubus, sedangkan fc' menyatakan kuat tekan yang disyaratkan dalam MPa berdasarkan benda uji silinder. Karena satuan dan bentuk benda ujinya berbeda, angkanya tidak bisa disamakan begitu saja."
  - q: "K-300 setara fc' berapa?"
    a: "Dengan rumus konversi yang umum dipakai, K-300 setara sekitar 24 sampai 25 MPa, tergantung pembulatan dan faktor yang digunakan. Untuk spesifikasi, sebaiknya tuliskan mutu langsung dalam fc' dan MPa."
  - q: "Standar beton struktural di Indonesia memakai K atau fc'?"
    a: "SNI 2847:2019 tentang persyaratan beton struktural untuk bangunan gedung menggunakan fc' dalam MPa dengan benda uji silinder. Istilah K masih sering dipakai di lapangan dan katalog ready mix sebagai kebiasaan lama."
  - q: "Bolehkah hasil uji kubus dipakai untuk menilai beton yang dispesifikasikan dalam fc'?"
    a: "Sebaiknya jenis benda uji mengikuti spesifikasi proyek. Bila terpaksa memakai kubus, metode konversi dan kriteria penerimaannya harus disepakati tertulis dengan perencana sebelum pengujian."
---

> Angka yang sama bisa berarti hal yang berbeda bila satuannya tidak disepakati.

Di lapangan, pemesanan beton ready mix masih sering memakai istilah K-225, K-300, atau K-350. Sementara itu, gambar struktur dan spesifikasi teknis proyek industri umumnya menuliskan mutu beton sebagai fc' 20 MPa, fc' 25 MPa, dan seterusnya. Perbedaan ini sering menimbulkan salah paham saat pemesanan, pengujian, maupun serah terima. Karena itu memahami **konversi mutu beton K ke fc** adalah pengetahuan dasar yang penting bagi pemilik proyek, pengawas, maupun pelaksana.

Artikel ini menjelaskan perbedaan kedua sistem penulisan mutu, rumus konversi yang umum dipakai, tabel konversi beserta contoh hitungannya, dan cara menulis spesifikasi beton agar tidak terjadi salah tafsir di proyek pabrik dan gudang.

## Apa Itu Mutu K dan fc'

### Mutu K

Mutu K merupakan istilah dari kebiasaan peraturan beton lama di Indonesia. Angka di belakang huruf K menyatakan kuat tekan karakteristik dalam satuan kg/cm², dengan benda uji berbentuk **kubus** berukuran 15 cm × 15 cm × 15 cm pada umur 28 hari. Jadi K-300 berarti kuat tekan karakteristik 300 kg/cm² berdasarkan uji kubus.

### Mutu fc'

fc' adalah kuat tekan beton yang disyaratkan, dinyatakan dalam megapascal (MPa), dengan benda uji berbentuk **silinder**, umumnya berdiameter 15 cm dan tinggi 30 cm, pada umur 28 hari atau umur lain yang ditetapkan. Sistem inilah yang dipakai dalam SNI 2847:2019 tentang persyaratan beton struktural untuk bangunan gedung, yang selaras dengan praktik internasional.

### Mengapa angkanya berbeda

Ada dua sumber perbedaan:

1. **Satuan.** 1 MPa setara kurang lebih 10,2 kg/cm². Jadi angka kg/cm² harus dibagi sekitar 10,2 untuk menjadi MPa.
2. **Bentuk benda uji.** Untuk beton yang sama, kubus umumnya menunjukkan kuat tekan lebih tinggi daripada silinder, karena pengaruh bentuk dan rasio tinggi terhadap lebar. Dalam praktik di Indonesia, rasio kuat tekan silinder terhadap kubus yang sering dipakai adalah sekitar 0,83.

Inilah alasan K-300 tidak sama dengan fc' 30 MPa. Bila keduanya dianggap sama, beton yang dipesan bisa lebih rendah dari mutu yang dibutuhkan desain.

## Rumus Konversi Mutu Beton K ke fc'

Rumus pendekatan yang umum dipakai adalah:

**fc' (MPa) ≈ 0,83 × K ÷ 10,197**

Di mana:

- K adalah angka mutu dalam kg/cm² (benda uji kubus),
- 10,197 adalah faktor konversi kg/cm² ke MPa,
- 0,83 adalah faktor pendekatan rasio silinder terhadap kubus.

Sebagian praktisi menyederhanakan rumus ini menjadi **fc' ≈ 0,083 × K**, dengan menganggap 1 MPa ≈ 10 kg/cm². Hasilnya sedikit lebih tinggi daripada rumus lengkap. Karena itu Anda mungkin menemukan tabel konversi yang angkanya berbeda beberapa persepuluh MPa. Keduanya pendekatan, bukan konversi eksak, sebab rasio kubus terhadap silinder sebenarnya juga dipengaruhi mutu beton, agregat, dan kondisi pengujian.

Sebaliknya, untuk mengubah fc' ke K:

**K ≈ fc' × 10,197 ÷ 0,83**

## Tabel Konversi K ke fc'

Tabel berikut dihitung dengan dua rumus di atas. Angka dibulatkan satu desimal dan hanya untuk gambaran.

| Mutu K (kg/cm², kubus) | K dalam MPa (K ÷ 10,197) | fc' rumus lengkap (× 0,83) | fc' rumus sederhana (0,083 × K) |
|---|---|---|---|
| K-175 | 17,2 | 14,2 MPa | 14,5 MPa |
| K-200 | 19,6 | 16,3 MPa | 16,6 MPa |
| K-225 | 22,1 | 18,3 MPa | 18,7 MPa |
| K-250 | 24,5 | 20,3 MPa | 20,8 MPa |
| K-300 | 29,4 | 24,4 MPa | 24,9 MPa |
| K-350 | 34,3 | 28,5 MPa | 29,1 MPa |
| K-400 | 39,2 | 32,6 MPa | 33,2 MPa |

Dari tabel terlihat bahwa K-250 kira-kira setara fc' 20 MPa, K-300 sekitar fc' 25 MPa, dan K-350 sekitar fc' 29 MPa. Namun perhatikan bahwa K-300 dengan rumus lengkap menghasilkan 24,4 MPa, sedikit di bawah 25 MPa. Bila desain mensyaratkan fc' 25 MPa, memesan "K-300" berdasarkan kebiasaan bisa jadi tidak cukup.

## Contoh Perhitungan di Proyek

### Contoh 1: Gambar meminta fc' 25 MPa

Spesifikasi pelat lantai gudang mensyaratkan fc' 25 MPa. Berapa mutu K yang setara?

- K ≈ 25 × 10,197 ÷ 0,83
- K ≈ 254,9 ÷ 0,83
- K ≈ 307,1 kg/cm²

Artinya, bila pemasok hanya mengenal penamaan K, mutu yang setara adalah sedikit di atas K-300. Pilihan yang lebih aman adalah meminta pemasok memproduksi beton dengan target fc' 25 MPa silinder secara eksplisit, bukan sekadar K-300.

### Contoh 2: Hasil uji kubus

Hasil uji kuat tekan rata-rata satu set benda uji kubus adalah 320 kg/cm². Perkiraan nilai silindernya:

- 320 ÷ 10,197 = 31,38 MPa (kubus)
- 31,38 × 0,83 ≈ 26,0 MPa (perkiraan silinder)

Nilai ini hanya perkiraan. Penerimaan beton tetap harus mengikuti kriteria dalam spesifikasi proyek dan standar yang dirujuk, termasuk jumlah sampel dan cara evaluasi statistiknya.

## Cara Menulis Spesifikasi Mutu Beton yang Tidak Ambigu

Untuk menghindari salah tafsir, kami menyarankan penulisan spesifikasi seperti berikut:

- **Tulis satuan dan bentuk benda uji.** Contoh: "fc' 25 MPa, benda uji silinder 150 × 300 mm, umur 28 hari."
- **Hindari mencampur sistem.** Jangan menulis fc' di gambar tetapi K di surat pesanan ready mix. Bila pemasok memakai penamaan K, minta mereka menuliskan padanan fc' di dokumen penawaran dan surat jalan.
- **Cantumkan parameter pendukung.** Nilai slump, ukuran maksimum agregat, dan persyaratan khusus seperti ketahanan terhadap sulfat atau penggunaan aditif.
- **Tetapkan frekuensi sampling dan kriteria penerimaan.** Hal ini sebaiknya masuk dalam rencana inspeksi dan pengujian proyek.
- **Simpan rekaman uji.** Laporan laboratorium, berita acara sampling, dan surat jalan beton merupakan bagian dari dokumen mutu proyek.

Perlu diingat bahwa SNI 2847:2019 menetapkan nilai minimum fc' untuk beton struktural dan persyaratan tambahan sesuai kondisi paparan lingkungan. Karena itu mutu beton tidak dipilih sebatas kebiasaan, tetapi berdasarkan perhitungan struktur dan kondisi layan.

## Mutu Beton yang Umum di Pabrik dan Gudang

Kebutuhan mutu beton berbeda menurut elemen dan beban. Sebagai gambaran umum, bukan pengganti desain:

| Elemen | Pertimbangan utama |
|---|---|
| Lantai kerja (lean concrete) | Hanya sebagai alas, bukan elemen struktur |
| Pelat lantai gudang | Beban forklift, rak, dan abrasi permukaan |
| Pondasi dan kolom bangunan | Beban struktur atas dan kondisi tanah |
| Pondasi mesin | Beban dinamis, getaran, dan presisi angkur |
| Jalan beton dan area loading | Beban roda kendaraan berat dan siklus beban berulang |

Pemilihan mutu untuk lantai gudang biasanya diikuti dengan lapisan pengeras permukaan; detailnya kami bahas di artikel [floor hardener lantai gudang](https://sarana-abadi.co.id/2026/11/19/floor-hardener-lantai-gudang/). Untuk elemen yang menerima getaran, faktor desain yang lebih penting dari sekadar mutu beton kami uraikan di artikel [pondasi mesin pabrik](https://sarana-abadi.co.id/2026/11/20/pondasi-mesin-pabrik/). Sementara untuk perkerasan kendaraan berat, lihat artikel [kontraktor jalan beton pabrik Karawang](https://sarana-abadi.co.id/2026/11/22/kontraktor-jalan-beton-pabrik-karawang/).

## Kesalahan yang Sering Terjadi

- **Menganggap K-300 sama dengan fc' 30 MPa.** Ini kesalahan paling umum dan bisa membuat beton di bawah mutu desain.
- **Membandingkan hasil uji kubus langsung dengan fc'.** Hasil kubus harus dikonversi dengan metode yang disepakati, atau sebaiknya benda uji mengikuti spesifikasi sejak awal.
- **Menambah air di lokasi untuk memudahkan pengecoran.** Penambahan air tanpa kontrol menurunkan kuat tekan, sehingga mutu yang dipesan tidak tercapai walaupun pesanan sudah benar.
- **Perawatan beton diabaikan.** Beton yang cepat kering di cuaca panas dapat mengalami retak susut dan kekuatan permukaan yang rendah.
- **Benda uji tidak dirawat dengan benar.** Benda uji yang dibiarkan di bawah terik matahari atau dipindahkan terlalu dini dapat menghasilkan nilai uji yang tidak mewakili beton terpasang.

## Kesimpulan

Mutu K dan fc' adalah dua cara berbeda menyatakan kuat tekan beton: K dalam kg/cm² dengan benda uji kubus, fc' dalam MPa dengan benda uji silinder. Konversinya memakai pendekatan fc' ≈ 0,83 × K ÷ 10,197, sehingga K-250 kira-kira setara fc' 20 MPa dan K-300 sekitar fc' 24 sampai 25 MPa. Cara paling aman adalah menulis mutu langsung dalam fc' lengkap dengan satuan, bentuk benda uji, dan umur uji, lalu memastikan pemesanan, sampling, dan penerimaan beton mengacu pada spesifikasi yang sama.

Bila Anda membutuhkan bantuan meninjau spesifikasi beton, menyusun rencana pengujian, atau melaksanakan pekerjaan struktur beton di pabrik dan gudang, tim PT Sarana Abadi Raya siap berdiskusi. Silakan berkonsultasi dengan kami.
