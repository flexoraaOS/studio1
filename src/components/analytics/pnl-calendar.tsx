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
  const year = new Date(data[0]?.date).getFullYear();
  const weeks: (PnlCalendarData | null)[][] = Array.from({ length: 53 }, () => Array(7).fill(null));
  const monthLabels: { name: string; week: number }[] = [];

  let lastMonth = -1;

  data.forEach(day => {
    const date = new Date(day.date);
    if (date.getFullYear() === year) {
      const dayOfWeek = date.getDay();
      const firstDayOfYear = new Date(year, 0, 1);
      const dayOfYear = Math.floor((date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24));
      const weekOfYear = Math.floor((dayOfYear + firstDayOfYear.getDay()) / 7);

      if(weeks[weekOfYear]) {
        weeks[weekOfYear][dayOfWeek] = day;
      }
      
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ name: date.toLocaleString('default', { month: 'short' }), week: weekOfYear });
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
      <CardContent>
        <TooltipProvider>
            <div className="flex flex-col items-center">
                 <div className="grid grid-flow-col gap-1">
                     {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-rows-7 gap-1">
                            {week.map((day, dayIndex) => (
                                <Tooltip key={dayIndex}>
                                    <TooltipTrigger asChild>
                                        <div className={cn(
                                            "w-4 h-4 rounded-sm",
                                            day ? getColorForPnl(day.pnl) : 'bg-gray-200 dark:bg-gray-800'
                                        )} />
                                    </TooltipTrigger>
                                    {day && (
                                        <TooltipContent>
                                            <p>{new Date(day.date).toLocaleDateString()}: ₹{day.pnl.toFixed(2)}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            ))}
                        </div>
                    ))}
                 </div>
                <div className="flex justify-between w-full mt-2 self-start pl-8">
                     {monthLabels.map(label => (
                        <div key={label.name} style={{ gridColumnStart: label.week + 1 }} className="text-xs text-muted-foreground">
                            {label.name}
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
