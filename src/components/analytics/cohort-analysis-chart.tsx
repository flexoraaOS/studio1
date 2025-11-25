'use client';
import React, { useMemo } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { CohortDataPoint } from '@/lib/types';
import { mockCohortData } from '@/lib/data';

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--destructive))',
];

interface CohortAnalysisChartProps {
  cohortData: {
    cohorts: Record<string, number[]>;
    cohortNames: string[];
  };
}

export default function CohortAnalysisChart({ cohortData }: CohortAnalysisChartProps) {
  const { cohortNames, cohorts } = cohortData;

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    cohortNames.forEach((name, index) => {
      config[name] = {
        label: name,
        color: colors[index % colors.length],
      };
    });
    return config;
  }, [cohortNames]);

  const transformedData: CohortDataPoint[] = useMemo(() => {
    const maxLength = Math.max(...Object.values(cohorts).map(arr => arr.length));
    const data: CohortDataPoint[] = [];

    for (let i = 0; i < maxLength; i++) {
      const dataPoint: CohortDataPoint = { day: i };
      for (const cohortName of cohortNames) {
        if (cohorts[cohortName] && i < cohorts[cohortName].length) {
          dataPoint[cohortName] = cohorts[cohortName][i];
        }
      }
      data.push(dataPoint);
    }
    return data;
  }, [cohorts, cohortNames]);

  const formatCurrency = (value: number) => {
      if (Math.abs(value) >= 1_000) {
          return `₹${(value / 1_000).toFixed(1)}k`;
      }
      return `₹${value.toFixed(2)}`;
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Cohort / Vintage Analysis</CardTitle>
        <CardDescription>
          Measures edge persistence by cohort (strategy-version / month). This chart shows whether a strategy’s edge decays over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart
            data={transformedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{ value: 'Days Since Cohort Start', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Tooltip
                content={
                    <ChartTooltipContent
                        labelFormatter={(label) => `Day ${label}`}
                        formatter={(value, name) => (
                            <span>
                                {chartConfig[name as keyof typeof chartConfig]?.label}: {formatCurrency(Number(value))}
                            </span>
                        )}
                        indicator="dot"
                    />
                }
            />
            <Legend verticalAlign="top" height={40} />
            {cohortNames.map((cohortName, index) => (
              <Line
                key={cohortName}
                type="monotone"
                dataKey={cohortName}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                name={cohortName}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
