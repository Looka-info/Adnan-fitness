'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface MemberJoinsChartProps {
  data: Array<{
    month: string;
    newMembers: number;
  }>;
}

export default function MemberJoinsChart({ data }: MemberJoinsChartProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl">New Members</CardTitle>
        <CardDescription>Member registration trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              stroke="currentColor"
              interval={0}
              tick={{ dy: 6 }}
            />
            <YAxis
              className="text-xs"
              stroke="currentColor"
              tickCount={5}
            />
            <Tooltip
              formatter={(value: number) => [value, 'Members']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar
              dataKey="newMembers"
              fill="hsl(217, 91%, 60%)"
              radius={[8, 8, 0, 0]}
            >
              <LabelList dataKey="newMembers" position="top" fill="currentColor" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}