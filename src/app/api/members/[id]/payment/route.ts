import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount } = body;

    const member = await db.member.update({
      where: { id },
      data: {
        lastPaymentDate: new Date(),
        membershipFee: amount !== undefined ? parseFloat(amount) : undefined
      }
    });

    // Create payment record
    const paymentAmount = amount !== undefined ? parseFloat(amount) : member.membershipFee;
    await db.payment.create({
      data: {
        amount: paymentAmount,
        date: new Date(),
        description: `Membership payment from ${member.name}`,
        memberId: id
      }
    });

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}