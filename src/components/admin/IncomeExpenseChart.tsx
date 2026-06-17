'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IncomeExpenseChartProps {
  data: Array<{
    month: string;
    income: number;
    expenses: number;
    netProfit: number;
  }>;
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl">Income vs Expenses</CardTitle>
        <CardDescription>Monthly revenue and expense tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              stroke="currentColor"
            />
            <YAxis 
              className="text-xs"
              stroke="currentColor"
              tickFormatter={(value) => `Rs. ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, '']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Income"
              dot={{ fill: '#10b981', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={3}
              name="Expenses"
              dot={{ fill: '#ef4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}