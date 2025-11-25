
// @/components/live/PreTradePanel.tsx
'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { mockPlaybookTemplates } from '@/lib/live-trading/mock-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, AlertTriangle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function PreTradePanel() {
    const [playbook] = useState(mockPlaybookTemplates[0]);

    return (
        <Card className="flex-1 flex flex-col bg-transparent border-white/10 rounded-sm overflow-hidden">
            <CardHeader className="p-3 border-b border-white/10">
                <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>Pre-Trade Analysis</span>
                    <Badge variant="outline" className="border-amber-500/50 text-amber-500">ORB v1.2</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex-1 overflow-y-auto space-y-4">
                
                 <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-xs font-semibold py-2">Key Rules</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 text-xs text-gray-400 pl-2">
                          {playbook.rules.slice(0, 3).map(rule => (
                            <li key={rule.id} className="border-l-2 border-white/20 pl-2">{rule.name}: {rule.explanation}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-xs font-semibold py-2">Pre-Flight Checklist</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {playbook.checklist.map(item => (
                            <div key={item.id} className="flex items-center gap-2">
                                <Checkbox id={item.id} className="rounded-[2px]" />
                                <Label htmlFor={item.id} className="text-xs font-normal">{item.label}</Label>
                                {item.isMandatory && <AlertTriangle className="h-3 w-3 text-red-500" />}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                 </Accordion>
                

            </CardContent>
            <CardFooter className="p-2 border-t border-white/10">
                <Button variant="link" className="text-xs text-muted-foreground w-full">
                    <BookOpen className="mr-2 h-3 w-3" />
                    View Full Playbook
                </Button>
            </CardFooter>
        </Card>
    );
}
