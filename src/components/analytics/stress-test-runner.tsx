'use client';
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { HistoricalEquityPoint, FactorReturns, Scenario } from '@/lib/types';
import { applyScenarioShock } from '@/lib/statistics';
import { format } from 'date-fns';

interface StressTestRunnerProps {
    baseEquityCurve: HistoricalEquityPoint[];
    factorReturns: FactorReturns;
}

export default function StressTestRunner({ baseEquityCurve, factorReturns }: StressTestRunnerProps) {
    const [marketShock, setMarketShock] = useState(0);

    const scenario: Scenario = useMemo(() => ({
        name: 'Custom Scenario',
        marketShock: marketShock / 100, // convert percentage to decimal
        interestRateShock: 0,
        volatilityShock: 0,
    }), [marketShock]);

    const shockedEquityCurve = useMemo(() => {
        return applyScenarioShock(baseEquityCurve, scenario, factorReturns);
    }, [baseEquityCurve, scenario, factorReturns]);

    const combinedData = useMemo(() => {
        return baseEquityCurve.map((point, i) => ({
            date: point.date,
            base: point.equity,
            shocked: shockedEquityCurve[i]?.equity,
        }));
    }, [baseEquityCurve, shockedEquityCurve]);

    const formatCurrency = (value: number) => {
        if (!value) return '₹0k';
        return `₹${(value / 1000).toFixed(0)}k`;
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Stress Test & Scenario Runner</CardTitle>
                <CardDescription>Simulate market shocks to see their impact on your equity curve.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <LineChart data={combinedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => format(new Date(value), 'MMM yy')}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis tickFormatter={formatCurrency} axisLine={false} tickLine={false} />
                        <Tooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(label) => format(new Date(label), 'PPP')}
                                    formatter={(value, name) => (
                                        <div className="flex flex-col">
                                            <span>
                                                <span style={{ color: name === 'base' ? 'hsl(var(--chart-1))' : 'hsl(var(--destructive))' }}>
                                                    {name === 'base' ? 'Base Equity' : 'Shocked Equity'}:
                                                </span> {formatCurrency(Number(value))}
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="base"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={2}
                            dot={false}
                            name="base"
                        />
                        <Line
                            type="monotone"
                            dataKey="shocked"
                            stroke="hsl(var(--destructive))"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            name="shocked"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="w-full space-y-4">
                    <Label htmlFor="market-shock">Market Shock ({marketShock}%)</Label>
                    <Slider
                        id="market-shock"
                        min={-50}
                        max={50}
                        step={5}
                        value={[marketShock]}
                        onValueChange={(value) => setMarketShock(value[0])}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}
