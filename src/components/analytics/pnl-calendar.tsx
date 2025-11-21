'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PnlCalendarData } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PnlCalendarProps {
  data: PnlCalendarData[];
}

const getColorForPnl = (pnl: number) => {
  if (pnl > 2000) return 'bg-green-700';
  if (pnl > 500) return 'bg-green-500';
  if (pnl > 0) return 'bg-green-300';
  if (pnl < -2000) return 'bg-red-700';
  if (pnl < -500) return 'bg-red-500';
  if (pnl < 0) return 'bg-red-300';
  return 'bg-muted';
};

const PnlCalendar = ({ data }: PnlCalendarProps) => {
  if (!data || data.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>P&L Calendar Heatmap</CardTitle>
                <CardDescription>Daily profit and loss over the past year.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>No P&L data available for the calendar.</p>
            </CardContent>
        </Card>
    )
  }

  const year = new Date(data[0].date).getFullYear();
  const weeks: (PnlCalendarData | null)[][] = Array.from({ length: 53 }, () => Array(7).fill(null));
  const monthLabels: { name: string; startWeek: number }[] = [];

  let lastMonth = -1;
  const firstDayOfYear = new Date(year, 0, 1);
  const yearStartDay = firstDayOfYear.getDay();

  data.forEach(day => {
    const date = new Date(day.date);
    if (date.getFullYear() === year) {
      const dayOfWeek = date.getDay();
      const dayOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
      const weekOfYear = Math.floor((dayOfYear + yearStartDay) / 7);

      if(weeks[weekOfYear]) {
        weeks[weekOfYear][dayOfWeek] = day;
      }
      
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ name: date.toLocaleString('default', { month: 'short' }), startWeek: weekOfYear });
        lastMonth = month;
      }
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>P&L Calendar Heatmap</CardTitle>
        <CardDescription>Daily profit and loss over the past year.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <TooltipProvider>
            <div className="inline-block">
                <div className="grid grid-cols-53 grid-rows-1 gap-2.5 mb-2 text-xs text-muted-foreground">
                    {monthLabels.map((label) => (
                        <div key={label.name} style={{ gridColumnStart: label.startWeek + 1 }} className="col-span-4 text-left">
                            {label.name}
                        </div>
                    ))}
                </div>
                 <div className="grid grid-flow-col auto-cols-max gap-1">
                     {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-rows-7 gap-1">
                            {week.map((day, dayIndex) => (
                                <Tooltip key={dayIndex} delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "w-4 h-4 rounded-sm",
                                            day ? getColorForPnl(day.pnl) : 'bg-gray-200 dark:bg-gray-800'
                                        )} />
                                    </TooltipTrigger>
                                    {day && (
                                        <TooltipContent>
                                            <p className="text-sm font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            <p className={cn("font-semibold", day.pnl > 0 ? 'text-green-500' : 'text-red-500')}>
                                                P&L: ₹{day.pnl.toFixed(2)}
                                            </p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            ))}
                        </div>
                    ))}
                 </div>
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default PnlCalendar;
