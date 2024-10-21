#!/bin/bash

# Update sistem
sudo apt update && sudo apt upgrade -y

# Instalasi dependensi sistem
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs npm apache2 mysql-server

# Instalasi PM2 secara global
sudo npm install -g pm2

# Konfigurasi MySQL
sudo mysql -e "CREATE DATABASE IF NOT EXISTS digidesa;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'prisma'@'localhost' IDENTIFIED BY 'digides21';"
sudo mysql -e "GRANT ALL PRIVILEGES ON digidesa.* TO 'prisma'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Cloning repository dari GitHub
git clone https://github.com/Hapidzfadli/web-desa-sakerta-barat.git
cd web-desa-sakerta-barat

# Konfigurasi environment variables untuk backend
cat << EOF > backend-web-desa-sakerta-barat/.env
DATABASE_URL="mysql://prisma:digides21@localhost:3306/digidesa"
JWT_SECRET=K&18E3w{vhv6{hE_3()&st?4h!4e2r
SENTRY_DNS=https://0103d3c8ddaa7da67d3f79a823621a94@o4507682772942848.ingest.us.sentry.io/4507682778382336
EOF

# Konfigurasi environment variables untuk frontend
cat << EOF > frontend-web-desa-sakerta-barat/.env
NEXT_PUBLIC_API_URL = ''
SENTRY_DSN=https://6b0b9ee4bc9670f9b649b2d9bb56db94@o4507682772942848.ingest.us.sentry.io/4507682845294592
SENTRY_AUTH_TOKEN=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
SENTRY_ORG=hapidzfadli
SENTRY_PROJECT=frontend-ta
EOF

# Instalasi dependensi dan build untuk backend
cd backend-web-desa-sakerta-barat
npm install -g @nestjs/cli
npm install
npx prisma migrate deploy
npm run build

# Instalasi dependensi dan build untuk frontend
cd ../frontend-web-desa-sakerta-barat
npm install
npm run build

# Konfigurasi Apache2
sudo tee /etc/apache2/sites-available/sakerta-barat.conf > /dev/null << EOF
<VirtualHost *:80>
    ServerName sakerta-barat.org
    ServerAlias www.sakerta-barat.org
    
    ProxyPreserveHost On
    
    # Konfigurasi untuk backend
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api

    # Konfigurasi untuk frontend
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    
    ErrorLog \${APACHE_LOG_DIR}/sakerta-barat-error.log
    CustomLog \${APACHE_LOG_DIR}/sakerta-barat-access.log combined
</VirtualHost>
EOF

sudo a2ensite sakerta-barat.conf
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2

# Konfigurasi dan start aplikasi menggunakan PM2
cd ../backend-web-desa-sakerta-barat
pm2 start npm --name "backend-sakerta-barat" -- start
cd ../frontend-web-desa-sakerta-barat
pm2 start npm --name "frontend-sakerta-barat" -- start

pm2 save
pm2 startup

echo "Deployment selesai!"