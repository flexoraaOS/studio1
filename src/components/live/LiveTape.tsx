// components/live/LiveTape.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Placeholder component for the center live tape panel.
 */
export default function LiveTape() {
    return (
        <Card className="flex-1 bg-[#151516] border-white/10">
            <CardHeader>
                <CardTitle className="text-base text-gray-300">Live Tape</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500">
                    This will show live trade metrics like P&L, R-multiple, and time in trade.
                </p>
            </CardContent>
        </Card>
    );
}
