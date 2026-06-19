import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    // Check if tables exist in Supabase
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (error) {
      return NextResponse.json({
        error: 'Failed to fetch tables',
        message: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'Supabase connected',
      tables,
      hasPaymentTable: tables?.some(t => t.table_name === 'payment'),
      hasExpenseTable: tables?.some(t => t.table_name === 'expense'),
      hasAdminTable: tables?.some(t => t.table_name === 'admin'),
      hasMemberTable: tables?.some(t => t.table_name === 'member')
=======
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: admin, error } = await supabase
      .from('Admin')
      .select('username')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to database',
      adminFound: !!admin
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
    });
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database', stack: error.stack },
      { status: 500 }
    );
  }
}