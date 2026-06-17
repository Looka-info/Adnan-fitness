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
      .from('Member')
      .update({
        lastPaymentDate: new Date().toISOString(),
        ...(amount !== undefined && { membershipFee: parseFloat(amount) })
      })
      .eq('id', id)
      .select()
      .single();

    if (memberError || !member) throw memberError;

    // Create payment record
    const paymentAmount = amount !== undefined ? parseFloat(amount) : member.membershipFee;
    const { error: paymentError } = await supabase
      .from('Payment')
      .insert({
        amount: paymentAmount,
        date: new Date().toISOString(),
        description: `Membership payment from ${member.name}`,
        memberId: id
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