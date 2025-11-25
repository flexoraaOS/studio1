'use client';
import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { calculateRollingBetas, Factor } from '@/lib/statistics';
import { DailyReturn, FactorReturns } from '@/lib/types';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chartConfig = {
    Mkt_RF: { label: 'Market (Mkt-RF)', color: 'hsl(var(--chart-1))' },
    SMB: { label: 'Size (SMB)', color: 'hsl(var(--chart-2))' },
    HML: { label: 'Value (HML)', color: 'hsl(var(--chart-3))' },
    ci_lower: { label: 'Lower CI', color: 'transparent' },
    ci_upper: { label: 'Upper CI', color: 'transparent' },
} satisfies ChartConfig;

interface FactorExposureChartProps {
    strategyReturns: DailyReturn[];
    factorReturns: FactorReturns;
}

export default function FactorExposureChart({ strategyReturns, factorReturns }: FactorExposureChartProps) {
    const [windowSize, setWindowSize] = useState(60);
    const [selectedFactor, setSelectedFactor] = useState<Factor>('Mkt_RF');

    const rollingBetas = useMemo(() => {
        return calculateRollingBetas(strategyReturns, factorReturns, windowSize);
    }, [strategyReturns, factorReturns, windowSize]);

    const factorData = useMemo(() => {
        return rollingBetas.map(d => ({
            date: d.date,
            [selectedFactor]: d.betas[selectedFactor],
            ci_lower: d.ci[selectedFactor]?.lower,
            ci_upper: d.ci[selectedFactor]?.upper,
            confidenceInterval: [
                d.ci[selectedFactor]?.lower,
                d.ci[selectedFactor]?.upper,
            ]
        }));
    }, [rollingBetas, selectedFactor]);

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-end items-center gap-2 px-6 pt-4">
                 <Select value={selectedFactor} onValueChange={(val: Factor) => setSelectedFactor(val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Factor" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(chartConfig).filter(k => k.startsWith('Mkt') || k === 'SMB' || k === 'HML').map(key => (
                           <SelectItem key={key} value={key}>{chartConfig[key as Factor].label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={String(windowSize)} onValueChange={(val) => setWindowSize(Number(val))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Rolling Window" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30">30-Day Window</SelectItem>
                        <SelectItem value="60">60-Day Window</SelectItem>
                        <SelectItem value="90">90-Day Window</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ChartContainer config={chartConfig} className="h-[250px] w-full flex-1">
                <ComposedChart
                    data={factorData}
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
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.toFixed(2)}
                        domain={[-1, 2]}
                    />
                    <Tooltip
                        content={
                            <ChartTooltipContent
                                labelFormatter={(label) => format(new Date(label), 'PPP')}
                                formatter={(value, name) => (
                                    <span>
                                        {chartConfig[name as keyof typeof chartConfig]?.label}: {Number(value).toFixed(3)}
                                    </span>
                                )}
                            />
                        }
                    />
                     <Legend />

                    <Area
                        dataKey="confidenceInterval"
                        type="monotone"
                        fill={chartConfig[selectedFactor]?.color ?? 'hsl(var(--chart-1))'}
                        fillOpacity={0.2}
                        stroke="none"
                        name="95% CI"
                    />

                    <Line
                        type="monotone"
                        dataKey={selectedFactor}
                        stroke={chartConfig[selectedFactor]?.color ?? 'hsl(var(--chart-1))'}
                        strokeWidth={2}
                        dot={false}
                        name={`Beta (${chartConfig[selectedFactor]?.label})`}
                    />
                </ComposedChart>
            </ChartContainer>
        </div>
    );
}
