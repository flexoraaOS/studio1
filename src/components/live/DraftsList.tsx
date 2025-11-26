'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Trash2 } from 'lucide-react';
import { TradeDraft } from '@/lib/live-trading/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

interface DraftsListProps {
  drafts: TradeDraft[];
  onOpenDraft: (draft: TradeDraft) => void;
  onCloneDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
}

export default function DraftsList({ drafts, onOpenDraft, onCloneDraft, onDeleteDraft }: DraftsListProps) {

  return (
    <Card className="bg-[#121213] border-white/10">
      <CardHeader className="p-3">
          <CardTitle className="text-base font-semibold text-white">Trade Drafts</CardTitle>
      </CardHeader>
      <CardContent className="p-2 space-y-2">
        {drafts.length > 0 ? (
          drafts.map((draft) => (
            <div key={draft.id} className="flex items-center justify-between bg-[#1A1A1B] p-2 rounded-md border border-white/5 group">
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpenDraft(draft)}>
                <p className="font-semibold truncate text-sm">{draft.params.instrument?.symbol || 'No Instrument'}</p>
                <p className="text-xs text-gray-400 truncate">
                  {draft.playbookName} - {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCloneDraft(draft.id)}>
                        <Copy className="w-4 h-4 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Clone Draft</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeleteDraft(draft.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Delete Draft</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed border-white/10 rounded-md">
            <FileText className="mx-auto w-8 h-8 text-gray-600" />
            <p className="mt-2 text-sm text-gray-500">No prepared drafts.</p>
            <p className="text-xs text-gray-600">Prepare a trade to see it here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
