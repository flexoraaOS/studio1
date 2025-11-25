// components/live/TradeBlotter.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Placeholder component for the right-side trade blotter.
 */
export default function TradeBlotter() {
    return (
        <Card className="flex-1 bg-[#151516] border-white/10">
            <CardHeader>
                <CardTitle className="text-base text-gray-300">Trade Blotter</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">
                    This will show today's logged trades and a button for manual logging.
                </p>
            </CardContent>
        </Card>
    );
}
