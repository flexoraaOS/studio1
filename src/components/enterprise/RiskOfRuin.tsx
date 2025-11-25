// components/enterprise/RiskOfRuin.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle, Download } from 'lucide-react';
import { calculateRiskOfRuin } from '@/lib/enterprise/utils';
import type { RiskOfRuinParams } from '@/lib/enterprise/types';

/**
 * RiskOfRuin Component
 * @description Interactive dashboard to calculate and visualize Risk of Ruin.
 */
export default function RiskOfRuin() {
    const [params, setParams] = useState<RiskOfRuinParams>({
        riskPerTrade: 2,
        winRate: 55,
        avgWinLossRatio: 1.8,
        bankroll: 100000,
    });

    const result = useMemo(() => {
        return calculateRiskOfRuin({
            ...params,
            riskPerTrade: params.riskPerTrade / 100,
            winRate: params.winRate / 100,
        });
    }, [params]);

    const handleParamChange = (key: keyof RiskOfRuinParams, value: number) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Risk-of-Ruin
                </CardTitle>
                <CardDescription>Estimate the probability of losing a significant portion of your capital.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <Label>Risk per Trade</Label>
                        <span>{params.riskPerTrade.toFixed(1)}%</span>
                    </div>
                    <Slider value={[params.riskPerTrade]} onValueChange={([v]) => handleParamChange('riskPerTrade', v)} max={10} step={0.5} />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <Label>Win Rate</Label>
                         <span>{params.winRate.toFixed(1)}%</span>
                    </div>
                    <Slider value={[params.winRate]} onValueChange={([v]) => handleParamChange('winRate', v)} max={100} step={1} />
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <Label>Avg. Win/Loss Ratio</Label>
                        <span>{params.avgWinLossRatio.toFixed(2)}</span>
                    </div>
                    <Slider value={[params.avgWinLossRatio]} onValueChange={([v]) => handleParamChange('avgWinLossRatio', v)} max={5} step={0.1} />
                </div>
                <div className="p-4 bg-muted rounded-md text-center">
                    <p className="text-sm text-muted-foreground">Estimated Risk of Ruin</p>
                    <p className="text-3xl font-bold text-red-500">{(result.probability * 100).toFixed(2)}%</p>
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="outline" className="w-full" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart (PNG)
                </Button>
            </CardFooter>
        </Card>
    );
}
