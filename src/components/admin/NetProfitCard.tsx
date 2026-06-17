import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface NetProfitCardProps {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

export default function NetProfitCard({ totalIncome, totalExpenses, netProfit }: NetProfitCardProps) {
  const isProfit = netProfit >= 0;

  return (
    <Card className={`border-2 ${isProfit ? 'border-green-500/20' : 'border-red-500/20'} bg-gradient-to-br from-card ${isProfit ? 'to-green-500/5' : 'to-red-500/5'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
        {isProfit ? (
          <TrendingUp className="h-5 w-5 text-green-600" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-600" />
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
          {isProfit ? '+' : ''}Rs. {netProfit.toLocaleString()}
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-muted-foreground">
            Income: <span className="font-semibold text-green-600">Rs. {totalIncome.toLocaleString()}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Expenses: <span className="font-semibold text-red-600">Rs. {totalExpenses.toLocaleString()}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}