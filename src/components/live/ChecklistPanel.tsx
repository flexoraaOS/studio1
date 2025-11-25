// components/live/ChecklistPanel.tsx
'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChecklistItem } from '@/lib/live-trading/types';
import { Badge } from '../ui/badge';

/**
 * API Contract:
 * - items: An array of ChecklistItem objects.
 * - checklistState: A record mapping item IDs to their boolean checked state.
 * - onChecklistChange: A callback function fired when a checkbox is toggled.
 */
interface ChecklistPanelProps {
  items: ChecklistItem[];
  checklistState: Record<string, boolean>;
  onChecklistChange: (itemId: string, isChecked: boolean) => void;
}

export default function ChecklistPanel({
  items,
  checklistState,
  onChecklistChange,
}: ChecklistPanelProps) {
  return (
    <ScrollArea className="h-40 pr-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-md border p-3">
            <Checkbox
              id={item.id}
              checked={checklistState[item.id] || false}
              onCheckedChange={(checked) => onChecklistChange(item.id, !!checked)}
              className="mt-0.5"
            />
            <div className="grid gap-1.5">
              <Label htmlFor={item.id} className="font-medium leading-snug text-sm">
                {item.label}
              </Label>
              {item.isMandatory && (
                <Badge variant="destructive" className="w-fit">Mandatory</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
