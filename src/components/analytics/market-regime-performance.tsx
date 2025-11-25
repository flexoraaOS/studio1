'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RegimePerformance } from '@/lib/types';
import { HelpCircle } from 'lucide-react';
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const chartConfig = {
    pnl: { label: 'P&L', color: 'hsl(var(--chart-1))' },
    winRate: { label: 'Win Rate', color: 'hsl(var(--chart-2))' },
};

interface MarketRegimePerformanceProps {
    data: RegimePerformance[];
}

export default function MarketRegimePerformance({ data }: MarketRegimePerformanceProps) {
    const formatCurrency = (value: number) => {
        if (Math.abs(value) >= 1_000) {
            return `₹${(value / 1_000).toFixed(0)}k`;
        }
        return `₹${value.toFixed(0)}`;
    };

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>Market Regime Performance</CardTitle>
                    <TooltipProvider>
                        <UiTooltip>
                            <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <UiTooltipContent>
                                <p className="max-w-xs">Shows strategy performance split by market conditions (e.g., high/low volatility).</p>
                            </UiTooltipContent>
                        </UiTooltip>
                    </TooltipProvider>
                </div>
                <CardDescription>How your strategies perform in different market environments.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="regime"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis yAxisId="left" stroke="var(--color-pnl)" orientation="left" tickFormatter={formatCurrency} />
                        <YAxis yAxisId="right" stroke="var(--color-winRate)" orientation="right" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} domain={[0, 1]} />
                        <Tooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value, name) => {
                                        if (name === 'pnl') return formatCurrency(Number(value));
                                        if (name === 'winRate') return `${(Number(value) * 100).toFixed(1)}%`;
                                        return String(value);
                                    }}
                                />
                            }
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="pnl" fill="var(--color-pnl)" radius={4} name="Total P&L" />
                        <Bar yAxisId="right" dataKey="winRate" fill="var(--color-winRate)" radius={4} name="Win Rate" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
