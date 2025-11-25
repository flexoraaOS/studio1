'use client';
import React, { useMemo, useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { DailyReturn } from '@/lib/types';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateRollingSharpe, calculateRollingVolatility, calculateRollingWinRate } from '@/lib/statistics';

type MetricType = 'sharpe' | 'volatility' | 'winRate';

const chartConfig: ChartConfig = {
    sharpe: { label: 'Sharpe Ratio', color: 'hsl(var(--chart-1))' },
    volatility: { label: 'Volatility', color: 'hsl(var(--chart-2))' },
    winRate: { label: 'Win Rate', color: 'hsl(var(--chart-3))' },
};

interface RollingMetricsChartProps {
    dailyReturns: DailyReturn[];
}

export default function RollingMetricsChart({ dailyReturns }: RollingMetricsChartProps) {
    const [windowSize, setWindowSize] = useState(30);
    const [selectedMetric, setSelectedMetric] = useState<MetricType>('sharpe');

    const chartData = useMemo(() => {
        if (!dailyReturns || dailyReturns.length === 0) return [];
        switch (selectedMetric) {
            case 'sharpe':
                return calculateRollingSharpe(dailyReturns, windowSize);
            case 'volatility':
                return calculateRollingVolatility(dailyReturns.map(d => d.return), windowSize);
            case 'winRate':
                return calculateRollingWinRate(dailyReturns, windowSize);
            default:
                return [];
        }
    }, [dailyReturns, windowSize, selectedMetric]);

    const yAxisFormatter = (value: number) => {
        if (selectedMetric === 'winRate') return `${(value * 100).toFixed(0)}%`;
        if (selectedMetric === 'volatility') return `${value.toFixed(3)}`;
        return value.toFixed(2);
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center px-6 pt-4">
                <Select value={selectedMetric} onValueChange={(val: MetricType) => setSelectedMetric(val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Metric" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sharpe">Rolling Sharpe</SelectItem>
                        <SelectItem value="volatility">Rolling Volatility</SelectItem>
                        <SelectItem value="winRate">Rolling Win Rate</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={String(windowSize)} onValueChange={(val) => setWindowSize(Number(val))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Rolling Window" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7">7-Day Window</SelectItem>
                        <SelectItem value="30">30-Day Window</SelectItem>
                        <SelectItem value="90">90-Day Window</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ChartContainer config={chartConfig} className="h-[250px] w-full flex-1">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 10,
                        left: -10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => format(new Date(value), 'MMM yy')}
                    />
                    <YAxis
                        tickFormatter={yAxisFormatter}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        content={<ChartTooltipContent
                            labelFormatter={(label) => format(new Date(label), 'PPP')}
                            formatter={(value) => yAxisFormatter(Number(value))}
                        />}
                        cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Line
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke={chartConfig[selectedMetric].color}
                        strokeWidth={2}
                        dot={false}
                        name={chartConfig[selectedMetric].label}
                    />
                </LineChart>
            </ChartContainer>
        </div>
    );
}
