import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const expenses = await db.expense.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, category, description } = body;

    if (!amount || !category) {
      return NextResponse.json(
        { error: 'Amount and category are required' },
        { status: 400 }
      );
    }

    const expense = await db.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        description: description || null,
        date: new Date()
      }
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}