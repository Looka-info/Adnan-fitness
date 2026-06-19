import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { compare, hash } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newUsername, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      );
    }

    // Get the admin (assuming there's only one admin for now)
    const { data: admin, error: dbError } = await supabase
      .from('Admin')
      .select('*')
      .limit(1)
      .single();

    if (dbError || !admin) {
      return NextResponse.json(
        { error: 'Admin account not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, admin.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Update admin credentials
    const updateData: any = {};
    
    if (newUsername && newUsername !== admin.username) {
      updateData.username = newUsername;
    }
    
    if (newPassword) {
      updateData.password = await hash(newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No changes to update' },
        { status: 400 }
      );
    }

    const { data: updatedAdmin, error: updateError } = await supabase
      .from('Admin')
      .update(updateData)
      .eq('id', admin.id)
      .select()
      .single();

    if (updateError || !updatedAdmin) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: updatedAdmin.id,
        username: updatedAdmin.username
      },
      message: 'Credentials updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}