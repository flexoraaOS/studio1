'use client';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { StrategyContribution } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StrategyWaterfallChartProps {
    data: StrategyContribution[];
}

export default function StrategyWaterfallChart({ data }: StrategyWaterfallChartProps) {
    let cumulative = 0;
    const chartData = data.map(item => {
        const start = item.isTotal ? 0 : cumulative;
        const value = item.value;
        const end = start + value;
        if (!item.isTotal) {
            cumulative = end;
        }
        return {
            ...item,
            range: [start, end],
            value: value
        };
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="p-2 text-sm bg-background border rounded-md shadow-lg">
            <p className="font-bold">{label}</p>
            <p className={cn("text-foreground", !data.isTotal && (data.value >= 0 ? 'text-green-500' : 'text-red-500'))}>
                {data.isTotal ? 'Balance' : 'Contribution'}: ₹{data.value.toLocaleString('en-IN')}
            </p>
          </div>
        );
      }
      return null;
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Strategy Contribution</CardTitle>
                <CardDescription>Waterfall chart showing P&L contribution from each strategy</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[350px] w-full">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" height={60} />
                        <YAxis 
                            type="number" 
                            tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                            domain={['dataMin - 10000', 'dataMax + 10000']}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                        <ReferenceLine y={0} stroke="#000" />
                        <Bar dataKey="range">
                          {chartData.map((entry, index) => {
                             const isPositive = entry.value >= 0;
                             const isTotal = entry.name.toLowerCase().includes('balance');
                             let color = 'hsl(var(--primary))';
                             if (!isTotal) {
                               color = isPositive ? 'hsl(var(--chart-1))' : 'hsl(var(--destructive))';
                             }
                             return <Cell key={`cell-${index}`} fill={color} />;
                          })}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
