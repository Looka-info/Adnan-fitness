import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { supabase } from '@/lib/db';
=======
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
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

export async function GET() {
  try {
    const { data: members, error } = await supabase
<<<<<<< HEAD
      .from('member')
      .select('*')
      .order('created_at', { ascending: false });
=======
      .from('Member')
      .select('*')
      .order('createdAt', { ascending: false });
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

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

<<<<<<< HEAD
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const { data: member, error } = await supabase
      .from('member')
      .insert([{
        name,
        email: email || null,
        phone: phone || null,
        picture: picture || null,
        details: details || null,
        membership_fee: parseFloat(membershipFee) || 0,
        membership_start: membershipStart ? new Date(membershipStart).toISOString() : new Date().toISOString(),
        last_payment_date: new Date().toISOString(),
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;
=======
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
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}