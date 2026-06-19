import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { supabase } from '@/lib/db';
=======
import { supabase } from '@/lib/supabase';
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: member, error } = await supabase
<<<<<<< HEAD
      .from('member')
=======
      .from('Member')
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
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
    const { name, email, phone, picture, details, membershipFee, status } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (picture !== undefined) updateData.picture = picture;
    if (details !== undefined) updateData.details = details;
<<<<<<< HEAD
    if (membershipFee !== undefined) updateData.membership_fee = membershipFee;
    if (status !== undefined) updateData.status = status;

    const { data: member, error } = await supabase
      .from('member')
=======
    if (membershipFee !== undefined) updateData.membershipFee = membershipFee;
    if (status !== undefined) updateData.status = status;

    const { data: member, error } = await supabase
      .from('Member')
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

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
    const { error } = await supabase
<<<<<<< HEAD
      .from('member')
=======
      .from('Member')
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}