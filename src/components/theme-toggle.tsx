'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <>
      <DropdownMenuItem onClick={() => setTheme('light')}>
        <Sun className="mr-2" /> Light
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('dark')}>
        <Moon className="mr-2" /> Dark
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme('system')}>
        <Monitor className="mr-2" /> System
      </DropdownMenuItem>
    </>
  );
}
