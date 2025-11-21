'use client';
import React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import type { ChartData } from '@/lib/types';

const chartConfig = {
    Equity: {
        label: 'Equity',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

interface EquityChartProps {
    data: ChartData[];
}

export default function EquityChart({ data }: EquityChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <CardDescription>Performance over the last 90 days</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis 
                            tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent 
                                formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                                indicator="dot" 
                            />}
                        />
                        <Line
                            dataKey="Equity"
                            type="monotone"
                            stroke="var(--color-Equity)"
                            strokeWidth={2}
                            dot={false}
                            className="chart-glow-1"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
