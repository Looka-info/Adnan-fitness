'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpensePieChartProps {
  data: Array<{
    category: string;
    amount: number;
  }>;
}

const COLORS = [
  'hsl(0, 72%, 51%)',    // Red
  'hsl(25, 95%, 53%)',   // Orange
  'hsl(48, 96%, 53%)',   // Yellow
  'hsl(142, 76%, 36%)',  // Green
  'hsl(217, 91%, 60%)',  // Blue
  'hsl(270, 60%, 50%)',  // Purple
];

export default function ExpensePieChart({ data }: ExpensePieChartProps) {
  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);

  if (data.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Expense Breakdown</CardTitle>
          <CardDescription>Distribution by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No expense data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Expense Breakdown</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </div>
          <div className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">
            Total: Rs. {totalExpense.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              innerRadius={55}
              fill="#8884d8"
              dataKey="amount"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}