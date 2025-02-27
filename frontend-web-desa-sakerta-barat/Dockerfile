FROM node:18-alpine

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy seluruh kode sumber
COPY . .

# Build aplikasi
RUN npm run build

# Expose port
EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["npm", "start"]