'use client';
import React, { useState, useEffect } from 'react';
import { computeElapsedTime } from '@/lib/live-trading/trade-utils';

interface LiveTimerProps {
  startTime: string;
}

export default function LiveTimer({ startTime }: LiveTimerProps) {
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(computeElapsedTime(startTime, new Date()));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="flex items-center justify-center bg-black/20 text-white font-mono text-sm px-3 py-1 rounded-sm border border-white/10">
      {elapsed}
    </div>
  );
}
