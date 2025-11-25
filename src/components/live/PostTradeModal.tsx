// @/components/live/PostTradeModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save } from 'lucide-react';
import { TradeDraft, PlaybookTemplate, CompletedTrade } from '@/lib/live-trading/types';
import { calculateRealizedPnl } from '@/lib/live-trading/tradeUtils';

interface PostTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: TradeDraft | null;
  playbook: PlaybookTemplate;
  onSave: (trade: CompletedTrade) => void;
}

export default function PostTradeModal({ isOpen, onClose, draft, playbook, onSave }: PostTradeModalProps) {
  const [formData, setFormData] = useState({
    entryPrice: draft?.params.entryPrice ?? '',
    exitPrice: '',
    fees: '',
  });

  useEffect(() => {
    // Reset form when draft changes
    setFormData({
      entryPrice: draft?.params.entryPrice ?? '',
      exitPrice: '',
      fees: '',
    });
  }, [draft]);

  const handleSave = () => {
    const entryPrice = parseFloat(formData.entryPrice);
    const exitPrice = parseFloat(formData.exitPrice);
    const fees = parseFloat(formData.fees) || 0;
    const size = draft?.params.size || 0;
    const side = draft?.params.side || 'Long';

    if (!draft || isNaN(entryPrice) || isNaN(exitPrice)) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const pnl = calculateRealizedPnl(side, entryPrice, exitPrice, size, fees);

    const finalizedTrade: CompletedTrade = {
      id: `trade_${Date.now()}`,
      draftId: draft.id,
      playbookId: draft.playbookId,
      instrument: draft.params.instrument || 'N/A',
      side: side,
      size: size,
      entryTimestamp: draft.createdAt,
      exitTimestamp: new Date().toISOString(),
      entryPrice,
      exitPrice,
      fees,
      pnl,
      rMultiple: 0, // Placeholder
      slippage: 0, // Placeholder
      notes: draft.notes || '',
      tags: [],
      attachments: [],
    };
    onSave(finalizedTrade);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col bg-[#0D0D0E] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Finalize & Log Trade</DialogTitle>
          <DialogDescription>
            Confirm execution details for your trade on {draft?.params.instrument} based on the "{playbook.name}" playbook.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6">
          <div className="grid grid-cols-2 gap-6 py-4">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-300">Execution Details</h3>
              <div>
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input id="entryPrice" name="entryPrice" type="number" value={formData.entryPrice} onChange={handleChange} className="bg-black/20 border-white/10" />
              </div>
              <div>
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input id="exitPrice" name="exitPrice" type="number" value={formData.exitPrice} onChange={handleChange} className="bg-black/20 border-white/10" />
              </div>
              <div>
                <Label htmlFor="fees">Fees</Label>
                <Input id="fees" name="fees" type="number" value={formData.fees} onChange={handleChange} className="bg-black/20 border-white/10" />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
               <h3 className="font-semibold text-gray-300">Review & Notes</h3>
               <div>
                 <Label htmlFor="notes">Trade Notes</Label>
                 <Textarea id="notes" name="notes" defaultValue={draft?.notes} className="bg-black/20 border-white/10 h-32" />
               </div>
               {/* Placeholder for screenshot uploader and rule evaluation */}
               <div className="p-4 rounded-md border border-dashed border-white/20 text-center text-xs text-gray-500">
                    Screenshot Uploader & Rule Evaluation Panel Placeholder
               </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleSave} className="bg-red-500 hover:bg-red-600 text-white">
            <Save className="mr-2 h-4 w-4" /> Finalize & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
