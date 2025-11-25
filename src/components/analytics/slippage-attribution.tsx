'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SlippageData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SlippageAttributionProps {
    data: SlippageData[];
}

export default function SlippageAttribution({ data }: SlippageAttributionProps) {
    
    const formatSlippage = (slippage: number, instrument: string) => {
        if (instrument.includes('/')) { // Forex or Crypto
            return `${(slippage * 10000).toFixed(2)} pips`;
        }
        return `₹${slippage.toFixed(2)}`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Slippage Attribution</CardTitle>
                <CardDescription>Average slippage by broker and instrument.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[260px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Broker</TableHead>
                                <TableHead>Instrument</TableHead>
                                <TableHead className="text-right">Avg. Slippage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Badge variant="secondary">{item.broker}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{item.instrument}</TableCell>
                                    <TableCell className="text-right font-mono text-xs text-amber-500">
                                        {formatSlippage(item.avgSlippage, item.instrument)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
