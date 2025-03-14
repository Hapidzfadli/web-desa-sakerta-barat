# Dokumentasi Deployment Web Desa Sakerta Barat

Dokumen ini memberikan panduan lengkap untuk melakukan deployment aplikasi Web Desa Sakerta Barat menggunakan Docker dan Docker Compose. Aplikasi ini terdiri dari beberapa komponen yang saling terintegrasi, termasuk database MySQL, backend NestJS, frontend Next.js, dan Nginx sebagai reverse proxy dengan SSL/TLS melalui Certbot.

## Daftar Isi

1. [Arsitektur Aplikasi](#arsitektur-aplikasi)
2. [Prasyarat](#prasyarat)
3. [Persiapan Server](#persiapan-server)
4. [Struktur Direktori](#struktur-direktori)
5. [Konfigurasi Deployment](#konfigurasi-deployment)
6. [Langkah-Langkah Deployment](#langkah-langkah-deployment)
7. [Konfigurasi SSL/TLS dengan Certbot](#konfigurasi-ssltls-dengan-certbot)
8. [Manajemen dan Pemeliharaan](#manajemen-dan-pemeliharaan)
9. [Troubleshooting](#troubleshooting)
10. [Keamanan](#keamanan)

## Arsitektur Aplikasi

Aplikasi Web Desa Sakerta Barat terdiri dari beberapa komponen utama:

- **Database MySQL**: Menyimpan semua data aplikasi
- **Backend NestJS**: API dan logika bisnis (berjalan pada port 3001)
- **Frontend Next.js**: Antarmuka pengguna (berjalan pada port 3000)
- **Nginx**: Reverse proxy yang mengarahkan traffic ke frontend dan backend
- **Certbot**: Untuk mendapatkan dan memperbarui sertifikat SSL

Berikut adalah diagram arsitektur aplikasi:

```
                                 ┌─────────────┐
                                 │    Nginx    │
                                 │(Reverse Proxy)│
                                 └───────┬─────┘
                                         │
                      ┌──────────────────┴─────────────────┐
                      │                                    │
                ┌─────▼────┐                         ┌─────▼────┐
                │ Frontend │                         │ Backend  │
                │ (Next.js)│                         │ (NestJS) │
                └─────┬────┘                         └─────┬────┘
                      │                                    │
                      │                              ┌─────▼────┐
                      │                              │  Database │
                      └────────────────────────────►│  (MySQL)  │
                                                     └──────────┘
```

## Prasyarat

Sebelum memulai deployment, pastikan server memenuhi persyaratan berikut:

- **Server Linux** (Ubuntu 20.04 LTS atau yang lebih baru direkomendasikan)
- **Docker** (versi 20.10.x atau yang lebih baru)
- **Docker Compose** (versi 2.x atau yang lebih baru)
- **Domain** yang sudah dikonfigurasi untuk mengarah ke IP server (desa.hapidzfadli.com)
- **Port 80 dan 443** yang terbuka di firewall
- Minimal spesifikasi server:
  - RAM: 2GB
  - CPU: 2 core
  - Storage: 20GB

## Persiapan Server

### 1. Update Sistem

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instal Docker

```bash
# Instal dependensi yang dibutuhkan
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Tambahkan GPG key Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Tambahkan repository Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Update repository
sudo apt update

# Instal Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Tambahkan user ke grup docker (agar bisa menjalankan docker tanpa sudo)
sudo usermod -aG docker $USER

# Aktifkan dan jalankan layanan Docker
sudo systemctl enable docker
sudo systemctl start docker
```

### 3. Instal Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Beri izin execute
sudo chmod +x /usr/local/bin/docker-compose

# Verifikasi instalasi
docker-compose --version
```

### 4. Siapkan Direktori Proyek

```bash
# Buat direktori utama
mkdir -p /var/www/web-desa
cd /var/www/web-desa

# Buat direktori untuk Nginx dan Certbot
mkdir -p nginx certbot/conf certbot/www
```

## Struktur Direktori

Berikut adalah struktur direktori yang direkomendasikan untuk project:

```
/var/www/web-desa/
├── backend-web-desa-sakerta-barat/   # Kode sumber backend
│   ├── Dockerfile
│   └── ... (file backend lainnya)
├── frontend-web-desa-sakerta-barat/  # Kode sumber frontend
│   ├── Dockerfile
│   └── ... (file frontend lainnya)
├── nginx/                            # Konfigurasi Nginx
│   └── default.conf
├── certbot/                          # Konfigurasi dan sertifikat Certbot
│   ├── conf/
│   └── www/
└── docker-compose.yml                # File konfigurasi Docker Compose
```

## Konfigurasi Deployment

### 1. Konfigurasi Nginx

Buat file konfigurasi Nginx di `nginx/default.conf`:

```bash
nano nginx/default.conf
```

Isi dengan konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name desa.hapidzfadli.com;
    
    # Konfigurasi untuk Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # Redirect semua traffic ke HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name desa.hapidzfadli.com;
    
    # Konfigurasi SSL
    ssl_certificate /etc/letsencrypt/live/desa.hapidzfadli.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/desa.hapidzfadli.com/privkey.pem;
    
    # Konfigurasi SSL tambahan yang direkomendasikan
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM';
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # Frontend routes
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API routes
    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Increase max body size for uploads
    client_max_body_size 10M;
}
```

### 2. Persiapan Konfigurasi Awal untuk Nginx Sebelum SSL

Karena kita memerlukan sertifikat SSL sebelum menjalankan konfigurasi di atas, kita perlu membuat konfigurasi sementara:

```bash
nano nginx/init-letsencrypt.conf
```

Isi dengan:

```nginx
server {
    listen 80;
    server_name desa.hapidzfadli.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 200 'Aplikasi Web Desa Sakerta Barat sedang dalam proses konfigurasi.';
        add_header Content-Type text/plain;
    }
}
```

## Langkah-Langkah Deployment

### 1. Siapkan Kode Sumber

Pastikan Anda telah menyalin kode sumber backend dan frontend ke direktori yang sesuai:

```bash
# Clone repository (jika Anda menggunakan git)
git clone [URL_REPO_BACKEND] backend-web-desa-sakerta-barat
git clone [URL_REPO_FRONTEND] frontend-web-desa-sakerta-barat

# Atau salin kode sumber manual
# mkdir -p backend-web-desa-sakerta-barat frontend-web-desa-sakerta-barat
# Salin file-file yang diperlukan...
```

### 2. Persiapan Deployment

Buat dan sesuaikan file `docker-compose.yml` dengan konfigurasi yang sesuai:

```bash
nano docker-compose.yml
```

Pastikan isi file sesuai dengan konfigurasi yang diinginkan (seperti yang telah diberikan di dokumen ini).

### 3. Inisialisasi Sertifikat SSL (Tahap Awal)

```bash
# Salin konfigurasi Nginx sementara
cp nginx/init-letsencrypt.conf nginx/default.conf

# Mulai service Nginx
docker-compose up -d nginx
```

### 4. Dapatkan Sertifikat SSL

```bash
# Jalankan Certbot untuk mendapatkan sertifikat
docker-compose up certbot
```

### 5. Deploy Aplikasi Lengkap

```bash
# Salin konfigurasi Nginx yang lengkap
cp nginx/default.conf.original nginx/default.conf

# Deploy semua service
docker-compose down
docker-compose up -d
```

## Konfigurasi SSL/TLS dengan Certbot

### 1. Konfigurasi Auto-renewal Sertifikat

Buat script untuk memperbarui sertifikat secara otomatis:

```bash
nano /var/www/web-desa/renew-ssl.sh
```

Isi dengan:

```bash
#!/bin/bash
cd /var/www/web-desa
docker-compose run --rm certbot renew --webroot -w /var/www/certbot
docker-compose exec nginx nginx -s reload
```

Berikan izin eksekusi:

```bash
chmod +x /var/www/web-desa/renew-ssl.sh
```

Tambahkan ke crontab untuk menjalankan setiap bulan:

```bash
(crontab -l 2>/dev/null; echo "0 3 1 * * /var/www/web-desa/renew-ssl.sh") | crontab -
```

## Manajemen dan Pemeliharaan

### 1. Memulai dan Menghentikan Aplikasi

```bash
# Memulai semua container
cd /var/www/web-desa
docker-compose up -d

# Menghentikan semua container
docker-compose down

# Memulai ulang semua container
docker-compose restart
```

### 2. Melihat Log

```bash
# Melihat log dari semua container
docker-compose logs

# Melihat log dari container tertentu (misalnya backend)
docker-compose logs backend

# Melihat log secara real-time
docker-compose logs -f

# Melihat log container tertentu secara real-time
docker-compose logs -f backend
```

### 3. Melakukan Update Aplikasi

```bash
# Pull perubahan terbaru (jika menggunakan git)
cd /var/www/web-desa/backend-web-desa-sakerta-barat
git pull

cd /var/www/web-desa/frontend-web-desa-sakerta-barat
git pull

# Rebuild dan restart container
cd /var/www/web-desa
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 4. Backup Database

```bash
# Buat direktori backup
mkdir -p /var/www/web-desa/backups

# Backup database
docker exec web-desa-db mysqldump -u root -prootpassword --all-databases > /var/www/web-desa/backups/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```

Untuk backup otomatis, tambahkan ke crontab:

```bash
(crontab -l 2>/dev/null; echo "0 2 * * * docker exec web-desa-db mysqldump -u root -prootpassword --all-databases > /var/www/web-desa/backups/backup_$(date +\%Y\%m\%d).sql") | crontab -
```

### 5. Restore Database

```bash
# Restore database dari backup
cat /var/www/web-desa/backups/backup_file.sql | docker exec -i web-desa-db mysql -u root -prootpassword
```

## Troubleshooting

### 1. Container Tidak Berjalan

```bash
# Cek status container
docker-compose ps

# Cek log container yang bermasalah
docker-compose logs [nama_container]
```

### 2. Masalah Koneksi Database

```bash
# Masuk ke container database
docker exec -it web-desa-db bash

# Cek koneksi MySQL
mysql -u prisma -pdigides21 -h localhost digidesa

# Cek apakah database dapat diakses dari container backend
docker exec -it web-desa-backend bash
nc -vz db 3306
```

### 3. Masalah dengan Sertifikat SSL

```bash
# Cek status sertifikat
docker exec web-desa-nginx nginx -t

# Cek detail sertifikat
docker exec web-desa-nginx openssl x509 -in /etc/letsencrypt/live/desa.hapidzfadli.com/fullchain.pem -text -noout
```

### 4. Reset dan Deploy Ulang

Jika mengalami masalah yang tidak dapat diperbaiki, terkadang memulai dari awal bisa menjadi solusi:

```bash
# Hentikan semua container dan hapus volume (HATI-HATI: ini akan menghapus data)
docker-compose down -v

# Hapus image
docker rmi $(docker images -q)

# Mulai dari langkah awal deployment
```

## Keamanan

### 1. Lindungi Environment Variables

Hindari menyimpan kredensial langsung di file `docker-compose.yml`. Gunakan `.env` file:

```bash
nano .env
```

Isi dengan:

```
MYSQL_DATABASE=digidesa
MYSQL_USER=prisma
MYSQL_PASSWORD=digides21
MYSQL_ROOT_PASSWORD=rootpassword
JWT_SECRET=K&18E3w{vhv6{hE_3()&st?4h!4e2r
SENTRY_DNS=https://0103d3c8ddaa7da67d3f79a823621a94@o4507682772942848.ingest.us.sentry.io/4507682778382336
```

Perbarui `docker-compose.yml` untuk menggunakan environment variables:

```yaml
services:
  db:
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
  # ...dan seterusnya
```

### 2. Batasi Akses Database

Pastikan database hanya dapat diakses dari container backend, bukan dari luar:

```yaml
services:
  db:
    ports:
      # Hapus atau komentari baris berikut jika ada
      # - "3306:3306"
```

### 3. Update Rutin

Pastikan untuk melakukan update rutin sistem dan container:

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Update container images
docker-compose pull
docker-compose down
docker-compose up -d
```

---

Dokumen ini memberikan panduan lengkap untuk deployment aplikasi Web Desa Sakerta Barat. Pastikan untuk mengikuti setiap langkah dengan hati-hati dan menyesuaikan konfigurasi sesuai dengan kebutuhan spesifik aplikasi Anda.
