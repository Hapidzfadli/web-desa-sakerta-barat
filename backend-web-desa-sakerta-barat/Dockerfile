FROM node:18-alpine

# Tambahkan instalasi OpenSSL
RUN apk add --no-cache openssl1.1-compat

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy seluruh kode sumber
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build aplikasi
RUN npm run build

# Expose port
EXPOSE 3001

# Command untuk menjalankan aplikasi
CMD ["npm", "run", "start:prod"]