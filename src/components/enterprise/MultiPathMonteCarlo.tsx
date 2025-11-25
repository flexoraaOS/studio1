// components/enterprise/MultiPathMonteCarlo.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { monteCarloPathSampler } from '@/lib/enterprise/utils';
import { mockEquity3YearsAcc1 } from '@/lib/enterprise/mock-data';
import type { MonteCarloScenario } from '@/lib/enterprise/types';

const SCENARIOS: MonteCarloScenario[] = ['Base', 'VolShock', 'Trend', 'MeanRevert', 'Chop'];
const SCENARIO_COLORS: Record<MonteCarloScenario, string> = {
    Base: 'hsl(var(--chart-1))',
    VolShock: 'hsl(var(--chart-5))',
    Trend: 'hsl(var(--chart-2))',
    MeanRevert: 'hsl(var(--chart-3))',
    Chop: 'hsl(var(--chart-4))',
};

/**
 * MultiPathMonteCarlo Component
 * @description Interactive client-side prototype for multi-path Monte Carlo simulations.
 */
export default function MultiPathMonteCarlo() {
    const [activeScenarios, setActiveScenarios] = useState<MonteCarloScenario[]>(['Base']);
    const [volShock, setVolShock] = useState(50); // +50%
    const [trend, setTrend] = useState(10); // +0.1% daily

    const dailyReturns = useMemo(() => mockEquity3YearsAcc1.slice(1).map((d, i) => (d.equity - mockEquity3YearsAcc1[i].equity) / mockEquity3YearsAcc1[i].equity), []);
    const initialEquity = mockEquity3YearsAcc1[mockEquity3YearsAcc1.length - 1]?.equity || 100000;

    const chartData = useMemo(() => {
        const paths = SCENARIOS.map(scenario => {
            if (!activeScenarios.includes(scenario)) return null;

            const sims = monteCarloPathSampler(
                dailyReturns,
                initialEquity,
                50, // Reduced for client-side performance
                90, // 90-day horizon
                scenario,
                { volShock: volShock / 100, trend: trend / 1000 }
            );

            if (sims.length === 0) return null;

            // Get median path
            const medianPath = sims[0].map((_, dayIndex) => {
                const dailyValues = sims.map(sim => sim[dayIndex]).sort((a, b) => a - b);
                return dailyValues[Math.floor(dailyValues.length / 2)];
            });

            return { scenario, path: medianPath };
        }).filter(Boolean);

        if (paths.length === 0 || !paths[0]) return [];

        return paths[0].path.map((_, dayIndex) => {
            const dataPoint: { day: number, [key: string]: number } = { day: dayIndex };
            paths.forEach(p => {
                if (p) {
                    dataPoint[p.scenario] = p.path[dayIndex];
                }
            });
            return dataPoint;
        });

    }, [activeScenarios, dailyReturns, initialEquity, volShock, trend]);
    
    const handleScenarioToggle = (scenario: MonteCarloScenario, checked: boolean) => {
        setActiveScenarios(prev => 
            checked ? [...prev, scenario] : prev.filter(s => s !== scenario)
        );
    };

    const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}k`;

    return (
        <Card>
            
            <CardContent className="pt-6">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" name="Trading Days" />
                            <YAxis tickFormatter={formatCurrency} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            {activeScenarios.map(scenario => (
                                <Line key={scenario} type="monotone" dataKey={scenario} stroke={SCENARIO_COLORS[scenario]} dot={false} strokeWidth={2} />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {SCENARIOS.map(scenario => (
                        <div key={scenario} className="flex items-center space-x-2">
                            <Checkbox 
                                id={scenario} 
                                checked={activeScenarios.includes(scenario)}
                                onCheckedChange={(checked) => handleScenarioToggle(scenario, !!checked)}
                            />
                            <Label htmlFor={scenario}>{scenario}</Label>
                        </div>
                    ))}
                </div>
                 <div className="space-y-2 w-full sm:w-48">
                    <div className="flex justify-between text-sm">
                        <Label>Vol Shock</Label>
                        <span>{volShock}%</span>
                    </div>
                    <Slider value={[volShock]} onValueChange={([v]) => setVolShock(v)} max={200} step={10} />
                </div>
            </CardFooter>
        </Card>
    );
}
