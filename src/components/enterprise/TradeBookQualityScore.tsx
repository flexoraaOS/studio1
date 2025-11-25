// components/enterprise/TradeBookQualityScore.tsx
'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TradeBookQualityScore as ScoreType } from '@/lib/enterprise/types';
import { mockTradeBookQualityScore } from '@/lib/enterprise/mock-data';

/**
 * TradeBookQualityScore Component
 * @description Displays a "prop firm" style score for the quality of the trade book.
 */
export default function TradeBookQualityScore() {
    const scoreData: ScoreType = mockTradeBookQualityScore;
    
    const radarData = [
        { subject: 'Adherence', A: scoreData.planAdherence * 100, fullMark: 100 },
        { subject: 'Exit Efficiency', A: scoreData.exitEfficiency * 100, fullMark: 100 },
        { subject: 'Risk Mgmt', A: scoreData.riskManagement * 100, fullMark: 100 },
        { subject: 'Discipline', A: scoreData.discipline * 100, fullMark: 100 },
    ];
    
    const getScoreColor = (score: number) => {
        if (score > 80) return 'bg-green-500';
        if (score > 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>TradeBook Quality Score</CardTitle>
                <div className="flex items-center justify-between">
                    <CardDescription>Prop-firm style journal analysis.</CardDescription>
                     <Badge className={getScoreColor(scoreData.overallScore)}>
                        {scoreData.overallScore} / 100
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                 <ResponsiveContainer width="100%" height={250}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Score" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
