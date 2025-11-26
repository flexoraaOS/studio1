'use client';
import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';

interface SizeSelectProps {
  value: number; // This remains the currency unit value (e.g., 100000 for 1 standard lot)
  onChange: (value: number) => void;
  disabled?: boolean;
}

const LOT_SIZES = [
  { value: 1000, label: '0.01 (Micro Lot)' },
  { value: 10000, label: '0.10 (Mini Lot)' },
  { value: 100000, label: '1.00 (Standard Lot)' },
  { value: 200000, label: '2.00' },
  { value: 500000, label: '5.00' },
];
const STANDARD_LOT_UNITS = 100000;

export default function SizeSelect({ value, onChange, disabled }: SizeSelectProps) {
  const [open, setOpen] = useState(false);
  // inputValue now represents the lot size (e.g., "1.0"), not units
  const [inputValue, setInputValue] = useState((value / STANDARD_LOT_UNITS).toString());

  // Sync input when the external value changes
  useEffect(() => {
    setInputValue((value / STANDARD_LOT_UNITS).toString());
  }, [value]);

  const handleSelect = (currentValue: string) => {
    const numericValue = parseInt(currentValue, 10); // The value from CommandItem is units (e.g., "100000")
    if (!isNaN(numericValue)) {
      onChange(numericValue);
      setInputValue((numericValue / STANDARD_LOT_UNITS).toString());
    }
    setOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const displayValue = e.target.value;
    setInputValue(displayValue);
    const lotSize = parseFloat(displayValue);
    if (!isNaN(lotSize) && lotSize > 0) {
      onChange(lotSize * STANDARD_LOT_UNITS); // Convert lot size to currency units
    }
  };
  
  const handleBlur = () => {
    const lotSize = parseFloat(inputValue);
    if (isNaN(lotSize) || lotSize <= 0) {
      // If input is invalid, revert to last valid value
      setInputValue((value / STANDARD_LOT_UNITS).toString());
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-36">
           <Input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="bg-transparent border-white/10 rounded-sm pr-8"
              disabled={disabled}
              step="0.01"
              placeholder="e.g. 1.0"
            />
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className="absolute right-0 top-0 h-full px-2"
              onClick={() => setOpen(!open)}
            >
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-[#0F0F10] border-white/20 text-gray-200">
        <Command>
          <CommandInput placeholder="Search size..." className="h-9 border-0 bg-[#0F0F10] focus:ring-0 text-white" />
          <CommandList>
            <CommandEmpty>No sizes found.</CommandEmpty>
            <CommandGroup>
              {LOT_SIZES.map((size) => (
                <CommandItem
                  key={size.value}
                  value={String(size.value)} // The value passed to onSelect is the unit value
                  onSelect={handleSelect}
                  className="aria-selected:bg-white/10"
                >
                   {size.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === size.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
