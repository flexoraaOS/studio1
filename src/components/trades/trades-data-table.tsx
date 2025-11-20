'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Trade } from '@/lib/types';

interface TradesDataTableProps {
    trades: Trade[];
}

export default function TradesDataTable({ trades }: TradesDataTableProps) {
    const [page, setPage] = React.useState(1);
    const tradesPerPage = 10;
    const paginatedTrades = trades.slice((page - 1) * tradesPerPage, page * tradesPerPage);
    const totalPages = Math.ceil(trades.length / tradesPerPage);

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Direction</TableHead>
                                <TableHead>Strategy</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">P&L (%)</TableHead>
                                <TableHead className="text-right">Realized P&L</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTrades.map((trade) => (
                                <TableRow key={trade.id}>
                                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                                    <TableCell>
                                        <Badge variant={trade.direction === 'Long' ? 'secondary' : 'outline'} className={cn(trade.direction === 'Long' ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50', 'font-medium')}>{trade.direction}</Badge>
                                    </TableCell>
                                    <TableCell>{trade.strategy}</TableCell>
                                    <TableCell>
                                        <Badge variant={trade.status === 'Closed' ? 'default' : 'secondary'} className={cn(trade.status !== 'Closed' && 'bg-accent text-accent-foreground')}>{trade.status}</Badge>
                                    </TableCell>
                                    <TableCell className={cn("text-right", trade.pnlPercent > 0 ? 'text-green-600' : 'text-red-600')}>
                                        {trade.pnlPercent.toFixed(2)}%
                                    </TableCell>
                                    <TableCell className={cn("text-right font-semibold", trade.realizedPnl > 0 ? 'text-green-600' : trade.realizedPnl < 0 ? 'text-red-600' : 'text-foreground')}>
                                        {trade.currency === 'INR' ? '₹' : trade.currency === 'USD' ? '$' : '€'}
                                        {trade.realizedPnl.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-xs text-muted-foreground">
                        Showing {(page - 1) * tradesPerPage + 1}-
                        {Math.min(page * tradesPerPage, trades.length)} of {trades.length} trades
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
