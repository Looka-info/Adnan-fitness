<div align="center">

![Adnan Fitness Club](https://img.shields.io/badge/Adnan-Fitness%20Club-red?style=for-the-badge&logo=dumbbell)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

# Adnan Fitness Club - Premium Gym Member Management System

**A modern, comprehensive solution for managing gym memberships, payments, and analytics**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Setup](#-setup) • [Usage](#-usage) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**Adnan Fitness Club** is a professional gym member management system designed to streamline fitness club operations. Built with modern web technologies, it provides an intuitive interface for managing members, tracking payments, monitoring expenses, and analyzing business performance through interactive dashboards.

### Key Highlights

- 🏋️ **Complete Member Management** - Add, edit, and manage gym members with detailed profiles
- 💰 **Payment Tracking** - Track monthly dues with automatic due calculation
- 📊 **Advanced Analytics** - Visual dashboards with income, expenses, and member trends
- 🔒 **Secure Authentication** - Protected admin panel with encrypted credentials
- 🎨 **Modern UI/UX** - Professional red and black theme with responsive design
- ☁️ **Cloud Ready** - Supports both SQLite (local) and Supabase (cloud) databases

---

## ✨ Features

### Member Management
- ✅ Add new members with name, email, phone, photo, and details
- ✅ Member status tracking (active/inactive)
- ✅ Membership fee configuration
- ✅ Member search and filtering
- ✅ Member profile editing

### Payment System
- ✅ Record payments for individual members
- ✅ Automatic payment due calculation (monthly)
- ✅ Payment history tracking
- ✅ Color-coded payment status indicators

### Expense Tracking
- ✅ Record business expenses by category
- ✅ Expense categorization (rent, utilities, salaries, etc.)
- ✅ Expense history and filtering

### Analytics & Reports
- ✅ **Financial Overview Cards**
  - Total Income
  - Total Expenses
  - Net Profit/Loss
- ✅ **Income vs Expense Chart** - Monthly comparison line chart
- ✅ **Member Joins Chart** - New member registrations by month
- ✅ **Expense Breakdown** - Pie chart showing expense distribution
- ✅ **Member Status Chart** - Active vs inactive members

### Admin Settings
- ✅ Secure admin login system
- ✅ Change admin credentials
- ✅ Password hashing with bcrypt
- ✅ Auto-logout after credential changes

### User Experience
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/Light mode support
- ✅ Real-time data updates
- ✅ Toast notifications
- ✅ Loading states and error handling

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

### Backend
- **API**: Next.js API Routes
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: Custom JWT-based with bcryptjs
- **Database Options**:
  - [SQLite](https://www.sqlite.org/) (Local Development)
  - [Supabase PostgreSQL](https://supabase.com/) (Production)

### Development Tools
- **Package Manager**: [Bun](https://bun.sh/)
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript Compiler

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **Bun**: Latest version (recommended) or npm/yarn
- **Git**: For version control

### For Supabase Setup (Optional but Recommended)
- A [Supabase](https://supabase.com/) account (free tier available)

---

## 🚀 Installation

### 1. Clone or Download the Project

```bash
# If you have the project downloaded
cd adnan-fitness-club
```

### 2. Install Dependencies

Using Bun (Recommended):
```bash
bun install
```

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Verify Installation

```bash
# Check if dependencies are installed
ls node_modules
```

---

## 🗄 Database Setup

### Option 1: SQLite (Quick Start - Recommended for Development)

The default configuration uses SQLite for quick setup.

#### Setup Database

```bash
# Push database schema
bun run db:push

# Seed default admin user
bun run tsx seed.ts
```

#### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials after first login!

### Option 2: Supabase (Production - Recommended)

For production deployment, use Supabase PostgreSQL.

#### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **New Project**
4. Fill in project details and create

#### Step 2: Get Connection String

1. Go to your Supabase project → **Settings** → **Database**
2. Copy the **Connection String (URI format)**
3. It looks like: `postgresql://postgres.xxxx:xxxx@aws-0-xxx.pooler.supabase.com:6543/postgres`

#### Step 3: Update Environment

Open `.env` file and update:

```env
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"
```

#### Step 4: Run SQL Scripts

1. Open **Supabase SQL Editor**
2. Run `supabase-schema.sql` (creates tables)
3. Run `supabase-seed.sql` (creates admin user)

#### Step 5: Push Schema

```bash
bun run db:push
```

---

## ⚙️ Configuration

### Environment Variables

Create or update `.env` file in the project root:

```env
# Database Configuration
# For SQLite (Development)
DATABASE_URL="file:./db/custom.db"

# For Supabase (Production)
# DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"
```

### Customization

#### Change Application Title

Edit `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Gym Name - Member Management",
  // ...
};
```

#### Change Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 220 90% 56%; /* Change primary color */
  --secondary: 220 90% 56%; /* Change secondary color */
  /* ... */
}
```

---

## ▶️ Running the Application

### Development Mode

```bash
# Start development server
bun run dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://your-ip:3000

### Build for Production

```bash
# Create optimized production build
bun run build
```

### Start Production Server

```bash
# Start production server
bun start
```

---

## 📖 Usage Guide

### 1. Admin Login

1. Open the application in your browser
2. Enter your admin credentials
3. Click **Login**

### 2. Adding Members

1. Click **Add Member** button
2. Fill in member details:
   - Name (required)
   - Email (optional)
   - Phone (optional)
   - Membership Fee
   - Additional Details
3. Upload member photo (optional)
4. Click **Save**

### 3. Recording Payments

1. Find the member in the member list
2. Click **Record Payment** button
3. Enter payment amount
4. Add description (optional)
5. Click **Save**

### 4. Adding Expenses

1. Go to **Expenses** tab
2. Click **Add Expense** button
3. Enter expense details:
   - Amount
   - Category (rent, utilities, salaries, etc.)
   - Description (optional)
4. Click **Save**

### 5. Viewing Analytics

1. Navigate to the **Dashboard**
2. View:
   - Financial overview cards
   - Income vs expense chart
   - Member joins chart
   - Expense breakdown pie chart
   - Member status distribution

### 6. Changing Admin Credentials

1. Click **Settings** in the sidebar
2. Enter new username and password
3. Click **Update Credentials**
4. You'll be logged out automatically

### 7. Managing Members

#### Edit Member
- Click the **Edit** button on a member card
- Update the details
- Click **Save**

#### Delete Member
- Click the **Delete** button on a member card
- Confirm deletion

#### Change Status
- Toggle member status between **Active** and **Inactive**

---

## 📁 Project Structure

```
adnan-fitness-club/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── favicon.png            # Application favicon
│   └── logo.svg               # Logo file
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── members/       # Member management endpoints
│   │   │   ├── expenses/      # Expense tracking endpoints
│   │   │   ├── analytics/     # Analytics data endpoints
│   │   │   └── download/      # File download endpoint
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home/Login page
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   │   ├── Dashboard.tsx          # Main dashboard
│   │   │   ├── AdminSettings.tsx      # Admin settings
│   │   │   ├── AddExpenseDialog.tsx   # Expense form
│   │   │   ├── IncomeExpenseChart.tsx # Income/expense chart
│   │   │   ├── MemberJoinsChart.tsx   # Member joins chart
│   │   │   ├── ExpensePieChart.tsx    # Expense pie chart
│   │   │   ├── MemberStatusPieChart.tsx # Member status chart
│   │   │   └── NetProfitCard.tsx      # Profit card
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/
│   │   ├── use-mobile.ts      # Mobile detection hook
│   │   └── use-toast.ts       # Toast notifications hook
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   └── utils.ts           # Utility functions
│   └── store/
│       └── auth.ts            # Authentication store
├── seed.ts                    # Database seeding script
├── supabase-schema.sql        # Supabase database schema
├── supabase-seed.sql          # Supabase admin seed
├── SUPABASE_SETUP.md          # Supabase setup guide
├── SUPABASE_SQL_GUIDE.md      # Supabase SQL guide
├── .env                       # Environment variables
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
└── next.config.ts             # Next.js config
```

---

## 🔌 API Endpoints

### Authentication

#### `POST /api/auth/login`
Admin login authentication.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "admin": {
    "id": "xxx",
    "username": "admin"
  },
  "success": true
}
```

### Members

#### `GET /api/members`
Get all members with optional filtering.

#### `POST /api/members`
Create a new member.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "picture": "url/to/photo",
  "details": "Member details",
  "membershipFee": 50.00
}
```

#### `GET /api/members/[id]`
Get a specific member by ID.

#### `PUT /api/members/[id]`
Update a member's details.

#### `DELETE /api/members/[id]`
Delete a member.

#### `POST /api/members/[id]/payment`
Record a payment for a member.

**Request:**
```json
{
  "amount": 50.00,
  "description": "Monthly fee"
}
```

### Expenses

#### `GET /api/expenses`
Get all expenses with optional filtering.

#### `POST /api/expenses`
Create a new expense.

**Request:**
```json
{
  "amount": 1000.00,
  "category": "rent",
  "description": "Monthly rent"
}
```

### Analytics

#### `GET /api/analytics`
Get comprehensive analytics data.

**Response:**
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 2000.00,
  "netProfit": 3000.00,
  "activeMembers": 50,
  "inactiveMembers": 5,
  "newMembersThisMonth": 10,
  "incomeByMonth": [...],
  "expensesByMonth": [...],
  "expensesByCategory": [...],
  "memberJoinsByMonth": [...]
}
```

### Admin

#### `POST /api/admin/update-credentials`
Update admin credentials.

**Request:**
```json
{
  "username": "new-admin",
  "password": "new-password"
}
```

### Download

#### `GET /api/download`
Download the project as a zip file.

---

## 🔐 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Database connection string | `file:./db/custom.db` | Yes |

### Database URL Formats

#### SQLite (Development)
```
file:./db/custom.db
```

#### Supabase PostgreSQL (Production)
```
postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `Error: Can't reach database server`

**Solution**:
- Check your `DATABASE_URL` in `.env`
- Ensure database is running
- For Supabase, verify your project is active

#### 2. Prisma Client Not Generated

**Error**: `Prisma Client is not generated`

**Solution**:
```bash
bun run db:generate
```

#### 3. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
- Kill the process using port 3000
- Or use a different port:
  ```bash
  PORT=3001 bun run dev
  ```

#### 4. Module Not Found

**Error**: `Module not found: Can't resolve 'xxx'`

**Solution**:
```bash
bun install
```

#### 5. TypeScript Errors

**Error**: TypeScript compilation errors

**Solution**:
```bash
# Check for type errors
bun run type-check

# Regenerate Prisma types
bun run db:generate
```

#### 6. Authentication Issues

**Error**: Invalid credentials error

**Solution**:
- Run seed script to create admin:
  ```bash
  bun run tsx seed.ts
  ```
- Check database has admin user

### Getting Help

If you encounter issues not listed here:

1. Check the [Supabase Setup Guide](./SUPABASE_SETUP.md)
2. Review the [SQL Guide](./SUPABASE_SQL_GUIDE.md)
3. Check browser console for errors
4. Review server logs

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://www.prisma.io/) - Modern database toolkit
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Recharts](https://recharts.org/) - Composable charting library

---

## 📞 Support

For support and questions:

- 📧 Email: support@adnanfitnessclub.com
- 🐛 Report bugs: Open an issue
- 💬 Discussions: Join our community

---

## 🌟 Star the Project

If you find this project helpful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ for Fitness Businesses**

[⬆ Back to Top](#adnan-fitness-club---premium-gym-member-management-system)

</div>