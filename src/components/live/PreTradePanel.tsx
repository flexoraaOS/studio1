'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { PlaybookTemplate, TradeDraft } from '@/lib/live-trading/types';
import { FullPlaybookModal } from './FullPlaybookModal';
import DraftsList from './DraftsList';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface PreTradePanelProps {
  playbookId: string;
  playbooks: PlaybookTemplate[];
  drafts: TradeDraft[];
  onOpenDraft: (draft: TradeDraft) => void;
}

export default function PreTradePanel({ playbookId, playbooks, drafts, onOpenDraft }: PreTradePanelProps) {
  const [playbook, setPlaybook] = useState<PlaybookTemplate | null>(null);
  const [isFullPlaybookOpen, setFullPlaybookOpen] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const selectedPlaybook = playbooks.find(p => p.id === playbookId) || null;
    setPlaybook(selectedPlaybook);
    // Reset checklist when playbook changes
    const initialChecklist: Record<string, boolean> = {};
    selectedPlaybook?.rules.forEach(rule => {
      initialChecklist[rule.id] = false;
    });
    setChecklist(initialChecklist);
  }, [playbookId, playbooks]);

  const handleCheckChange = (ruleId: string, checked: boolean) => {
    setChecklist(prev => ({ ...prev, [ruleId]: checked }));
  };

  if (!playbook) {
    return (
      <Card className="bg-[#121213] border-white/10 flex-1">
        <CardContent className="p-4 text-center text-gray-500">
          <p>Select a playbook to see its details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-[#121213] border-white/10 flex flex-col">
        <CardHeader className="p-3 border-b border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base font-semibold text-white">Pre-Trade Analysis</CardTitle>
              <CardDescription className="text-xs text-gray-500">{playbook.name}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFullPlaybookOpen(true)}>
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 flex-1 overflow-y-auto space-y-3">
          <h4 className="text-sm font-semibold text-gray-400">Pre-Flight Checklist</h4>
          {playbook.rules.slice(0, 5).map(rule => (
             <div key={rule.id} className="flex items-center space-x-2 bg-[#1A1A1B] p-2 rounded-md border border-white/5">
                <Checkbox id={rule.id} 
                    checked={checklist[rule.id]}
                    onCheckedChange={(checked) => handleCheckChange(rule.id, !!checked)}
                    className="border-gray-600 data-[state=checked]:bg-[#39FF88] data-[state=checked]:text-black"
                />
                <Label htmlFor={rule.id} className="text-xs text-gray-300 leading-tight">
                    {rule.description}
                    {rule.isMandatory && <span className="text-red-500 ml-1">*</span>}
                </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <FullPlaybookModal 
        playbook={playbook}
        isOpen={isFullPlaybookOpen}
        onClose={() => setFullPlaybookOpen(false)}
      />
    </>
  );
}
