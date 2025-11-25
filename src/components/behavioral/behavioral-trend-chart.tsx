'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { BehavioralDataPoint } from '@/lib/types';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface BehavioralTrendChartProps {
    data: BehavioralDataPoint[];
    dataKey: keyof BehavioralDataPoint;
    color: string;
}

export default function BehavioralTrendChart({ data, dataKey, color }: BehavioralTrendChartProps) {
    const yAxisFormatter = (value: number) => {
        if (dataKey === 'avgHoldTime') return `${value.toFixed(1)}h`;
        return Math.round(value).toString();
    };

    return (
        <ChartContainer config={{ [dataKey]: { label: dataKey, color } }} className="h-[200px] w-full">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                    <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), 'd MMM')}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                />
                <YAxis
                    tickFormatter={yAxisFormatter}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                />
                <Tooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label) => format(new Date(label), 'PPP')}
                            formatter={(value) => yAxisFormatter(Number(value))}
                        />
                    }
                />
                <Area
                    dataKey={dataKey}
                    type="monotone"
                    fill={`url(#fill-${dataKey})`}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                />
            </AreaChart>
        </ChartContainer>
    );
}
