import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PanduanAplikasi = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Panduan Aplikasi untuk Warga</h1>

      <Tabs defaultValue="umum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="umum">Umum</TabsTrigger>
          <TabsTrigger value="pengajuan">Pengajuan Surat</TabsTrigger>
          <TabsTrigger value="status">Cek Status</TabsTrigger>
        </TabsList>

        <TabsContent value="umum">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
              <CardDescription>
                Panduan dasar penggunaan aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Login menggunakan akun yang telah terdaftar</li>
                <li>Pastikan data profil Anda sudah lengkap dan benar</li>
                <li>Jelajahi menu-menu yang tersedia di sidebar</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengajuan">
          <Card>
            <CardHeader>
              <CardTitle>Cara Mengajukan Surat</CardTitle>
              <CardDescription>Langkah-langkah pengajuan surat</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Klik menu "Pengajuan Surat" di sidebar</li>
                <li>Pilih jenis surat yang ingin diajukan</li>
                <li>Isi formulir dengan lengkap dan benar</li>
                <li>Unggah dokumen pendukung yang diperlukan</li>
                <li>Klik tombol "Ajukan" untuk mengirim permohonan</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Mengecek Status Permohonan</CardTitle>
              <CardDescription>
                Cara melihat dan memahami status permohonan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Klik menu "Daftar Permohonan" di sidebar</li>
                <li>Lihat status permohonan pada kolom "Status"</li>
                <li>Klik tombol "Detail" untuk informasi lebih lanjut</li>
                <li>
                  Jika ditolak, Anda dapat mengajukan ulang dengan perbaikan
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PanduanAplikasi;
