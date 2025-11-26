'use client';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { addTradeAction, type FormState } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const tradeSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  direction: z.enum(['Long', 'Short']),
  entryPrice: z.coerce.number().positive('Entry price must be positive'),
  exitPrice: z.coerce.number().optional(),
  size: z.coerce.number().positive('Size must be positive'),
  strategy: z.string().optional(),
  notes: z.string().optional(),
  potentialAnomaly: z.string().optional(),
});

type TradeFormValues = z.infer<typeof tradeSchema>;

const initialState: FormState = {
  message: '',
};

export default function AddTradeSheet({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialState);
  const { toast } = useToast();

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      direction: 'Long',
      notes: '',
      strategy: '',
      potentialAnomaly: '',
    },
  });

  const onSubmit = async (data: TradeFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const result = await addTradeAction(initialState, formData);

    setFormState(result);

    if (result.message === 'Trade added successfully!') {
      toast({
        title: 'Trade Added',
        description: `Trade for ${data.symbol} has been successfully recorded.`,
      });
      if (result.enhancedContext) {
        // AI context is now part of the state, so we can keep the sheet open.
      } else {
         setOpen(false);
         form.reset();
      }
    }
  };

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
        <ScrollArea className="h-[calc(100%-120px)] pr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., RELIANCE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="direction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direction</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Long">Long</SelectItem>
                          <SelectItem value="Short">Short</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
              </div>

               <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="entryPrice"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Entry Price</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="exitPrice"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Exit Price (Optional)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
               </div>

                <FormField
                  control={form.control}
                  name="strategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strategy (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Opening Range Breakout" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Why did you take this trade? What were the market conditions?"
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="potentialAnomaly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Potential Anomaly (for AI)</FormLabel>
                       <FormControl>
                        <Textarea
                          placeholder="Describe anything unusual about this trade, e.g., 'unexpectedly large slippage on entry'."
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                          If filled, AI will analyze market data for context around the anomaly.
                       </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {formState.enhancedContext && (
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>AI-Enhanced Audit Context</AlertTitle>
                        <AlertDescription>
                            {formState.enhancedContext}
                        </AlertDescription>
                    </Alert>
                )}
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Trade'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
