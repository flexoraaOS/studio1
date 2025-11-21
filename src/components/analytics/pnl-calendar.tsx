'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PnlCalendarData } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

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
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i;
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = Array.from({ length: firstDayOfWeek }, () => null).concat(
      Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const date = new Date(year, month, dayIndex + 1);
        return data.find(d => new Date(d.date).toDateString() === date.toDateString()) || { date: date.toISOString(), pnl: 0, isPlaceholder: true };
      })
    );

    return { monthName, days };
  });

  const monthGroups = [];
  for (let i = 0; i < months.length; i += 3) {
      monthGroups.push(months.slice(i, i + 3));
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>P&L Calendar Heatmap</CardTitle>
        <CardDescription>Daily profit and loss, 3 months at a time.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {monthGroups.map((group, groupIndex) => (
                  <CarouselItem key={groupIndex}>
                    <div className="p-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {group.map(({ monthName, days }) => (
                        <div key={monthName} className="flex flex-col items-center">
                          <h3 className="text-lg font-semibold mb-2">{monthName}</h3>
                          <div className="grid grid-cols-7 gap-1">
                            {weekDays.map(day => <div key={day} className="w-6 text-center text-xs text-muted-foreground">{day}</div>)}
                            {days.map((day, index) => (
                              <Tooltip key={index} delayDuration={100}>
                                  <TooltipTrigger asChild>
                                      <div className={cn(
                                          "w-6 h-6 rounded-sm",
                                          day ? getColorForPnl(day.pnl) : 'bg-transparent',
                                          day?.isPlaceholder && 'bg-muted/50'
                                      )} />
                                  </TooltipTrigger>
                                  {day && !day.isPlaceholder && (
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
                        </div>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default PnlCalendar;
