FROM node:18-alpine

# Use apt instead of apk for Debian-based images
RUN apt-get update && apt-get install -y openssl

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