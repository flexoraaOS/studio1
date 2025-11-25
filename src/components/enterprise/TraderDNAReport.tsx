// components/enterprise/TraderDNAReport.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dna, TrendingUp, TrendingDown, Clock, Shield, Download } from 'lucide-react';
import { mockTraderDNA } from '@/lib/enterprise/mock-data';
import { Badge } from '../ui/badge';

/**
 * TraderDNAReport Component
 * @description A summary card of the trader's psychological and behavioral profile.
 */
export default function TraderDNAReport() {
  const dna = mockTraderDNA;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna className="text-primary" />
          Trader DNA Report
        </CardTitle>
        <CardDescription>Your unique trading personality profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h4 className="font-semibold text-sm">Primary Bias</h4>
          <Badge variant="destructive">{dna.primaryBias}</Badge>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Key Strengths</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {dna.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Areas for Improvement</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            {dna.weaknesses.map((weakness, i) => <li key={i}>{weakness}</li>)}
          </ul>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t">
            <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-green-500" /> Best Regime: <span className="font-semibold">{dna.bestRegime}</span></div>
            <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-500" /> Best Timeframe: <span className="font-semibold">{dna.bestTimeframe}</span></div>
        </div>
      </CardContent>
       <CardFooter>
        <Button variant="secondary" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Full Report
        </Button>
      </CardFooter>
    </Card>
  );
}
