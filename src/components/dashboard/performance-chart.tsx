'use client';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import type { ChartData } from '@/lib/types';

const chartConfig = {
    'P&L': {
        label: 'P&L',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

interface PerformanceChartProps {
    data: ChartData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
                <CardDescription>P&L breakdown by strategy</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={80}
                        />
                        <XAxis 
                            type="number"
                            tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            content={<ChartTooltipContent formatter={(value, name) => (
                                <div className="flex flex-col">
                                    <span>{name === 'P&L' ? `₹${Number(value).toLocaleString('en-IN')}` : value}</span>
                                </div>
                            )} />}
                        />
                        <Bar dataKey="P&L" fill="var(--color-P&L)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
