'use client';
import React from 'react';
import { Area, Line, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { MonteCarloData } from '@/lib/types';

const chartConfig = {
    actual: { label: 'Actual Equity', color: 'hsl(var(--primary))' },
    median: { label: 'Median Simulation', color: 'hsl(var(--chart-2))' },
    p5: { label: '5th Percentile', color: 'hsl(var(--destructive))', strokeDasharray: '3 3' },
    p95: { label: '95th Percentile', color: 'hsl(var(--chart-1))', strokeDasharray: '3 3' },
    band: { label: '25-75th Percentile', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

interface MonteCarloChartProps {
    data: MonteCarloData;
}

export default function MonteCarloChart({ data }: MonteCarloChartProps) {
    const chartData = data.percentiles.map((p, i) => ({
        day: i,
        actual: data.actualEquity[i]?.equity,
        median: p.p50,
        p5_p95: [p.p5, p.p95],
        p25_p75: [p.p25, p.p75],
    }));

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} label={{ value: 'Trading Days Forward', position: 'insideBottom', offset: -5 }} />
                <YAxis
                    tickFormatter={(value) => `₹${(Number(value) / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={['auto', 'auto']}
                />
                <Tooltip
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label) => `Day ${label}`}
                            formatter={(value, name) => {
                                if (Array.isArray(value)) {
                                    return `₹${(value[0]/1000).toFixed(1)}k - ₹${(value[1]/1000).toFixed(1)}k`
                                }
                                return `₹${(Number(value) / 1000).toFixed(1)}k`
                            }}
                            indicator="dot"
                        />
                    }
                />

                <Area type="monotone" dataKey="p5_p95" fill={chartConfig.p5.color} fillOpacity={0.1} stroke="none" name="5-95th Percentile" />
                <Area type="monotone" dataKey="p25_p75" fill={chartConfig.band.color} fillOpacity={0.2} stroke="none" name="25-75th Percentile" />

                <Line type="monotone" dataKey="actual" strokeWidth={2} stroke={chartConfig.actual.color} dot={false} name="Actual" />
                <Line type="monotone" dataKey="median" strokeWidth={2} stroke={chartConfig.median.color} dot={false} name="Median" />

            </ComposedChart>
        </ChartContainer>
    );
}
