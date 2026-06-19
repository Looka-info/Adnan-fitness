import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { supabase } from '@/lib/db';
=======
import { supabase } from '@/lib/supabase';
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount } = body;

<<<<<<< HEAD
    // Get current member data
    const { data: memberData } = await supabase
      .from('member')
      .select('*')
      .eq('id', id)
      .single();

    // Update member's last payment date and membership fee
    const { data: member, error: memberError } = await supabase
      .from('member')
      .update({
        last_payment_date: new Date().toISOString(),
        membership_fee: amount !== undefined ? parseFloat(amount) : memberData?.membership_fee
=======
    const { data: member, error: memberError } = await supabase
      .from('Member')
      .update({
        lastPaymentDate: new Date().toISOString(),
        ...(amount !== undefined && { membershipFee: parseFloat(amount) })
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
      })
      .eq('id', id)
      .select()
      .single();

<<<<<<< HEAD
    if (memberError) throw memberError;

    // Create payment record
    const paymentAmount = amount !== undefined ? parseFloat(amount) : memberData?.membership_fee;
    const { error: paymentError } = await supabase
      .from('payment')
      .insert([{
        amount: paymentAmount,
        date: new Date().toISOString(),
        description: `Membership payment from ${memberData?.name}`,
        member_id: id
      }]);
=======
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
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

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