'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Instrument } from '@/lib/live-trading/types';
import { INSTRUMENT_GROUPS } from '@/lib/live-trading/mock-data';

interface InstrumentSelectProps {
  value: Instrument;
  onChange: (value: Instrument) => void;
  disabled?: boolean;
}

export default function InstrumentSelect({ value, onChange, disabled }: InstrumentSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          data-testid="instrument-select-trigger"
          className="w-[150px] justify-between bg-transparent border-white/10 rounded-sm"
          disabled={disabled}
        >
          <span className="truncate">{value.symbol}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-[#0F0F10] border-white/20 text-gray-200">
        <Command>
          <CommandInput placeholder="Search instrument..." className="h-9 border-0 bg-[#0F0F10] focus:ring-0 text-white" />
          <CommandList>
            <CommandEmpty>No instrument found.</CommandEmpty>
            {Object.entries(INSTRUMENT_GROUPS).map(([groupName, instruments]) => (
              <CommandGroup key={groupName} heading={groupName}>
                {instruments.map((instrument) => (
                  <CommandItem
                    key={instrument.symbol}
                    value={instrument.symbol}
                    onSelect={() => {
                      onChange(instrument);
                      setOpen(false);
                    }}
                    className="aria-selected:bg-white/10"
                  >
                    {instrument.symbol} - {instrument.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value.symbol === instrument.symbol ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
