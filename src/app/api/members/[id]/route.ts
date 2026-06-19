import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: member, error } = await supabase
      .from('Member')
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
    if (membershipFee !== undefined) updateData.membershipFee = membershipFee;
    if (status !== undefined) updateData.status = status;

    const { data: member, error } = await supabase
      .from('Member')
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
    const { error, data } = await supabase
      .from('Member')
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