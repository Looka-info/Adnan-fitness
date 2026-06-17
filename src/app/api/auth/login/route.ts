import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { compare } from 'bcryptjs';
import { z } from 'zod';
import { handleApiError, ApiError } from '@/lib/api-error';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    const { data: admin, error: dbError } = await supabase
      .from('Admin')
      .select('*')
      .eq('username', username)
      .single();

    if (dbError || !admin) {
      throw new ApiError('Invalid credentials', 401);
    }

    const isValidPassword = await compare(password, admin.password);

    if (!isValidPassword) {
      throw new ApiError('Invalid credentials', 401);
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}