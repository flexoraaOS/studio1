// components/enterprise/HotspotDetection.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle } from 'lucide-react';
import { mockHotspots } from '@/lib/enterprise/mock-data';
import type { Hotspot } from '@/lib/enterprise/types';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

/**
 * HotspotDetection Component
 * @description Identifies and displays clusters of significant losses.
 */
export default function HotspotDetection() {
  const sortedHotspots = mockHotspots.sort((a, b) => b.lossConcentration - a.lossConcentration);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="text-destructive" />
          Loss Hotspot Detection
        </CardTitle>
        <CardDescription>Dimensions where losses are most concentrated.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dimension</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Loss Concentration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHotspots.map((hotspot, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant="secondary">{hotspot.dimension}</Badge>
                </TableCell>
                <TableCell className="font-semibold">{hotspot.value}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="font-mono text-sm text-destructive">
                      {(hotspot.lossConcentration * 100).toFixed(1)}%
                    </span>
                    <Progress value={hotspot.lossConcentration * 100} className="w-24 bg-destructive/20" indicatorClassName="bg-destructive" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
