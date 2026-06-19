import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { supabase } from '@/lib/db';
=======
import { supabase } from '@/lib/supabase';
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
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
<<<<<<< HEAD
    const { data: admin, error: fetchError } = await supabase
      .from('admin')
=======
    const { data: admin, error: dbError } = await supabase
      .from('Admin')
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
      .select('*')
      .limit(1)
      .single();

<<<<<<< HEAD
    if (fetchError || !admin) {
=======
    if (dbError || !admin) {
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
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
<<<<<<< HEAD
      .from('admin')
=======
      .from('Admin')
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
      .update(updateData)
      .eq('id', admin.id)
      .select()
      .single();

<<<<<<< HEAD
    if (updateError) throw updateError;
=======
    if (updateError || !updatedAdmin) {
       throw updateError;
    }
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

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