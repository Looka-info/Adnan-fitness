import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check if Payment and Expense models exist
    const paymentCheck = await db.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name='Payment'`;
    const expenseCheck = await db.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name='Expense'`;
    
    return NextResponse.json({
      paymentTable: paymentCheck,
      expenseTable: expenseCheck,
      hasPaymentModel: !!db.payment,
      hasExpenseModel: !!db.expense
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}