import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { supabase } from '@/lib/db';
=======
import { supabase } from '@/lib/supabase';
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

export async function GET() {
  try {
    const { data: expenses, error } = await supabase
<<<<<<< HEAD
      .from('expense')
=======
      .from('Expense')
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
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
<<<<<<< HEAD
      .from('expense')
      .insert([{
=======
      .from('Expense')
      .insert({
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93
        amount: parseFloat(amount),
        category,
        description: description || null,
        date: new Date().toISOString()
<<<<<<< HEAD
      }])
      .select()
      .single();

    if (error) throw error;
=======
      })
      .select()
      .single();

    if (error || !expense) throw error;
>>>>>>> d2a29df4b501b4886ea8fd18233d1263a4850e93

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}