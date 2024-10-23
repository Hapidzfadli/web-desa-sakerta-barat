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
import { CheckCircle2, AlertCircle, FileText, Search } from 'lucide-react';

const PanduanAplikasi = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Panduan Aplikasi untuk Warga
      </h1>

      <Alert variant="info" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Penting</AlertTitle>
        <AlertDescription>
          Pastikan Anda telah{' '}
          <span className="font-semibold text-blue-600">
            terdaftar dan memiliki akun
          </span>{' '}
          sebelum menggunakan layanan ini.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="umum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="umum">Umum</TabsTrigger>
          <TabsTrigger value="pengajuan">Pengajuan Surat</TabsTrigger>
          <TabsTrigger value="status">Cek Status</TabsTrigger>
        </TabsList>

        <TabsContent value="umum">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <CheckCircle2 className="mr-2 h-6 w-6" /> Informasi Umum
              </CardTitle>
              <CardDescription>
                Panduan dasar penggunaan aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    1
                  </span>
                  <span>
                    <span className="font-semibold">Login</span> menggunakan
                    akun yang telah terdaftar
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    2
                  </span>
                  <span>
                    Pastikan{' '}
                    <span className="font-semibold text-green-600">
                      data profil Anda sudah lengkap dan benar
                    </span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    3
                  </span>
                  <span>
                    Jelajahi menu-menu yang tersedia di{' '}
                    <span className="font-semibold text-purple-600">
                      sidebar
                    </span>
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengajuan">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <FileText className="mr-2 h-6 w-6" /> Cara Mengajukan Surat
              </CardTitle>
              <CardDescription>Langkah-langkah pengajuan surat</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    1
                  </span>
                  <span>
                    Klik menu{' '}
                    <span className="font-semibold text-blue-600">
                      "Pengajuan Surat"
                    </span>{' '}
                    di sidebar
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    2
                  </span>
                  <span>
                    Pilih{' '}
                    <span className="font-semibold text-purple-600">
                      jenis surat
                    </span>{' '}
                    yang ingin diajukan
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    3
                  </span>
                  <span>
                    Isi formulir dengan{' '}
                    <span className="font-semibold text-red-600">
                      lengkap dan benar
                    </span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    4
                  </span>
                  <span>
                    Unggah{' '}
                    <span className="font-semibold text-orange-600">
                      dokumen pendukung
                    </span>{' '}
                    yang diperlukan
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    5
                  </span>
                  <span>
                    Klik tombol{' '}
                    <span className="font-semibold text-green-600">
                      "Ajukan"
                    </span>{' '}
                    untuk mengirim permohonan
                  </span>
                </li>
              </ol>
              <Alert variant="warning" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Perhatian</AlertTitle>
                <AlertDescription>
                  Pastikan semua informasi yang Anda berikan adalah{' '}
                  <span className="font-semibold">benar dan akurat</span>.
                  Informasi yang tidak valid dapat menyebabkan penolakan
                  permohonan.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <Search className="mr-2 h-6 w-6" /> Mengecek Status Permohonan
              </CardTitle>
              <CardDescription>
                Cara melihat dan memahami status permohonan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    1
                  </span>
                  <span>
                    Klik menu{' '}
                    <span className="font-semibold text-blue-600">
                      "Daftar Permohonan"
                    </span>{' '}
                    di sidebar
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    2
                  </span>
                  <span>
                    Lihat status permohonan pada kolom{' '}
                    <span className="font-semibold text-green-600">
                      "Status"
                    </span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    3
                  </span>
                  <span>
                    Klik tombol{' '}
                    <span className="font-semibold text-blue-600">
                      "Detail"
                    </span>{' '}
                    untuk informasi lebih lanjut
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">
                    4
                  </span>
                  <span>
                    Jika ditolak, Anda dapat{' '}
                    <span className="font-semibold text-orange-600">
                      mengajukan ulang
                    </span>{' '}
                    dengan perbaikan
                  </span>
                </li>
              </ul>
              <div className="mt-4 bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-lg mb-2">
                  Keterangan Status:
                </h4>
                <ul className="space-y-2">
                  <li>
                    <span className="font-semibold text-blue-600">
                      Diajukan
                    </span>
                    : Permohonan telah dikirim dan menunggu verifikasi
                  </li>
                  <li>
                    <span className="font-semibold text-green-600">
                      Disetujui
                    </span>
                    : Permohonan telah diverifikasi dan disetujui
                  </li>
                  <li>
                    <span className="font-semibold text-yellow-600">
                      Ditandatangani
                    </span>
                    : Surat telah ditandatangani oleh Kepala Desa
                  </li>
                  <li>
                    <span className="font-semibold text-purple-600">
                      Selesai
                    </span>
                    : Surat siap untuk diambil atau diunduh
                  </li>
                  <li>
                    <span className="font-semibold text-red-600">Ditolak</span>:
                    Permohonan ditolak (lihat alasan penolakan di detail)
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PanduanAplikasi;
