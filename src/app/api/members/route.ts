import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    const { data: members, error } = await supabase
      .from('member')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, picture, details, membershipFee, membershipStart } = body;

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

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}