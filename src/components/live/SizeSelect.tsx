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
import { ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SizeSelectProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const LOT_SIZES = [
  { value: 100, label: 'Nano (100)' },
  { value: 1000, label: 'Micro (1,000)' },
  { value: 10000, label: 'Mini (10,000)' },
  { value: 100000, label: 'Standard (100k)' },
];

export default function SizeSelect({ value, onChange, disabled }: SizeSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSelect = (currentValue: string) => {
    const numericValue = parseInt(currentValue, 10);
    if (!isNaN(numericValue)) {
        onChange(numericValue);
        setInputValue(numericValue.toString());
    }
    setOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = parseInt(e.target.value, 10);
    setInputValue(e.target.value);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };
  
   const handleBlur = () => {
    const numericValue = parseInt(inputValue, 10);
    if (isNaN(numericValue)) {
      // If input is invalid, revert to last valid value
      setInputValue(value.toString());
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
          <CommandList>
            <CommandEmpty>No sizes found.</CommandEmpty>
            <CommandGroup>
              {LOT_SIZES.map((size) => (
                <CommandItem
                  key={size.value}
                  value={String(size.value)}
                  onSelect={handleSelect}
                  className="aria-selected:bg-white/10"
                >
                  {size.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
