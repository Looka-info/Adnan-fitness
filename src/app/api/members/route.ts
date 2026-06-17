import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const members = await db.member.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

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

    const member = await db.member.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        picture: picture || null,
        details: details || null,
        membershipFee: parseFloat(membershipFee) || 0,
        membershipStart: membershipStart ? new Date(membershipStart) : new Date(),
        lastPaymentDate: new Date(),
        status: 'active'
      }
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}