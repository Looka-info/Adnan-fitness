import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: member, error } = await supabase
      .from('member')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, picture, details, membershipFee, status, membershipStart, lastPaymentDate } = body;

    const { data: existingMember, error: existingError } = await supabase
      .from('member')
      .select('id, name, membership_fee, last_payment_date')
      .eq('id', id)
      .single();

    if (existingError || !existingMember) {
      throw existingError || new Error('Member not found');
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (picture !== undefined) updateData.picture = picture;
    if (details !== undefined) updateData.details = details;
    if (membershipFee !== undefined) updateData.membership_fee = parseFloat(membershipFee);
    if (status !== undefined) updateData.status = status;
    if (membershipStart !== undefined) updateData.membership_start = membershipStart ? new Date(membershipStart).toISOString() : null;

    const lastPaymentDateIso = lastPaymentDate ? new Date(lastPaymentDate).toISOString() : null;
    const existingLastPaymentDateIso = existingMember.last_payment_date
      ? new Date(existingMember.last_payment_date).toISOString()
      : null;

    if (lastPaymentDate !== undefined) {
      updateData.last_payment_date = lastPaymentDateIso;
    }

    const { data: member, error } = await supabase
      .from('member')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const shouldCreatePayment = lastPaymentDateIso && lastPaymentDateIso !== existingLastPaymentDateIso && (!existingLastPaymentDateIso || lastPaymentDateIso > existingLastPaymentDateIso);
    if (shouldCreatePayment) {
      const paymentAmount = membershipFee !== undefined
        ? parseFloat(membershipFee)
        : existingMember.membership_fee;

      const { error: paymentError } = await supabase
        .from('payment')
        .insert([{
          amount: paymentAmount,
          date: lastPaymentDateIso,
          description: `Membership payment from ${existingMember.name}`,
          member_id: id
        }]);

      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
      }
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error, data } = await supabase
      .from('member')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete member', details: error },
      { status: 500 }
    );
  }
}