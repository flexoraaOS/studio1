import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Trade } from '@/lib/types';

interface RecentTradesTableProps {
    trades: Trade[];
}

export default function RecentTradesTable({ trades }: RecentTradesTableProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Recent Trades</CardTitle>
                    <CardDescription>An overview of your last 5 trades.</CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/trades">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Symbol</TableHead>
                            <TableHead className="hidden sm:table-cell">Direction</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="text-right">Realized P&L</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.map((trade) => (
                            <TableRow key={trade.id}>
                                <TableCell>
                                    <div className="font-medium">{trade.symbol}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">{trade.strategy}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                     <Badge variant={trade.direction === 'Long' ? 'default' : 'secondary'} className={cn(trade.direction === 'Long' ? 'bg-green-600/20 text-green-400 border-green-600/40 hover:bg-green-600/30' : 'bg-red-600/20 text-red-400 border-red-600/40 hover:bg-red-600/30')}>{trade.direction}</Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant={trade.status === 'Closed' ? 'default' : 'secondary'} className={cn(trade.status !== 'Closed' && 'bg-accent text-accent-foreground')}>{trade.status}</Badge>
                                </TableCell>
                                <TableCell className={cn("text-right font-medium", trade.realizedPnl > 0 ? 'text-green-400' : trade.realizedPnl < 0 ? 'text-red-400' : 'text-foreground')}>
                                    {trade.currency === 'INR' ? '₹' : trade.currency === 'USD' ? '$' : '€'}
                                    {trade.realizedPnl.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
