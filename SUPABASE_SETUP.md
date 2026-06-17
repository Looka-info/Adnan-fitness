# Supabase Setup Guide for Adnan Fitness Club

This guide will help you connect your Adnan Fitness Club application to Supabase PostgreSQL database.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization or create one
5. Fill in the project details:
   - **Name**: Adnan Fitness Club
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
6. Wait for the project to be created (usually 1-2 minutes)

## Step 2: Get Your Database Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection String**
4. Select **URI** format
5. Copy the connection string (it looks like this):
   ```
   postgresql://postgres.xxxxxxxxxx:xxxxxxxxxx@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

## Step 3: Update Your Environment Variables

1. Open the `.env` file in your project root
2. Replace the `DATABASE_URL` with your Supabase connection string
3. Your `.env` file should look like this:
   ```env
   DATABASE_URL="postgresql://postgres.xxxxxxxxxx:xxxxxxxxxx@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   ```

## Step 4: Push Database Schema to Supabase

Run the following command to create your database tables in Supabase:

```bash
bun run db:push
```

This will create all the necessary tables:
- ✅ Admin (for admin login)
- ✅ Member (for gym members)
- ✅ Payment (for payment tracking)
- ✅ Expense (for expense tracking)

## Step 5: Seed the Admin User

Create the default admin account:

```bash
bun run tsx seed.ts
```

**Default credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change these credentials immediately after first login!

## Step 6: Start Your Application

```bash
bun run dev
```

Your app will now use Supabase as the database!

## Benefits of Using Supabase

✅ **Cloud Database**: Hosted PostgreSQL with automatic backups
✅ **Real-time**: Built-in real-time subscriptions (future feature)
✅ **Authentication**: Ready for auth integration (future feature)
✅ **Storage**: Perfect for member photos (future feature)
✅ **Edge Functions**: Serverless functions support (future feature)

## Troubleshooting

### Connection Issues

If you can't connect to Supabase:

1. Check your connection string format
2. Verify your database password
3. Ensure your Supabase project is active
4. Check if you're using the correct connection string format

### Migration Issues

If `db:push` fails:

```bash
# Reset and try again
bun run db:push --force-reset
```

### Seed Script Issues

If seeding fails:

```bash
# Regenerate Prisma client
bun run db:generate

# Then try seeding again
bun run tsx seed.ts
```

## Next Steps

Now that you're connected to Supabase, you can:

1. Upload member photos to Supabase Storage
2. Add real-time notifications for payments
3. Implement Supabase Auth for secure authentication
4. Set up database backups and replication
5. Add Supabase Edge Functions for additional features

## Support

For more help:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://supabase.com/discord
- Prisma Docs: https://www.prisma.io/docs