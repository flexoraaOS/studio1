// components/enterprise/NLPCompanionPanel.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send } from 'lucide-react';
import { Badge } from '../ui/badge';

/**
 * NLPCompanionPanel Component
 * @description UI Placeholder for an AI-driven journal companion.
 */
export default function NLPCompanionPanel() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Journal Companion
                </CardTitle>
                <CardDescription>Ask questions about your trading performance.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
                <ScrollArea className="h-full min-h-[200px] w-full space-y-4 pr-4">
                    {/* Mocked conversation */}
                    <div className="flex justify-end">
                        <p className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%]">
                            Why do I keep losing money on Fridays?
                        </p>
                    </div>
                    <div className="flex justify-start">
                         <p className="bg-muted p-3 rounded-lg max-w-[80%]">
                            Analyzing your Friday trades... It seems your win rate drops by 15% and you tend to use 50% larger size on Fridays compared to other days. This suggests potential over-confidence or fatigue.
                        </p>
                    </div>
                    <div className="flex justify-start">
                         <div className="bg-muted p-3 rounded-lg max-w-[80%] space-y-2">
                            <p className="font-semibold text-sm">Suggestion:</p>
                             <p>Consider reducing your trade size by half on Fridays or implementing a mandatory review session before the market opens.</p>
                         </div>
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4">
                <div className="relative w-full">
                    <Input placeholder="Ask a question or type '/'" className="pr-10" />
                    <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
