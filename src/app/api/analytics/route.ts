import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '6');

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Get member joins per month
    const members = await db.member.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        status: true
      }
    });

    // Get payments per month
    const payments = await db.payment.findMany({
      where: {
        date: {
          gte: startDate
        }
      },
      select: {
        date: true,
        amount: true
      }
    });

    // Get expenses per month
    const expenses = await db.expense.findMany({
      where: {
        date: {
          gte: startDate
        }
      },
      select: {
        date: true,
        amount: true,
        category: true
      }
    });

    // Get current totals
    const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    // Format data for charts
    const monthlyData = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const monthPayments = payments.filter(p => {
        const pDate = new Date(p.date);
        return pDate.getFullYear() === year && pDate.getMonth() === month;
      });
      
      const monthExpenses = expenses.filter(e => {
        const eDate = new Date(e.date);
        return eDate.getFullYear() === year && eDate.getMonth() === month;
      });

      const monthMembers = members.filter(m => {
        const mDate = new Date(m.createdAt);
        return mDate.getFullYear() === year && mDate.getMonth() === month;
      });

      const monthIncome = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      const monthExpenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income: monthIncome,
        expenses: monthExpenseTotal,
        netProfit: monthIncome - monthExpenseTotal,
        newMembers: monthMembers.length
      });
    }

    // Expense breakdown by category
    const expenseByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const expenseChartData = Object.entries(expenseByCategory).map(([category, amount]) => ({
      category,
      amount
    }));

    // Member status distribution
    const allMembers = await db.member.findMany();
    const activeMembers = allMembers.filter(m => m.status === 'active').length;
    const inactiveMembers = allMembers.filter(m => m.status === 'inactive').length;

    const memberStatusData = [
      { name: 'Active', value: activeMembers, fill: 'hsl(142, 76%, 36%)' },
      { name: 'Inactive', value: inactiveMembers, fill: 'hsl(0, 72%, 51%)' }
    ];

    return NextResponse.json({
      monthlyData,
      totalIncome,
      totalExpenses,
      netProfit,
      expenseChartData,
      memberStatusData,
      paymentCount: payments.length,
      expenseCount: expenses.length
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}