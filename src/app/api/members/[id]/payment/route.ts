import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount } = body;

    const { data: member, error: memberError } = await supabase
      .from('member')
      .update({
        last_payment_date: new Date().toISOString(),
        ...(amount !== undefined && { membership_fee: parseFloat(amount) })
      })
      .eq('id', id)
      .select()
      .single();

    if (memberError || !member) throw memberError;

    // Create payment record
    const paymentAmount = amount !== undefined ? parseFloat(amount) : member.membership_fee;
    const { error: paymentError } = await supabase
      .from('payment')
      .insert({
        amount: paymentAmount,
        date: new Date().toISOString(),
        description: `Membership payment from ${member.name}`,
        member_id: id
      });

    if (paymentError) throw paymentError;

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}