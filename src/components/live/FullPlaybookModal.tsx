'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlaybookTemplate } from '@/lib/live-trading/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FullPlaybookModalProps {
  playbook: PlaybookTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FullPlaybookModal: React.FC<FullPlaybookModalProps> = ({ playbook, isOpen, onClose }) => {
  if (!playbook) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#0F0F10] border-white/10 text-gray-200 font-code">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{playbook.name}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {playbook.description} (v{playbook.version})
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex gap-2">
          {playbook.allowedInstrumentTypes.map(type => (
            <Badge key={type} variant="secondary" className="bg-white/10 text-gray-300">{type}</Badge>
          ))}
        </div>
        <ScrollArea className="mt-6 h-[50vh]">
          <div className="space-y-4 pr-4">
            {['Setup', 'Entry', 'Risk', 'Exit'].map(category => {
              const rules = playbook.rules.filter(rule => rule.category === category);
              if (rules.length === 0) return null;
              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-white mb-2">{category} Rules</h3>
                  <div className="space-y-3">
                    {rules.map(rule => (
                      <div key={rule.id} className="p-3 bg-[#1A1A1B] border border-white/10 rounded-md">
                        <div className="flex items-start justify-between">
                          <p className="flex-1">{rule.description}</p>
                          {rule.isMandatory ? (
                            <Badge variant="destructive" className="bg-[#FF3B47]/20 text-[#FF3B47] border-none ml-2">Mandatory</Badge>
                          ) : (
                             <Badge variant="outline" className="border-white/20 text-gray-400 ml-2">Optional</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
