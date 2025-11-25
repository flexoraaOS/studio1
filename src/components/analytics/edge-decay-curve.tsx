'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { EdgeDecayDataPoint } from '@/lib/types';

const chartConfig = {
    survival: {
        label: 'Survival',
        color: 'hsl(var(--chart-4))',
    },
};

interface EdgeDecayCurveProps {
    data: EdgeDecayDataPoint[];
}

export default function EdgeDecayCurve({ data }: EdgeDecayCurveProps) {
    const halfLifePoint = data.find(d => d.survival <= 0.5);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edge Decay / Survival Curve</CardTitle>
                <CardDescription>Probability of a strategy's edge persisting over time (or trades).</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="day" 
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            label={{ value: 'Days / Trades Since Inception', position: 'insideBottom', offset: -5 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                            domain={[0, 1]}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(label) => `Day/Trade #${label}`}
                                    formatter={(value, name) => (
                                        <span>
                                            {chartConfig[name as keyof typeof chartConfig]?.label}: {(Number(value) * 100).toFixed(1)}%
                                        </span>
                                    )}
                                />
                            }
                        />
                        <defs>
                            <linearGradient id="fillSurvival" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-survival)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-survival)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="survival"
                            stroke="var(--color-survival)"
                            fill="url(#fillSurvival)"
                            strokeWidth={2}
                            dot={false}
                        />
                        {halfLifePoint && (
                            <ReferenceLine 
                                x={halfLifePoint.day} 
                                stroke="hsl(var(--destructive))" 
                                strokeDasharray="3 3"
                                label={{ value: `Half-Life: ${halfLifePoint.day} days`, position: 'insideTopRight', fill: 'hsl(var(--destructive))' }}
                            />
                        )}
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
