// @/components/live/PreTradePanel.tsx
'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DraftsList from './DraftsList';
import { PlaybookTemplate, TradeDraft } from '@/lib/live-trading/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PreTradePanelProps {
    playbook: PlaybookTemplate;
    onOpenDraft: (draft: TradeDraft) => void;
}

export default function PreTradePanel({ playbook, onOpenDraft }: PreTradePanelProps) {
    return (
        <>
            <Card className="flex-1 flex flex-col bg-transparent border-white/10 rounded-sm overflow-hidden">
                <CardHeader className="p-3 border-b border-white/10">
                    <CardTitle className="text-sm font-semibold flex items-center justify-between">
                        <span>{playbook.name}</span>
                        <Badge variant="outline" className="border-amber-500/50 text-amber-500 font-mono text-xs">
                            v{playbook.version}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400 pt-1">
                        {playbook.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-3 flex-1 overflow-y-auto space-y-3">
                     <h4 className="text-xs font-semibold text-gray-400">Key Rules</h4>
                     <ul className="space-y-3">
                        {playbook.rules.map(rule => (
                             <li key={rule.id} className="text-xs p-2 rounded-sm bg-black/20">
                                <div className="flex items-center gap-3">
                                    <Checkbox id={rule.id} />
                                    <Label htmlFor={rule.id} className="flex-1 text-gray-300">
                                        <span className="font-semibold text-gray-400">{rule.category}:</span> {rule.description}
                                        {rule.isMandatory && <span className="text-red-400 ml-1">*</span>}
                                    </Label>
                                </div>
                            </li>
                        ))}
                     </ul>
                </CardContent>
            </Card>
            <DraftsList onOpenDraft={onOpenDraft} />
        </>
    );
}
