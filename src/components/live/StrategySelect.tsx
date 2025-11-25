// components/live/StrategySelect.tsx
'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { PlaybookTemplate } from '@/lib/live-trading/types';

/**
 * API Contract:
 * - playbooks: An array of PlaybookTemplate objects.
 * - selectedPlaybookId: The ID of the currently selected playbook.
 * - onSelectPlaybook: A callback function that receives the selected playbook ID.
 */
interface StrategySelectProps {
  playbooks: PlaybookTemplate[];
  selectedPlaybookId?: string | null;
  onSelectPlaybook: (id: string) => void;
}

export default function StrategySelect({
  playbooks,
  selectedPlaybookId,
  onSelectPlaybook,
}: StrategySelectProps) {
  return (
    <Select
      value={selectedPlaybookId || ''}
      onValueChange={onSelectPlaybook}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a strategy playbook..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Available Playbooks</SelectLabel>
          {playbooks.map((playbook) => (
            <SelectItem key={playbook.id} value={playbook.id}>
              <div className="flex flex-col">
                <span className="font-semibold">{playbook.name}</span>
                <span className="text-xs text-muted-foreground">
                  v{playbook.version} - {playbook.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
