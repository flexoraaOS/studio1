// components/enterprise/PlaybookBuilder.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookCopy, PlusCircle, Save } from 'lucide-react';
import type { PlaybookTemplate, PlaybookRule } from '@/lib/enterprise/types';
import { mockPlaybookTemplates } from '@/lib/enterprise/mock-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreatePlaybookForm from './CreatePlaybookForm';

/**
 * PlaybookBuilder Component
 * @description UI for creating, managing, and applying trading playbooks.
 * @param {Object} props - Component properties.
 * @param {PlaybookTemplate[]} [props.templates=mockPlaybookTemplates] - Array of playbook templates.
 */
export default function PlaybookBuilder({ templates = mockPlaybookTemplates }: { templates?: PlaybookTemplate[] }) {
    const [selectedTemplate, setSelectedTemplate] = useState<PlaybookTemplate | null>(templates[0] || null);
    const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Load saved state from localStorage
        const savedState = localStorage.getItem(`playbook_${selectedTemplate?.id}`);
        if (savedState) {
            setCheckedRules(JSON.parse(savedState));
        } else {
            // Reset checks when template changes
            const initialChecks: Record<string, boolean> = {};
            selectedTemplate?.rules.forEach(rule => initialChecks[rule.id] = false);
            setCheckedRules(initialChecks);
        }
    }, [selectedTemplate]);

    const handleTemplateChange = (templateId: string) => {
        const template = templates.find(t => t.id === templateId) || null;
        setSelectedTemplate(template);
    };

    const handleCheckChange = (ruleId: string, checked: boolean) => {
        const newCheckedRules = { ...checkedRules, [ruleId]: checked };
        setCheckedRules(newCheckedRules);
        // Save to localStorage
        if(selectedTemplate) {
            localStorage.setItem(`playbook_${selectedTemplate.id}`, JSON.stringify(newCheckedRules));
        }
    };
    
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookCopy className="w-5 h-5" />
                    Playbook Builder
                </CardTitle>
                <CardDescription>Define, manage, and apply your trading strategies.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
                <Select onValueChange={handleTemplateChange} defaultValue={selectedTemplate?.id}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a playbook..." />
                    </SelectTrigger>
                    <SelectContent>
                        {templates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                                {template.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedTemplate && (
                    <ScrollArea className="flex-grow h-[200px] border rounded-md p-4">
                        <div className="space-y-4">
                            {selectedTemplate.rules.map((rule: PlaybookRule) => (
                                <div key={rule.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={rule.id}
                                        checked={checkedRules[rule.id] || false}
                                        onCheckedChange={(checked) => handleCheckChange(rule.id, !!checked)}
                                    />
                                    <Label htmlFor={rule.id} className="text-sm font-normal">
                                        {rule.description}
                                        {rule.isMandatory && <span className="text-destructive ml-1">*</span>}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Playbook
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                         <DialogHeader>
                            <DialogTitle>Create New Playbook</DialogTitle>
                        </DialogHeader>
                        <CreatePlaybookForm />
                    </DialogContent>
                </Dialog>
                <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Template
                </Button>
            </CardFooter>
        </Card>
    );
}
