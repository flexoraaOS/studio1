'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ImprovementPlanner from '@/components/enterprise/ImprovementPlanner';

export function RemindersDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[60%]">
        <ImprovementPlanner />
      </DialogContent>
    </Dialog>
  );
}
