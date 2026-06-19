import { NextResponse } from 'next/server';
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
    });
  } catch (error: any) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database', stack: error.stack },
      { status: 500 }
    );
  }
}