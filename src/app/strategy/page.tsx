
'use client';
import React from 'react';
import PlaybookBuilder from '@/components/enterprise/PlaybookBuilder';
import TradeBookQualityScore from '@/components/enterprise/TradeBookQualityScore';
import PlaybookAdherenceScore from '@/components/enterprise/PlaybookAdherenceScore';
import CrossStrategyConflict from '@/components/enterprise/CrossStrategyConflict';
import HotspotDetection from '@/components/enterprise/HotspotDetection';
import RiskMatrix from '@/components/enterprise/RiskMatrix';

export default function StrategyPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline text-gradient">Strategy Builder & Analyzer</h1>
                    <p className="text-muted-foreground">Define, test, and refine your trading strategies.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                    <PlaybookBuilder />
                    <PlaybookAdherenceScore />
                </div>
                <div className="flex flex-col gap-6">
                    <TradeBookQualityScore />
                    <HotspotDetection />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CrossStrategyConflict />
                <RiskMatrix />
            </div>

        </div>
    );
}
