'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Upload, Save, AlertTriangle } from 'lucide-react';
import { PlaybookTemplate, TradeDraft, CompletedTrade } from '@/lib/live-trading/types';
import { computePnL, computeRMultiple } from '@/lib/live-trading/trade-utils';
import { useDropzone } from 'react-dropzone';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface ModalState {
  isOpen: boolean;
  mode: 'manual' | 'finalize';
  draft?: TradeDraft;
}

export const usePostTradeModal = () => {
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, mode: 'manual' });

  const openModal = (state: Omit<ModalState, 'isOpen'>) => {
    setModalState({ ...state, isOpen: true });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'manual' });
  };

  return { modalState, openModal, closeModal };
};

interface PostTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: CompletedTrade, draftId?: string) => void;
  initialState: ModalState;
  playbooks: PlaybookTemplate[];
}

export const PostTradeModal: React.FC<PostTradeModalProps> = ({ isOpen, onClose, onSave, initialState, playbooks }) => {
  const { mode, draft } = initialState;
  
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [fees, setFees] = useState('0');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const playbook = playbooks.find(p => p.id === draft?.playbookId);
  
  const [ruleAdherence, setRuleAdherence] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setEntryPrice(draft?.params.entryPrice?.toString() || '');
      setExitPrice('');
      setStopLoss(draft?.params.stopLoss?.toString() || '');
      setFees('0');
      setNotes(draft?.notes || '');
      setTags(draft?.tags?.join(', ') || '');
      setScreenshot(null);
      if (playbook) {
        setRuleAdherence(playbook.rules.reduce((acc, rule) => ({ ...acc, [rule.id]: true }), {}));
      } else {
        setRuleAdherence({});
      }
    }
  }, [isOpen, draft, playbook]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setScreenshot(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*':[]} });

  const handleSave = () => {
    if (!draft) return;
    const { side, size = 0, instrument } = draft.params;
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const stop = parseFloat(stopLoss);
    
    if (isNaN(entry) || isNaN(exit) || !side || !instrument) return;

    const pnl = computePnL(entry, exit, size, side, instrument);
    const rMultiple = computeRMultiple(entry, exit, stop, side);

    const newTrade: CompletedTrade = {
      id: `trade_${Date.now()}`,
      draftId: draft.id,
      playbookId: draft.playbookId,
      instrument: instrument,
      side: side,
      size: size,
      entryTimestamp: draft.createdAt,
      exitTimestamp: new Date().toISOString(),
      entryPrice: entry,
      exitPrice: exit,
      stopLoss: stop,
      fees: parseFloat(fees),
      pnl: pnl - parseFloat(fees),
      rMultiple,
      slippage: 0, // Placeholder
      notes,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      attachments: screenshot ? [{ id: 'ss1', data: screenshot }] : [],
      adherence: ruleAdherence,
    };

    onSave(newTrade, draft.id);
    onClose();
  };

  const adherenceScore = playbook ? 
    (Object.values(ruleAdherence).filter(Boolean).length / playbook.rules.length) * 100 : 0;


  const pnl = computePnL(parseFloat(entryPrice), parseFloat(exitPrice), draft?.params.size || 0, draft?.params.side || 'Long', draft?.params.instrument);
  const netPnl = pnl - parseFloat(fees || '0');
  const rMultiple = computeRMultiple(parseFloat(entryPrice), parseFloat(exitPrice), parseFloat(stopLoss), draft?.params.side || 'Long');


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-auto bg-[#0F0F10] border-white/10 text-gray-200 font-code flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{mode === 'finalize' ? 'Finalize Trade' : 'Log Manual Trade'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {mode === 'finalize' && draft ? `Confirm details for: ${draft.params.instrument?.symbol} ${draft.params.side} @ ${draft.params.size/100000} lots` : 'Enter trade details manually.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            
            {/* Price Inputs */}
            <div className="grid grid-cols-3 gap-4">
              <div><Label htmlFor="entryPrice">Entry Price</Label><Input id="entryPrice" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} className="bg-[#1A1A1B] border-white/10" /></div>
              <div><Label htmlFor="exitPrice">Exit Price</Label><Input id="exitPrice" value={exitPrice} onChange={e => setExitPrice(e.target.value)} className="bg-[#1A1A1B] border-white/10" /></div>
              <div><Label htmlFor="stopLoss">Stop Loss</Label><Input id="stopLoss" value={stopLoss} onChange={e => setStopLoss(e.target.value)} className="bg-[#1A1A1B] border-white/10" /></div>
            </div>
            
            {/* P&L Section */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#1A1A1B] rounded-md border border-white/10 text-center">
                <div>
                  <p className="text-sm text-gray-400">Net P&L</p>
                  <p className={`text-2xl font-bold ${netPnl >= 0 ? 'text-[#39FF88]' : 'text-[#FF3B47]'}`}>
                    ${netPnl.toFixed(2)}
                  </p>
                </div>
                 <div>
                  <p className="text-sm text-gray-400">R-Multiple</p>
                  <p className={`text-2xl font-bold ${rMultiple >= 0 ? 'text-gray-200' : 'text-red-400'}`}>
                    {rMultiple.toFixed(2)}R
                  </p>
                </div>
                 <div>
                  <Label htmlFor="fees" className="text-sm text-gray-400">Fees / Comm.</Label>
                  <Input id="fees" value={fees} onChange={e => setFees(e.target.value)} className="bg-[#2a2a2c] border-white/10 mt-1 text-center" />
                </div>
            </div>

            {/* Qualitative Inputs */}
            <div className="flex-1 flex flex-col gap-4">
                <Label htmlFor="notes">Trade Rationale & Notes</Label>
                <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="bg-[#1A1A1B] border-white/10 flex-1" placeholder="Pre-trade thoughts, execution notes..."/>
            </div>

            <div {...getRootProps()} className="p-4 border-2 border-dashed border-white/20 rounded-md text-center cursor-pointer hover:bg-white/5">
              <input {...getInputProps()} />
              {screenshot ? <img src={screenshot} alt="Screenshot preview" className="max-h-24 mx-auto rounded-md" /> : <>
                <Upload className="mx-auto w-6 h-6 text-gray-500" />
                <p className="mt-1 text-xs text-gray-400">{isDragActive ? 'Drop screenshot here' : 'Drag & drop or click to upload'}</p>
              </>}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Playbook Rule Adherence</h3>
              <p className="text-sm text-gray-500 mb-3">Review which rules were followed for this trade.</p>
            </div>
            <ScrollArea className="h-[350px] pr-2">
              <div className="space-y-3">
                {playbook ? playbook.rules.map(rule => (
                  <div key={rule.id} className="p-3 bg-[#1A1A1B] border border-white/10 rounded-md flex items-center justify-between">
                    <p className="flex-1 text-sm">{rule.description}</p>
                    <div className="flex items-center gap-2">
                      {rule.isMandatory && <TooltipProvider><Tooltip><TooltipTrigger><AlertTriangle className="w-4 h-4 text-amber-400" /></TooltipTrigger><TooltipContent><p>Mandatory Rule</p></TooltipContent></Tooltip></TooltipProvider>}
                      <button onClick={() => setRuleAdherence(prev => ({ ...prev, [rule.id]: !prev[rule.id]}))} className={`p-1 rounded-full ${ruleAdherence[rule.id] ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {ruleAdherence[rule.id] ? <CheckCircle className="w-5 h-5 text-[#39FF88]" /> : <XCircle className="w-5 h-5 text-[#FF3B47]" />}
                      </button>
                    </div>
                  </div>
                )) : <p className="text-gray-500">No playbook associated with this draft.</p>}
              </div>
            </ScrollArea>
            {playbook && <div className="p-3 bg-white/5 rounded-md text-center text-sm">Adherence Score: <span className="font-bold">{adherenceScore.toFixed(0)}%</span></div>}
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button onClick={handleSave} variant="destructive" className="w-48">
            <Save className="w-4 h-4 mr-2" />
            Save Finalized Trade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

    