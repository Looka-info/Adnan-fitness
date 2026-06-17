import { db } from './src/lib/db';
import { hash } from 'bcryptjs';

async function main() {
  const adminPassword = await hash('admin123', 10);
  
  const admin = await db.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword
    }
  });

  console.log('Admin created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });