import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { handleApiError } from '@/lib/api-error';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  picture: z.string().optional().or(z.literal('')),
  details: z.string().optional().or(z.literal('')),
  membershipFee: z.coerce.number().min(0).optional().default(0),
  membershipStart: z.string().optional()
});

export async function GET() {
  try {
    const { data: members, error } = await supabase
      .from('Member')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ members });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = memberSchema.parse(body);

    const { data: member, error } = await supabase
      .from('Member')
      .insert({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        picture: data.picture || null,
        details: data.details || null,
        membershipFee: data.membershipFee,
        membershipStart: data.membershipStart ? new Date(data.membershipStart).toISOString() : new Date().toISOString(),
        lastPaymentDate: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error || !member) throw error;

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}