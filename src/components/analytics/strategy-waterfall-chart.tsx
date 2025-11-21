'use client';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ReferenceLine, LabelList } from 'recharts';
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
        return (
          <div className="p-2 text-sm bg-background border rounded-md shadow-lg">
            <p className="font-bold">{label}</p>
            <p className="text-foreground">Contribution: ₹{payload[0].value.toLocaleString('en-IN')}</p>
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
                        layout="vertical"
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis 
                            type="number" 
                            tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                        />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={0} stroke="#000" />
                        <Bar dataKey="range" shape={<WaterfallBar />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

const WaterfallBar = (props: any) => {
  const { x, y, width, height, range, value, name } = props;
  const isPositive = value >= 0;
  const isTotal = name.toLowerCase().includes('balance');

  if (!range) return null;
  
  const [start, end] = range;
  
  const barX = value >= 0 ? x : x + width;
  const barWidth = Math.abs(width);


  if(isTotal){
     return <rect x={x} y={y} width={width} height={height} fill="hsl(var(--primary))" />;
  }

  return <rect x={x} y={y} width={width} height={height} fill={isPositive ? 'hsl(var(--chart-1))' : 'hsl(var(--destructive))'} />;
};