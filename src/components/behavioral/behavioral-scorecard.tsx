'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BehavioralMetric } from '@/lib/types';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BehavioralScorecardProps {
    metric: BehavioralMetric;
}

const statusConfig = {
    good: { icon: CheckCircle, color: 'text-green-500' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500' },
    bad: { icon: XCircle, color: 'text-red-500' },
};

export default function BehavioralScorecard({ metric }: BehavioralScorecardProps) {
    const { icon: Icon, color } = statusConfig[metric.status];

    return (
        <Card>
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                            <Icon className={cn("w-5 h-5", color)} />
                        </CardHeader>
                    </TooltipTrigger>
                     <TooltipContent>
                        <p>{metric.description}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CardContent>
                <div className="text-3xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
            </CardContent>
        </Card>
    );
}
