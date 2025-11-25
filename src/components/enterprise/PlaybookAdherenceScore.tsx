// components/enterprise/PlaybookAdherenceScore.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { mockPlaybookAdherenceScores } from '@/lib/enterprise/mock-data';
import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

/**
 * PlaybookAdherenceScore Component
 * @description Shows how well recent trades adhered to their assigned playbooks.
 */
export default function PlaybookAdherenceScore() {
  const scores = mockPlaybookAdherenceScores;

  const getAdherenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-500';
    if (score >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playbook Adherence</CardTitle>
        <CardDescription>How well your trades followed your playbook rules.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[250px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trade</TableHead>
                <TableHead>Playbook</TableHead>
                <TableHead className="text-right">Adherence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map(score => (
                <TableRow key={score.tradeId}>
                  <TableCell className="font-mono text-xs">{score.tradeId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{score.playbookName}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <span className={`font-semibold ${getAdherenceColor(score.adherence)}`}>
                            {(score.adherence * 100).toFixed(0)}%
                        </span>
                        <Progress value={score.adherence * 100} className="w-20" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
