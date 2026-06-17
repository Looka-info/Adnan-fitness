import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { handleApiError } from '@/lib/api-error';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  picture: z.string().optional().or(z.literal('')),
  details: z.string().optional().or(z.literal('')),
  membershipFee: z.coerce.number().min(0).optional().default(0),
  membershipStart: z.string().optional()
});

export async function GET() {
  try {
    const members = await db.member.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ members });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = memberSchema.parse(body);

    const member = await db.member.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        picture: data.picture || null,
        details: data.details || null,
        membershipFee: data.membershipFee,
        membershipStart: data.membershipStart ? new Date(data.membershipStart) : new Date(),
        lastPaymentDate: new Date(),
        status: 'active'
      }
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}