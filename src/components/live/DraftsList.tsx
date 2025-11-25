// @/components/live/DraftsList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Copy, Trash2 } from 'lucide-react';
import { TradeDraft } from '@/lib/live-trading/types';
import { loadDrafts, saveDrafts } from '@/lib/live-trading/storage';

interface DraftsListProps {
  onOpenDraft: (draft: TradeDraft) => void;
}

export default function DraftsList({ onOpenDraft }: DraftsListProps) {
  const [drafts, setDrafts] = useState<TradeDraft[]>([]);

  useEffect(() => {
    setDrafts(loadDrafts());
    // This is a bit of a hack to listen for storage changes from other tabs/windows
    // A better solution would be a state management library or custom event bus.
    const handleStorageChange = () => {
      setDrafts(loadDrafts());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDelete = (e: React.MouseEvent, draftId: string) => {
    e.stopPropagation();
    const updatedDrafts = drafts.filter(d => d.id !== draftId);
    setDrafts(updatedDrafts);
    saveDrafts(updatedDrafts);
  };
  
  const handleClone = (e: React.MouseEvent, draft: TradeDraft) => {
    e.stopPropagation();
    const newDraft: TradeDraft = {
        ...draft,
        id: `draft_${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    const updatedDrafts = [newDraft, ...drafts];
    setDrafts(updatedDrafts);
    saveDrafts(updatedDrafts);
  };

  return (
    <Card className="bg-transparent border-white/10 rounded-sm">
      <CardContent className="p-0">
        <ScrollArea className="h-40">
          {drafts.length > 0 ? (
            <ul className="space-y-1 p-3 pt-0">
              {drafts.map(draft => (
                <li key={draft.id} onClick={() => onOpenDraft(draft)} className="flex items-center gap-2 p-2 rounded-sm bg-black/20 hover:bg-white/5 cursor-pointer">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <div className="flex-1 text-xs">
                    <p className="font-semibold">{draft.playbookName}</p>
                    <p className="text-gray-400">{draft.params.instrument} @ {new Date(draft.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleClone(e, draft)}><Copy className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-500/20" onClick={(e) => handleDelete(e, draft.id)}><Trash2 className="w-3 h-3 text-red-500" /></Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <p className="text-xs text-gray-500">No drafts prepared.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
