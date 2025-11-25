'use client';
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { FactorAttribution } from '@/lib/types';
import { calculateCumulativeAttribution } from '@/lib/statistics';
import { format } from 'date-fns';

const chartConfig = {
    mkt_rf: { label: 'Market', color: 'hsl(var(--chart-1))' },
    smb: { label: 'Size', color: 'hsl(var(--chart-2))' },
    hml: { label: 'Value', color: 'hsl(var(--chart-3))' },
    alpha: { label: 'Alpha', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

interface CumulativeAttributionChartProps {
    attributionData: FactorAttribution[];
}

export default function CumulativeAttributionChart({ attributionData }: CumulativeAttributionChartProps) {
    const chartData = useMemo(() => {
        return calculateCumulativeAttribution(attributionData);
    }, [attributionData]);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Cumulative Gain Attribution by Factor</CardTitle>
                <CardDescription>Decomposition of portfolio returns into systematic factors and alpha.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => format(new Date(value), 'MMM yy')}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(value) => `${value.toFixed(1)}%`}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(label) => format(new Date(label), 'PPP')}
                                    formatter={(value, name) => (
                                        <span>
                                            {chartConfig[name as keyof typeof chartConfig]?.label}: {Number(value).toFixed(2)}%
                                        </span>
                                    )}
                                />
                            }
                        />
                        <Legend verticalAlign="top" height={40} />
                        <Area type="monotone" dataKey="alpha" stackId="1" stroke="var(--color-alpha)" fill="var(--color-alpha)" fillOpacity={0.4} name="Alpha" />
                        <Area type="monotone" dataKey="hml" stackId="1" stroke="var(--color-hml)" fill="var(--color-hml)" fillOpacity={0.4} name="Value" />
                        <Area type="monotone" dataKey="smb" stackId="1" stroke="var(--color-smb)" fill="var(--color-smb)" fillOpacity={0.4} name="Size" />
                        <Area type="monotone" dataKey="mkt_rf" stackId="1" stroke="var(--color-mkt_rf)" fill="var(--color-mkt_rf)" fillOpacity={0.4} name="Market" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
