'use client';
import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addTradeAction, type FormState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Wand2 } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} useAnimation>
            {pending ? 'Saving...' : 'Save Trade'}
        </Button>
    );
}

export default function AddTradeSheet({ children }: { children: React.ReactNode }) {
    const initialState: FormState = { message: '' };
    const [state, formAction] = useFormState(addTradeAction, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (state.message) {
            if (state.tradeId) {
                toast({
                    title: "Success",
                    description: state.message,
                });
                formRef.current?.reset();
                setOpen(false);
            } else if (state.issues) {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: state.message,
                });
            }
        }
    }, [state, toast]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Add New Trade</SheetTitle>
                    <SheetDescription>
                        Record a new trade journal entry with as much detail as possible.
                    </SheetDescription>
                </SheetHeader>
                <form ref={formRef} action={formAction}>
                    <ScrollArea className="h-[calc(100vh-12rem)] pr-6">
                        <div className="space-y-6 py-6">
                            <div className="space-y-2">
                                <Label htmlFor="symbol">Symbol</Label>
                                <Input id="symbol" name="symbol" placeholder="e.g., RELIANCE, TSLA" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="direction">Direction</Label>
                                    <Select name="direction" defaultValue="Long">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select direction" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Long">Long</SelectItem>
                                            <SelectItem value="Short">Short</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="size">Size</Label>
                                    <Input id="size" name="size" type="number" placeholder="e.g., 100" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="entryPrice">Entry Price</Label>
                                    <Input id="entryPrice" name="entryPrice" type="number" step="any" placeholder="e.g., 2300.50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="exitPrice">Exit Price</Label>
                                    <Input id="exitPrice" name="exitPrice" type="number" step="any" placeholder="e.g., 2315.75" />
                                </div>
                            </div>
                            
                             <div className="space-y-2">
                                <Label htmlFor="strategy">Strategy</Label>
                                <Input id="strategy" name="strategy" placeholder="e.g., Breakout, Momentum" />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea id="notes" name="notes" placeholder="Why did you take this trade? What was your thesis?" />
                            </div>
                            
                             <div className="space-y-3 rounded-lg border border-dashed border-amber-500/50 p-4">
                                <Label htmlFor="potentialAnomaly" className="flex items-center gap-2">
                                    <Wand2 className="h-5 w-5 text-amber-400" />
                                    <span className="font-semibold">AI-Powered Anomaly Analysis</span>
                                </Label>
                                <Textarea id="potentialAnomaly" name="potentialAnomaly" placeholder="Describe anything unusual about this trade. e.g., 'Slippage was high', 'Price moved against major news', 'Felt hesitant on entry'." />
                                <p className="text-xs text-muted-foreground">If filled, AI will analyze market data for context around the anomaly.</p>
                            </div>
                            
                             {state.enhancedContext && (
                                <Alert>
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>AI Enhanced Context</AlertTitle>
                                    <AlertDescription>
                                        {state.enhancedContext}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </ScrollArea>
                    <SheetFooter className="pt-4">
                        <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </SheetClose>
                        <SubmitButton />
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
