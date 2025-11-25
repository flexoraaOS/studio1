// components/enterprise/NLPCompanionDialog.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import NLPCompanionPanel from './NLPCompanionPanel';

export default function NLPCompanionDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <NLPCompanionPanel />
      </DialogContent>
    </Dialog>
  );
}
