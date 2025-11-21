'use client';
import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import type { ChartData } from '@/lib/types';

const chartConfig = {
    Drawdown: {
        label: 'Drawdown',
        color: 'hsl(var(--destructive))',
    },
} satisfies ChartConfig;

interface DrawdownChartProps {
    data: ChartData[];
}

export default function DrawdownChart({ data }: DrawdownChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Drawdown Curve</CardTitle>
                <CardDescription>Percentage drawdown from equity peak</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillDrawdown" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-Drawdown)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-Drawdown)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis
                            tickFormatter={(value) => `${value.toFixed(1)}%`}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            domain={['auto', 0]}
                        />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                formatter={(value) => `${Number(value).toFixed(2)}%`}
                                indicator="dot"
                            />}
                        />
                        <Area
                            dataKey="Drawdown"
                            type="monotone"
                            fill="url(#fillDrawdown)"
                            stroke="var(--color-Drawdown)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}