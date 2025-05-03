# Social Network App

A modern, full-stack social networking platform built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.
This project serves as a comprehensive example of building scalable and performant web applications using the latest technologies.

## 🚀 Features

- User authentication and authorization
- Responsive and accessible UI with Tailwind CSS
- Database integration using Prisma ORM with PostgreSQL
- Modular and maintainable code structure
- Optimized font loading with `next/font`

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Fonts**: Geist via `next/font`
- **Authentication**: Clerk.com

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/JAl-Hassani/social-network-app.git
   cd social-network-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add your environment variables as needed.

4. **Generate Prisma ORM Client**:

   ```bash
   npx prisma generate
   ```

5. **Run the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
├── src/                    # Application source code
│   ├── app/                # Next.js app directory
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions and libraries
│   └── styles/             # Global styles
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🧪 Scripts

- `npx prisma generate` - Generates Prisma ORM client
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
