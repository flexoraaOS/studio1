// components/enterprise/ExposurePyramid.tsx
'use client';

import React, { useState } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { ExposurePyramidNode } from '@/lib/enterprise/types';
import { mockExposurePyramidData } from '@/lib/enterprise/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface CustomContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: any;
  colors?: string[];
  rank?: number;
  name?: string;
}

const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];

const CustomizedContent = (props: CustomContentProps) => {
  const { root, depth = 0, x=0, y=0, width=0, height=0, index=0, name } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 ? (
        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
          {name}
        </text>
      ) : null}
      {depth === 2 ? (
         <text x={x + 4} y={y + 18} fill="#fff" fontSize={12} fillOpacity={0.9}>
          {name}
        </text>
      ) : null}
    </g>
  );
};


/**
 * ExposurePyramid Component
 * @description Hierarchical view of portfolio exposure by asset class, sector, and instrument.
 */
export default function ExposurePyramid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exposure Pyramid</CardTitle>
        <CardDescription>Hierarchical breakdown of portfolio exposure.</CardDescription>
      </CardHeader>
      <CardContent>
         <ResponsiveContainer width="100%" height={300}>
            <Treemap
                data={mockExposurePyramidData.children}
                dataKey="value"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent colors={COLORS} />}
            />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
