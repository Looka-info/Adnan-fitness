import { supabase } from './src/lib/db';
import { hash } from 'bcryptjs';

async function main() {
  try {
    const adminPassword = await hash('admin123', 10);
    
    const { data, error } = await supabase
      .from('admin')
      .insert([{
        username: 'admin',
        password: adminPassword
      }])
      .select()
      .single();

    if (error && error.code !== '23505') { // 23505 is unique constraint violation
      throw error;
    }

    console.log('Admin created/already exists:', data?.username || 'admin');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

main();