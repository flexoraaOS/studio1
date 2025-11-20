import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Kpi } from '@/lib/types';

interface KpiCardProps {
    kpi: Kpi;
    icon: React.ReactNode;
}

export default function KpiCard({ kpi, icon }: KpiCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                    {kpi.change && (
                        <span className={cn(
                            "mr-1",
                            kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        )}>
                            {kpi.change}
                        </span>
                    )}
                    <p>{kpi.description}</p>
                </div>
            </CardContent>
        </Card>
    );
}
