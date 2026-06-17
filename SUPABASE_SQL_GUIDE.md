# SQL Commands for Supabase - Adnan Fitness Club

Complete SQL setup scripts for your Supabase database.

## 📁 Files

1. **`supabase-schema.sql`** - Database tables and structure
2. **`supabase-seed.sql`** - Admin user and sample data

## 🚀 Quick Setup

### Step 1: Open Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your Adnan Fitness Club project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Schema SQL

Copy the entire contents of `supabase-schema.sql` and paste into the SQL Editor, then click **Run**.

This will create:
- ✅ `Admin` table (for login)
- ✅ `Member` table (for gym members)
- ✅ `Payment` table (for payment tracking)
- ✅ `Expense` table (for expense tracking)
- ✅ All necessary indexes and constraints
- ✅ Automatic timestamp updates

### Step 3: Run Seed SQL

Copy the contents of `supabase-seed.sql` and paste into a **new query**, then click **Run**.

This will create:
- ✅ Default admin user
- ✅ Username: `admin`
- ✅ Password: `admin123`

⚠️ **Important**: Change these credentials immediately after first login!

## 📋 SQL Commands Breakdown

### Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Admin Table
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Member Table
CREATE TABLE "Member" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "picture" TEXT,
    "details" TEXT,
    "membershipFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastPaymentDate" TIMESTAMP(3),
    "membershipStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Payment Table
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "memberId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Expense Table
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
```

### Admin User Creation

```sql
-- Insert Default Admin User (Password: admin123)
INSERT INTO "Admin" ("id", "username", "password", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'admin',
    '$2b$10$/zFGyecNBsK9zsg2jP/nrOYF7UDySVY8CNk58KZVVXEwoB41H5IEO',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

## 🔐 How to Create Custom Admin User

1. Generate a bcrypt hash for your password:
```bash
# Using Node.js
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10));"
```

2. Insert the new admin:
```sql
INSERT INTO "Admin" ("id", "username", "password", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'your-username',
    'your-bcrypt-hash',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
```

## 📊 Useful Queries

### View All Members
```sql
SELECT * FROM "Member" ORDER BY "createdAt" DESC;
```

### View Active Members
```sql
SELECT * FROM "Member" WHERE "status" = 'active';
```

### View Member Payments
```sql
SELECT p.*, m.name as "memberName"
FROM "Payment" p
JOIN "Member" m ON p."memberId" = m.id
ORDER BY p.date DESC;
```

### View Monthly Income
```sql
SELECT 
    DATE_TRUNC('month', date) as month,
    SUM(amount) as total
FROM "Payment"
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;
```

### View Monthly Expenses
```sql
SELECT 
    DATE_TRUNC('month', date) as month,
    SUM(amount) as total,
    category
FROM "Expense"
GROUP BY DATE_TRUNC('month', date), category
ORDER BY month DESC;
```

### View Financial Summary
```sql
SELECT 
    (SELECT COALESCE(SUM(amount), 0) FROM "Payment") as total_income,
    (SELECT COALESCE(SUM(amount), 0) FROM "Expense") as total_expenses,
    (SELECT COALESCE(SUM(amount), 0) FROM "Payment") - 
    (SELECT COALESCE(SUM(amount), 0) FROM "Expense") as net_profit;
```

### View Members with Due Payments
```sql
SELECT 
    m.name,
    m.phone,
    m.membershipFee,
    m."lastPaymentDate",
    CASE 
        WHEN m."lastPaymentDate" IS NULL THEN 
            DATE_PART('day', CURRENT_TIMESTAMP - m."membershipStart")
        ELSE 
            DATE_PART('day', CURRENT_TIMESTAMP - m."lastPaymentDate")
    END as days_since_payment,
    CASE 
        WHEN m."lastPaymentDate" IS NULL THEN 
            CURRENT_TIMESTAMP - m."membershipStart" >= INTERVAL '30 days'
        ELSE 
            CURRENT_TIMESTAMP - m."lastPaymentDate" >= INTERVAL '30 days'
    END as is_due
FROM "Member" m
WHERE m.status = 'active'
AND (
    (m."lastPaymentDate" IS NULL AND CURRENT_TIMESTAMP - m."membershipStart" >= INTERVAL '30 days')
    OR (m."lastPaymentDate" IS NOT NULL AND CURRENT_TIMESTAMP - m."lastPaymentDate" >= INTERVAL '30 days')
);
```

## 🗑️ Reset Database (CAUTION!)

```sql
-- Drop all tables (order matters due to foreign keys)
DROP TABLE IF EXISTS "Payment" CASCADE;
DROP TABLE IF EXISTS "Expense" CASCADE;
DROP TABLE IF EXISTS "Member" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();
```

## 🔧 Troubleshooting

### Error: relation "Admin" does not exist
- **Solution**: Make sure you ran `supabase-schema.sql` first

### Error: duplicate key value violates unique constraint
- **Solution**: An admin with that username already exists. Use UPDATE instead:
```sql
UPDATE "Admin" SET password = 'new-hash' WHERE username = 'admin';
```

### Can't insert into Payment table
- **Solution**: Make sure the memberId exists in the Member table first

## ✅ Verification

After running both SQL files, verify your setup:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check admin user
SELECT id, username, "createdAt" FROM "Admin";

-- Check row counts
SELECT 
    'Admin' as table_name, COUNT(*) as row_count FROM "Admin"
UNION ALL
SELECT 'Member', COUNT(*) FROM "Member"
UNION ALL
SELECT 'Payment', COUNT(*) FROM "Payment"
UNION ALL
SELECT 'Expense', COUNT(*) FROM "Expense";
```

## 📝 Next Steps

1. ✅ Run `supabase-schema.sql`
2. ✅ Run `supabase-seed.sql`
3. ✅ Update your `.env` with Supabase connection string
4. ✅ Run `bun run db:push` to sync Prisma
5. ✅ Start your app: `bun run dev`

Your Supabase database is now ready! 🎉