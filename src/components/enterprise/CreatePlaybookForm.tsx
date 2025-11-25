// components/enterprise/CreatePlaybookForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaybookRule, PlaybookTemplate } from '@/lib/enterprise/types';

export default function CreatePlaybookForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [rules, setRules] = useState<Partial<PlaybookRule>[]>([
        { id: `rule_${Date.now()}`, category: 'Setup', description: '', isMandatory: false }
    ]);

    const handleRuleChange = (index: number, field: keyof PlaybookRule, value: string | boolean) => {
        const newRules = [...rules];
        const rule = newRules[index];
        if (rule) {
            (rule[field] as any) = value;
            setRules(newRules);
        }
    };

    const addRule = () => {
        setRules([...rules, { id: `rule_${Date.now()}`, category: 'Entry', description: '', isMandatory: false }]);
    };

    const removeRule = (index: number) => {
        const newRules = rules.filter((_, i) => i !== index);
        setRules(newRules);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPlaybook: Partial<PlaybookTemplate> = {
            id: `pb_${Date.now()}`,
            name,
            description,
            tags: tags.split(',').map(t => t.trim()),
            rules: rules as PlaybookRule[],
        };
        console.log('New Playbook Created:', newPlaybook);
        // Here you would typically close the dialog and pass the data up
        // or call a server action to save it.
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <ScrollArea className="h-[60vh] p-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="playbook-name">Playbook Name</Label>
                        <Input id="playbook-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Earnings Season Volatility" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="playbook-description">Description</Label>
                        <Textarea id="playbook-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the core concept of this strategy." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="playbook-tags">Tags (comma-separated)</Label>
                        <Input id="playbook-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., intraday, earnings, high-volatility" />
                    </div>

                    <h3 className="text-lg font-semibold pt-4">Rules</h3>
                    <div className="space-y-4">
                        {rules.map((rule, index) => (
                            <div key={rule.id} className="grid grid-cols-[1fr_120px_auto_auto] gap-2 items-center p-3 border rounded-lg">
                                <Input
                                    value={rule.description}
                                    onChange={(e) => handleRuleChange(index, 'description', e.target.value)}
                                    placeholder={`Rule ${index + 1} description`}
                                />
                                <Select
                                    value={rule.category}
                                    onValueChange={(value) => handleRuleChange(index, 'category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Setup">Setup</SelectItem>
                                        <SelectItem value="Entry">Entry</SelectItem>
                                        <SelectItem value="Exit">Exit</SelectItem>
                                        <SelectItem value="Risk">Risk</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                     <Checkbox
                                        id={`mandatory-${index}`}
                                        checked={rule.isMandatory}
                                        onCheckedChange={(checked) => handleRuleChange(index, 'isMandatory', !!checked)}
                                    />
                                    <Label htmlFor={`mandatory-${index}`} className="text-sm">Mandatory</Label>
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeRule(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <Button type="button" variant="outline" onClick={addRule} className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Rule
                    </Button>
                </div>
            </ScrollArea>
             <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="submit">Create Playbook</Button>
            </div>
        </form>
    );
}