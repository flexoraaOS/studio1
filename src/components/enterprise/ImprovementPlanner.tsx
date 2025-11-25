// components/enterprise/ImprovementPlanner.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ListTodo, PlusCircle } from 'lucide-react';
import { mockImprovementTasks } from '@/lib/enterprise/mock-data';
import type { ImprovementTask } from '@/lib/enterprise/types';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

/**
 * ImprovementPlanner Component
 * @description An actionable task list auto-generated from analytics insights.
 */
export default function ImprovementPlanner() {
  const [tasks, setTasks] = useState<ImprovementTask[]>(mockImprovementTasks);

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, status: checked ? 'Done' : 'Todo' } : task
      )
    );
  };
  
  const getBadgeVariant = (status: 'Todo' | 'InProgress' | 'Done'): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Done': return 'default';
        case 'InProgress': return 'secondary';
        case 'Todo': return 'outline';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="text-primary" />
          Trade Improvement Planner
        </CardTitle>
        <CardDescription>Actionable tasks generated from your analytics to improve performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 pr-4">
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                <Checkbox
                  id={task.id}
                  checked={task.status === 'Done'}
                  onCheckedChange={checked => handleTaskToggle(task.id, !!checked)}
                  className="mt-1"
                />
                <div className="grid gap-1.5">
                  <Label htmlFor={task.id} className={cn("font-semibold", task.status === 'Done' && 'line-through text-muted-foreground')}>
                    {task.title}
                  </Label>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                   <div className="flex gap-2">
                     <Badge variant="destructive" className="bg-amber-500/20 text-amber-500 border-amber-500/30">From: {task.sourceFeature}</Badge>
                     <Badge variant={getBadgeVariant(task.status)}>{task.status}</Badge>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline">
          <PlusCircle className="mr-2" /> Add Manual Task
        </Button>
      </CardFooter>
    </Card>
  );
}
