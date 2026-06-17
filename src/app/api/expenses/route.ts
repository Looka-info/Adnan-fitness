import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: expenses, error } = await supabase
      .from('Expense')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

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

    const { data: expense, error } = await supabase
      .from('Expense')
      .insert({
        amount: parseFloat(amount),
        category,
        description: description || null,
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (error || !expense) throw error;

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}