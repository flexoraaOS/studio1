// components/live/RulesList.tsx
'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaybookRule } from '@/lib/live-trading/types';
import { Badge } from '@/components/ui/badge';

/**
 * API Contract:
 * - rules: An array of PlaybookRule objects.
 */
interface RulesListProps {
  rules: PlaybookRule[];
}

export default function RulesList({ rules }: RulesListProps) {
  const rulesByCategory: Record<string, PlaybookRule[]> = rules.reduce((acc, rule) => {
    const category = rule.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rule);
    return acc;
  }, {} as Record<string, PlaybookRule[]>);

  return (
    <ScrollArea className="h-48 pr-4">
      <Accordion type="multiple" defaultValue={Object.keys(rulesByCategory)}>
        {Object.entries(rulesByCategory).map(([category, categoryRules]) => (
          <AccordionItem value={category} key={category}>
            <AccordionTrigger className="text-sm font-semibold">{category}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pl-2">
                {categoryRules.map((rule) => (
                  <li key={rule.id} className="text-sm">
                    <p className="font-medium">{rule.name}</p>
                    <p className="text-xs text-muted-foreground">{rule.explanation}</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      <span className="font-semibold">Example:</span> {rule.example}
                    </p>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
}
