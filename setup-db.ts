import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🏋️  Setting up Adnan Fitness Club database...\n');
  
  // Check if admin already exists
  const existingAdmin = await prisma.admin.findFirst();
  
  if (existingAdmin) {
    console.log('✅ Admin account already exists:');
    console.log(`   Username: ${existingAdmin.username}`);
    console.log('   Skipping admin creation...\n');
  } else {
    const adminPassword = await hash('admin123', 10);
    
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: adminPassword
      }
    });

    console.log('✅ Admin account created successfully:');
    console.log(`   Username: admin`);
    console.log(`   Password: admin123`);
    console.log('\n⚠️  IMPORTANT: Please change your password after first login!\n');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error setting up database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });