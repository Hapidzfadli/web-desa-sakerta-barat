# Web Desa Sakerta Barat

This project is a web application for the administrative services of Sakerta Barat Village. It aims to streamline and digitize various administrative processes, making it easier for both village officials and residents to manage and access important documents and services.

Support

## If you want to support my work:

- PayPal: paypal.me/hapidz
- Saweria: https://saweria.co/hapidzfadli

## Features

- User authentication and authorization
- Online document submission
- Administrative request tracking
- Digital document management
- Reporting and analytics for village officials

## Technology Stack

- Frontend: Next.js
- Backend: NestJS
- Database: MySQL

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn
- MySQL

## Installation

### Frontend (Next.js)

1. Clone the repository:
   ```
   git clone https://github.com/Hapidzfadli/web-desa-sakerta-barat.git
   ```

2. Navigate to the frontend directory:
   ```
   cd web-desa-sakerta-barat/frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Create a `.env.local` file in the frontend directory and add necessary environment variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

5. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

The frontend will be available at `http://localhost:3000`.

### Backend (NestJS)

1. Navigate to the backend directory:
   ```
   cd web-desa-sakerta-barat/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Create a `.env` file in the backend directory and add necessary environment variables:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/database_name
   JWT_SECRET=your_jwt_secret
   ```

4. Run database migrations:
   ```
   npm run migration:run
   ```
   or
   ```
   yarn migration:run
   ```

5. Start the backend server:
   ```
   npm run start:dev
   ```
   or
   ```
   yarn start:dev
   ```

The backend API will be available at `http://localhost:3001`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
