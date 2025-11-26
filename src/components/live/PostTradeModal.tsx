'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Upload, Save, AlertTriangle } from 'lucide-react';
import { PlaybookTemplate, TradeDraft, CompletedTrade, ActiveTrade } from '@/lib/live-trading/types';
import { saveTrade, deleteDraft } from '@/lib/live-trading/storage';
import { computePnL, computeRMultiple } from '@/lib/live-trading/trade-utils';
import { useDropzone } from 'react-dropzone';

export interface ModalState {
  isOpen: boolean;
  mode: 'manual' | 'finalize';
  draft?: TradeDraft;
  activeTrade?: ActiveTrade;
}

const usePostTradeModal = () => {
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
  onSave: (trade: CompletedTrade) => void;
  initialState: ModalState;
  playbooks: PlaybookTemplate[];
}

const PostTradeModal: React.FC<PostTradeModalProps> = ({ isOpen, onClose, onSave, initialState, playbooks }) => {
  const isFinalizing = initialState.mode === 'finalize';
  const tradeSource = isFinalizing ? initialState.activeTrade : initialState.draft;

  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [fees, setFees] = useState('0');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const playbook = playbooks.find(p => p.id === tradeSource?.playbookId);
  
  const [ruleAdherence, setRuleAdherence] = useState<Record<string, boolean>>(() => {
    if (!playbook) return {};
    return playbook.rules.reduce((acc, rule) => ({ ...acc, [rule.id]: !rule.isMandatory }), {});
  });

  useEffect(() => {
    if (isOpen && tradeSource) {
      setEntryPrice(tradeSource.params.entryPrice?.toString() || '');
      setExitPrice(isFinalizing ? tradeSource.params.exitPrice?.toString() || '' : '');
      setStopLoss(tradeSource.params.stopLoss?.toString() || '');
      setFees('0');
      setNotes(tradeSource.notes || '');
      setScreenshot(null);
      if (playbook) {
        setRuleAdherence(playbook.rules.reduce((acc, rule) => ({ ...acc, [rule.id]: !rule.isMandatory }), {}));
      }
    }
  }, [isOpen, tradeSource, playbook, isFinalizing]);

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
    if (!tradeSource) return;
    const { side, size = 0, instrument } = tradeSource.params;
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const stop = parseFloat(stopLoss);
    
    if (isNaN(entry) || isNaN(exit) || !side || !instrument) return;

    const pnl = computePnL(entry, exit, size, side);
    const rMultiple = computeRMultiple(entry, exit, stop, side);

    const newTrade: CompletedTrade = {
      id: `trade_${Date.now()}`,
      draftId: tradeSource.id,
      playbookId: tradeSource.playbookId,
      instrument: instrument,
      side: side,
      size: size,
      entryTimestamp: tradeSource.createdAt,
      exitTimestamp: new Date().toISOString(),
      entryPrice: entry,
      exitPrice: exit,
      stopLoss: stop,
      fees: parseFloat(fees),
      pnl: pnl - parseFloat(fees),
      rMultiple,
      slippage: 0,
      notes,
      tags: [],
      attachments: screenshot ? [{ id: 'ss1', data: screenshot }] : [],
      adherence: ruleAdherence,
    };

    saveTrade(newTrade);
    if(initialState.draft) {
      deleteDraft(initialState.draft.id);
    }
    onSave(newTrade);
    onClose();
  };

  const adherenceScore = playbook ? 
    (Object.values(ruleAdherence).filter(Boolean).length / playbook.rules.length) * 100 : 0;


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] bg-[#0F0F10] border-white/10 text-gray-200 font-code flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Finalize Trade</DialogTitle>
          <DialogDescription className="text-gray-400">
            Confirm details for: {tradeSource?.params.instrument?.symbol} ({tradeSource?.params.side})
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden py-4">
          {/* Left Column */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="entryPrice">Entry Price</Label><Input id="entryPrice" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} className="bg-[#1A1A1B] border-white/10" /></div>
              <div><Label htmlFor="exitPrice">Exit Price</Label><Input id="exitPrice" value={exitPrice} onChange={e => setExitPrice(e.target.value)} className="bg-[#1A1A1B] border-white/10" /></div>
              <div><Label htmlFor="stopLoss">Stop Loss</Label><Input id="stopLoss" value={stopLoss} onChange={e => setStopLoss(e.target.value)} className="bg-[#1A1A1B] border-white/10" /></div>
              <div><Label htmlFor="fees">Fees</Label><Input id="fees" value={fees} onChange={e => setFees(e.target.value)} className="bg-[#1A1A1B] border-white/10" /></div>
            </div>

            <div className="p-4 bg-[#1A1A1B] rounded-md border border-white/10 text-center">
              <p className="text-sm text-gray-400">Net P&L</p>
              <p className={`text-3xl font-bold ${computePnL(parseFloat(entryPrice), parseFloat(exitPrice), tradeSource?.params.size || 0, tradeSource?.params.side) - parseFloat(fees) >= 0 ? 'text-[#39FF88]' : 'text-[#FF3B47]'}`}>
                ${(computePnL(parseFloat(entryPrice), parseFloat(exitPrice), tradeSource?.params.size || 0, tradeSource?.params.side) - parseFloat(fees)).toFixed(2)}
              </p>
            </div>

            <div {...getRootProps()} className="p-6 border-2 border-dashed border-white/20 rounded-md text-center cursor-pointer hover:bg-white/5">
              <input {...getInputProps()} />
              {screenshot ? <img src={screenshot} alt="Screenshot preview" className="max-h-40 mx-auto rounded-md" /> : <>
                <Upload className="mx-auto w-8 h-8 text-gray-500" />
                <p className="mt-2 text-sm text-gray-400">{isDragActive ? 'Drop screenshot here' : 'Drag & drop or click to upload'}</p>
              </>}
            </div>

            <div><Label htmlFor="notes">Trade Rationale & Notes</Label><Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="bg-[#1A1A1B] border-white/10 min-h-[100px]" /></div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-2">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Playbook Rule Adherence</h3>
              <p className="text-sm text-gray-500 mb-4">Review which rules were followed for this trade.</p>
              <div className="space-y-3">
                {playbook ? playbook.rules.map(rule => (
                  <div key={rule.id} className="p-3 bg-[#1A1A1B] border border-white/10 rounded-md flex items-center justify-between">
                    <p className="flex-1 text-sm">{rule.description}</p>
                    <div className="flex items-center gap-2">
                      {rule.isMandatory && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      <button onClick={() => setRuleAdherence(prev => ({ ...prev, [rule.id]: !prev[rule.id]}))} className={`p-1 rounded-full ${ruleAdherence[rule.id] ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {ruleAdherence[rule.id] ? <CheckCircle className="w-5 h-5 text-[#39FF88]" /> : <XCircle className="w-5 h-5 text-[#FF3B47]" />}
                      </button>
                    </div>
                  </div>
                )) : <p className="text-gray-500">No playbook associated with this draft.</p>}
              </div>
            </div>
            {playbook && <div className="p-3 bg-white/5 rounded-md text-center text-sm">Adherence Score: <span className="font-bold">{adherenceScore.toFixed(0)}%</span></div>}
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <Button onClick={handleSave} className="bg-[#FF3B47] text-white hover:bg-[#FF3B47]/80 shadow-[0_0_15px_rgba(255,59,71,0.5)] w-40">
            <Save className="w-4 h-4 mr-2" />
            Save Finalized Trade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { PostTradeModal, usePostTradeModal };
