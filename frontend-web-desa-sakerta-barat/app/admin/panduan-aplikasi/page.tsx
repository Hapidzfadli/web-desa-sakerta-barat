import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const PanduanAplikasi = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Panduan Aplikasi untuk Admin dan Kepala Desa
      </h1>

      <Alert variant="warning" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-bold">Perhatian</AlertTitle>
        <AlertDescription>
          Pastikan Anda memiliki{' '}
          <span className="font-semibold text-yellow-600">
            otoritas yang sesuai
          </span>{' '}
          sebelum melakukan tindakan administratif.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="daftar-surat">Daftar Surat</TabsTrigger>
          <TabsTrigger value="daftar-permohonan">Daftar Permohonan</TabsTrigger>
          <TabsTrigger value="pengaturan">Pengaturan</TabsTrigger>
          <TabsTrigger value="tanda-tangan">Tanda Tangan Digital</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Dashboard</CardTitle>
              <CardDescription>
                Ringkasan informasi dan akses cepat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none pl-5 space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Lihat{' '}
                    <span className="font-semibold text-blue-600">
                      statistik
                    </span>{' '}
                    seperti jumlah permohonan baru, surat yang perlu
                    ditandatangani, dan lainnya
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Akses cepat ke{' '}
                    <span className="font-semibold text-blue-600">
                      fitur-fitur utama
                    </span>{' '}
                    melalui menu navigasi
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Pantau{' '}
                    <span className="font-semibold text-blue-600">
                      aktivitas terbaru
                    </span>{' '}
                    dan tugas yang perlu diselesaikan
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daftar-surat">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Mengelola Daftar Surat
              </CardTitle>
              <CardDescription>
                Cara mengelola kategori, tipe surat, dan membuat template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  Buka menu{' '}
                  <span className="font-semibold text-blue-600">
                    "Daftar Surat"
                  </span>{' '}
                  di sidebar
                </li>
                <li>
                  Untuk menambah kategori surat, klik tombol{' '}
                  <span className="font-semibold text-green-600">
                    "Tambah Kategori"
                  </span>{' '}
                  dan isi formulir
                </li>
                <li>
                  Untuk menambah tipe surat, pilih kategori lalu klik{' '}
                  <span className="font-semibold text-green-600">
                    "Tambah Tipe Surat"
                  </span>
                </li>
                <li>
                  Isi formulir tipe surat, termasuk nama, deskripsi, dan
                  persyaratan
                </li>
                <li className="font-semibold text-primary">
                  Untuk membuat template surat:
                </li>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Buat dokumen Word (.docx) untuk template surat</li>
                  <li>
                    Gunakan{' '}
                    <span className="font-semibold text-purple-600">
                      placeholder
                    </span>{' '}
                    sesuai dengan data yang akan diisi. Placeholder yang
                    tersedia dapat berbeda-beda tergantung jenis surat. Beberapa
                    contoh umum:
                  </li>
                  <ul className="list-none pl-5 space-y-2 bg-gray-100 p-3 rounded-md">
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{nomor_surat}'}
                      </code>{' '}
                      untuk nomor surat
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{nama_lengkap}'}
                      </code>{' '}
                      untuk nama pemohon
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{tempat_lahir}'}
                      </code>{' '}
                      untuk tempat lahir
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{tanggal_lahir}'}
                      </code>{' '}
                      untuk tanggal lahir
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{jenis_kelamin}'}
                      </code>{' '}
                      untuk jenis kelamin
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{nik}'}
                      </code>{' '}
                      untuk Nomor Induk Kependudukan
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{pekerjaan}'}
                      </code>{' '}
                      untuk pekerjaan
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{alamat_lengkap}'}
                      </code>{' '}
                      untuk alamat lengkap
                    </li>
                    <li>
                      <code className="bg-gray-200 px-1 rounded">
                        {'{tanda_tangan}'}
                      </code>{' '}
                      untuk tanda tangan digital Kepala Desa
                    </li>
                  </ul>
                  <li className="text-red-600 font-semibold">
                    Pastikan untuk menggunakan hanya placeholder yang relevan
                    dengan jenis surat yang sedang dibuat
                  </li>
                  <li>
                    Jika diperlukan placeholder khusus untuk jenis surat
                    tertentu, konsultasikan dengan tim pengembang
                  </li>
                  <li className="font-semibold">
                    Pastikan placeholder ditulis persis seperti contoh di atas,
                    termasuk kurung kurawal
                  </li>
                </ul>
                <li>Unggah file template .docx yang telah dibuat</li>
                <li>
                  Untuk mengedit atau menghapus, gunakan tombol aksi di setiap
                  item
                </li>
                <li>
                  Gunakan fitur{' '}
                  <span className="font-semibold text-blue-600">
                    pencarian dan pengurutan
                  </span>{' '}
                  untuk menemukan surat dengan cepat
                </li>
              </ol>
              <Alert variant="info" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold">Penting</AlertTitle>
                <AlertDescription>
                  Placeholder yang digunakan dalam template{' '}
                  <span className="font-semibold text-blue-600">
                    dapat bervariasi tergantung pada jenis surat
                  </span>
                  . Pastikan untuk menggunakan placeholder yang sesuai dengan
                  data yang tersedia dan diperlukan untuk setiap jenis surat.
                  Jika ragu, selalu periksa dokumentasi atau konsultasikan
                  dengan tim teknis.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daftar-permohonan">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Mengelola Daftar Permohonan
              </CardTitle>
              <CardDescription>
                Proses verifikasi dan pengelolaan permohonan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  Akses{' '}
                  <span className="font-semibold text-blue-600">
                    "Daftar Permohonan"
                  </span>{' '}
                  dari sidebar
                </li>
                <li>
                  Gunakan{' '}
                  <span className="font-semibold text-green-600">filter</span>{' '}
                  untuk menyortir permohonan berdasarkan status
                </li>
                <li>
                  Klik{' '}
                  <span className="font-semibold text-blue-600">"Detail"</span>{' '}
                  pada permohonan untuk memeriksa informasi lengkap
                </li>
                <li className="font-semibold">
                  Verifikasi kelengkapan data dan dokumen pendukung
                </li>
                <li>
                  Pilih{' '}
                  <span className="text-green-600 font-semibold">"Terima"</span>{' '}
                  untuk menyetujui atau{' '}
                  <span className="text-red-600 font-semibold">"Tolak"</span>{' '}
                  untuk menolak permohonan
                </li>
                <li>
                  Jika menolak, berikan alasan yang jelas pada form yang muncul
                </li>
                <li>
                  Untuk permohonan yang disetujui, lanjutkan ke proses tanda
                  tangan (khusus Kepala Desa)
                </li>
                <li>
                  Setelah ditandatangani, klik{' '}
                  <span className="font-semibold text-purple-600">
                    "Arsipkan"
                  </span>{' '}
                  untuk menyimpan surat
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengaturan">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Pengaturan Akun
              </CardTitle>
              <CardDescription>
                Mengelola profil dan keamanan akun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none pl-5 space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Buka menu{' '}
                    <span className="font-semibold text-blue-600">
                      "Pengaturan"
                    </span>{' '}
                    di sidebar
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Di tab{' '}
                    <span className="font-semibold text-purple-600">
                      "Biodata Diri"
                    </span>
                    , Anda dapat memperbarui informasi profil
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Klik{' '}
                    <span className="font-semibold text-blue-600">"Edit"</span>{' '}
                    untuk mengubah data profil atau data penduduk
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Unggah atau perbarui dokumen pendukung jika diperlukan
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Di tab{' '}
                    <span className="font-semibold text-purple-600">
                      "Keamanan"
                    </span>
                    , Anda dapat mengubah kata sandi
                  </span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span>
                    Untuk Kepala Desa, ada opsi untuk mengatur{' '}
                    <span className="font-semibold text-red-600">
                      PIN tanda tangan digital
                    </span>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tanda-tangan">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Tanda Tangan Digital (Khusus Kepala Desa)
              </CardTitle>
              <CardDescription>
                Cara menandatangani surat secara digital
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-3">
                <li>
                  Di{' '}
                  <span className="font-semibold text-blue-600">
                    "Daftar Permohonan"
                  </span>
                  , pilih surat yang telah diverifikasi
                </li>
                <li>
                  Klik tombol{' '}
                  <span className="font-semibold text-green-600">
                    "Tanda Tangan"
                  </span>{' '}
                  pada detail permohonan
                </li>
                <li className="font-semibold text-red-600">
                  Periksa kembali isi surat sebelum menandatangani
                </li>
                <li>
                  Masukkan{' '}
                  <span className="font-semibold text-purple-600">
                    PIN tanda tangan digital
                  </span>{' '}
                  Anda saat diminta
                </li>
                <li>Konfirmasi tanda tangan untuk menyelesaikan proses</li>
                <li>
                  Anda dapat mengarsipkan, mencetak atau mengunduh surat yang
                  telah ditandatangani
                </li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PanduanAplikasi;
