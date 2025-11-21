'use client';
import React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import type { RollingMetric } from '@/lib/types';
import { format } from 'date-fns';

const chartConfig = {
    sharpe: {
        label: 'Rolling Sharpe',
        color: 'hsl(var(--chart-1))',
    },
    volatility: {
        label: 'Rolling Volatility',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

interface RollingMetricsChartProps {
    data: RollingMetric[];
}

export default function RollingMetricsChart({ data }: RollingMetricsChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Rolling Metrics</CardTitle>
                <CardDescription>30-day rolling Sharpe Ratio and Volatility</CardDescription>
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
                            tickFormatter={(value) => format(new Date(value), 'MMM d')}
                        />
                        <YAxis
                            yAxisId="left"
                            tickFormatter={(value) => value.toFixed(1)}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                         <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickFormatter={(value) => value.toFixed(2)}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <Tooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                labelFormatter={(label) => format(new Date(label), 'PPpp')}
                                formatter={(value, name) => (
                                    <span>
                                        {Number(value).toFixed(2)}
                                        {name === 'volatility' ? '%' : ''}
                                    </span>
                                )}
                                indicator="dot"
                            />}
                        />
                        <Legend />
                        <Line
                            dataKey="sharpe"
                            yAxisId="left"
                            type="monotone"
                            stroke="var(--color-sharpe)"
                            strokeWidth={2}
                            dot={false}
                            className="chart-glow-1"
                        />
                        <Line
                            dataKey="volatility"
                            yAxisId="right"
                            type="monotone"
                            stroke="var(--color-volatility)"
                            strokeWidth={2}
                            dot={false}
                            className="chart-glow-2"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
