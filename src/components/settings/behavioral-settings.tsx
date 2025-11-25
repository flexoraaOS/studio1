'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BehavioralSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Behavioral Rules</CardTitle>
                <CardDescription>
                    Define your personal rules for trading discipline. These thresholds will power your Behavioral Dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="max-trades-day">Max Trades Per Day</Label>
                        <Input id="max-trades-day" type="number" defaultValue="10" />
                        <p className="text-xs text-muted-foreground">Helps prevent over-trading.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="min-hold-time">Min Hold Time (minutes)</Label>
                        <Input id="min-hold-time" type="number" defaultValue="60" />
                        <p className="text-xs text-muted-foreground">Ensures you give trades enough time to play out.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="max-consecutive-losses">Max Consecutive Losses</Label>
                        <Input id="max-consecutive-losses" type="number" defaultValue="5" />
                        <p className="text-xs text-muted-foreground">A signal to take a break after a losing streak.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="revenge-trade-threshold">Revenge Trading Threshold (%)</Label>
                        <Input id="revenge-trade-threshold" type="number" defaultValue="5" />
                        <p className="text-xs text-muted-foreground">Max % of trades made within 15 mins of a large loss.</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button useAnimation>Save Rules</Button>
            </CardFooter>
        </Card>
    );
}
