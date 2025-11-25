
// @/components/live/LiveTape.tsx
'use client';
import React, from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const MetricDisplay = ({ label, value, color, unit }: {label:string, value:string, color?: string, unit?: string}) => (
    <div className="p-3 border border-white/10 rounded-sm bg-black/30">
        <p className="text-xs text-gray-400">{label}</p>
        <p className={`text-xl font-semibold ${color || 'text-white'}`}>
            {value}
            {unit && <span className="text-sm ml-1 text-gray-400">{unit}</span>}
        </p>
    </div>
);


export default function LiveTape() {
    return (
        <Card className="flex-1 bg-transparent border-white/10 rounded-sm">
            <CardHeader className="p-3 border-b border-white/10">
                <CardTitle className="text-sm font-semibold">Live Trade Monitor</CardTitle>
            </CardHeader>
            <CardContent className="p-3 grid grid-cols-2 gap-2">
                <div className="col-span-1 space-y-2">
                    <Label htmlFor="entry-price" className="text-xs">Entry Price</Label>
                    <Input id="entry-price" type="number" defaultValue="1.07520" className="bg-transparent border-white/10 rounded-sm"/>
                </div>
                 <div className="col-span-1 space-y-2">
                    <Label htmlFor="exit-price" className="text-xs">Exit Price</Label>
                    <Input id="exit-price" type="number" placeholder="---" className="bg-transparent border-white/10 rounded-sm" disabled/>
                </div>
                
                <div className="col-span-2 grid grid-cols-2 gap-2">
                    <MetricDisplay label="Live P/L" value="+450.75" color="text-[#39FF88]" unit="USD" />
                    <MetricDisplay label="R-Multiple" value="+1.8" color="text-[#39FF88]" unit="R" />
                    <MetricDisplay label="Dist. to Stop" value="12.5" color="text-[#FFAA55]" unit="pips" />
                    <MetricDisplay label="Exp. Target (2R)" value="1.07770" />
                </div>
            </CardContent>
        </Card>
    );
}
