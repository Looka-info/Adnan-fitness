import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { supabase } from '@/lib/db';
=======
import { supabase } from '@/lib/supabase';
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '6');

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const startDateStr = startDate.toISOString();

    // Get member joins per month
<<<<<<< HEAD
    const { data: members } = await supabase
      .from('member')
      .select('created_at, status')
      .gte('created_at', startDate.toISOString());

    // Get payments per month
    const { data: payments } = await supabase
      .from('payment')
      .select('date, amount')
      .gte('date', startDate.toISOString());

    // Get expenses per month
    const { data: expenses } = await supabase
      .from('expense')
      .select('date, amount, category')
      .gte('date', startDate.toISOString());

    // Get all members for status distribution
    const { data: allMembers } = await supabase
      .from('member')
      .select('status');
=======
    const { data: members, error: err1 } = await supabase
      .from('Member')
      .select('createdAt, status')
      .gte('createdAt', startDateStr);

    // Get payments per month
    const { data: payments, error: err2 } = await supabase
      .from('Payment')
      .select('date, amount')
      .gte('date', startDateStr);

    // Get expenses per month
    const { data: expenses, error: err3 } = await supabase
      .from('Expense')
      .select('date, amount, category')
      .gte('date', startDateStr);

    if (err1 || err2 || err3) {
      throw err1 || err2 || err3;
    }
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

    // Get current totals
    const totalIncome = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalExpenses = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;

    // Format data for charts
    const monthlyData = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const monthPayments = (payments || []).filter(p => {
        const pDate = new Date(p.date);
        return pDate.getFullYear() === year && pDate.getMonth() === month;
      });
      
      const monthExpenses = (expenses || []).filter(e => {
        const eDate = new Date(e.date);
        return eDate.getFullYear() === year && eDate.getMonth() === month;
      });

      const monthMembers = (members || []).filter(m => {
        const mDate = new Date(m.created_at);
        return mDate.getFullYear() === year && mDate.getMonth() === month;
      });

      const monthIncome = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const monthExpenseTotal = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income: monthIncome,
        expenses: monthExpenseTotal,
        netProfit: monthIncome - monthExpenseTotal,
        newMembers: monthMembers.length
      });
    }

    // Expense breakdown by category
    const expenseByCategory = (expenses || []).reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + (expense.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    const expenseChartData = Object.entries(expenseByCategory).map(([category, amount]) => ({
      category,
      amount
    }));

    // Member status distribution
<<<<<<< HEAD
    const activeMembers = (allMembers || []).filter(m => m.status === 'active').length;
    const inactiveMembers = (allMembers || []).filter(m => m.status === 'inactive').length;
=======
    const { data: allMembers, error: err4 } = await supabase.from('Member').select('status');
    if (err4) throw err4;
    
    const activeMembers = (allMembers || []).filter((m: any) => m.status === 'active').length;
    const inactiveMembers = (allMembers || []).filter((m: any) => m.status === 'inactive').length;
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

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
      paymentCount: (payments || []).length,
      expenseCount: (expenses || []).length
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}