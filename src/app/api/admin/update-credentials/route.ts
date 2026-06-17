import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
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
    const admin = await db.admin.findFirst();

    if (!admin) {
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

    const updatedAdmin = await db.admin.update({
      where: { id: admin.id },
      data: updateData
    });

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