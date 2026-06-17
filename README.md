# Adnan Fitness Club - Member Management System

A comprehensive gym member management system built with Next.js 16, featuring:
- Admin authentication
- Member management
- Payment tracking
- Expense tracking
- Financial analytics with charts
- Dues reminder system
- Professional red and black theme

## Features

### 🏋️ Core Features
- Single admin login system
- Add/Manage members with photos, contact details, and membership fees
- Automatic payment due tracking (30-day cycle)
- Payment recording and history
- Expense management by category

### 📊 Analytics & Charts
- Income vs Expenses line chart
- New members bar chart
- Expense breakdown pie chart
- Member status distribution
- Net profit tracking
- Monthly financial trends

### 💰 Financial Management
- Track total income from membership fees
- Record and categorize expenses
- Calculate net profit/loss
- Visual expense breakdown by category

### 🎨 Design
- Professional red and black theme
- Responsive design for all devices
- Modern UI with shadcn/ui components
- Interactive charts with Recharts

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Database:** SQLite with Prisma ORM
- **Charts:** Recharts
- **State Management:** Zustand
- **Authentication:** bcryptjs (password hashing)

## Prerequisites

- Node.js 18+ or Bun
- Package manager: npm, yarn, or Bun (recommended)

## Quick Setup (Recommended)

Run this single command to set up everything:

```bash
bun install && bun run setup
```

Then start the server:

```bash
bun run dev
```

## Manual Setup

### 1. Install Dependencies
```bash
bun install
# or
npm install
# or
yarn install
```

### 2. Set Up Database
```bash
# Push the Prisma schema to the database
bun run db:push

# Generate Prisma client
bun run db:generate

# Create admin account
bun run setup-db
```

**Or do all three steps at once:**
```bash
bun run setup
```

### 3. Start the Development Server
```bash
bun run dev
```

### 4. Open Your Browser
Navigate to:
```
http://localhost:3000
```

## Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** After first login, change your admin credentials from the Settings menu.

## Usage Guide

### Adding Members
1. Login to the dashboard
2. Click "Add Member" button
3. Fill in member details:
   - Name (required)
   - Email
   - Phone
   - Monthly fee amount
   - Profile picture URL
   - Additional details
4. Click "Add Member"

### Recording Payments
1. Find members with pending dues (red/yellow badges)
2. Click "Pay" button in the Actions column
3. Payment is automatically recorded

### Adding Expenses
1. Click "Add Expense" button (red button)
2. Enter expense details:
   - Amount
   - Category (Equipment, Rent, Utilities, etc.)
   - Description
3. Click "Record Expense"

### Changing Admin Credentials
1. Click "Settings" button in the header
2. Enter your current password
3. Optionally enter new username and/or password
4. Click "Update Credentials"

### Viewing Analytics
The dashboard displays:
- Total members count
- Active members
- Members with pending dues
- Total income/expenses
- Net profit
- Monthly trends
- Expense breakdown by category

## Project Structure

```
adnan-fitness-club/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── members/       # Member management
│   │   │   ├── expenses/      # Expense tracking
│   │   │   └── analytics/     # Analytics data
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Login & Dashboard
│   ├── components/
│   │   ├── admin/             # Dashboard components
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities
│   │   └── db.ts              # Prisma client
│   └── store/                 # State management
├── public/                    # Static assets
└── package.json               # Dependencies
```

## Database Models

### Admin
- id, username, password (hashed), timestamps

### Member
- id, name, email, phone, picture, details
- membershipFee, lastPaymentDate
- membershipStart, status
- timestamps
- payments (relation)

### Payment
- id, amount, date, description, memberId
- member (relation)

### Expense
- id, amount, category, description, date, timestamps

## Environment Variables

The project uses a local SQLite database by default. The database URL is configured in `.env`:

```
DATABASE_URL="file:./db/custom.db"
```

## Available Scripts

- `bun run dev` - Start development server (port 3000)
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run db:push` - Push Prisma schema to database
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run database migrations

## Security Notes

- Admin passwords are hashed using bcryptjs
- Session state is managed client-side with Zustand
- In production, consider adding:
  - Proper session management with JWT
  - API rate limiting
  - CSRF protection
  - HTTPS enforcement

## Troubleshooting

### Database Issues
If you encounter database errors:
```bash
# Reset the database
bun run db:reset

# Or manually push schema
bun run db:push
bun run db:generate
```

### Prisma Client Errors
If you see errors about missing models:
```bash
# Regenerate Prisma client
bun run db:generate
```

### Analytics Not Loading
If charts don't load:
1. Ensure the database tables exist
2. Restart the dev server
3. Check browser console for errors

## Support

For issues or questions:
- Check the browser console for errors
- Review the dev server logs
- Ensure all dependencies are installed

## License

This project is proprietary and intended for Adnan Fitness Club's internal use.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS