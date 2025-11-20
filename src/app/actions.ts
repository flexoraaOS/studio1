'use server';

import { z } from 'zod';
import { enhanceAuditTrail } from '@/ai/flows/enhance-audit-trail-with-ai';

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

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  tradeId?: string;
  enhancedContext?: string;
};

export async function addTradeAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = tradeSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(validatedFields.error.flatten().fieldErrors)) {
        fields[key] = 'invalid';
    }
    return {
      message: 'Invalid form data.',
      fields,
      issues: validatedFields.error.flatten().fieldErrors.symbol,
    };
  }
  
  const { symbol, entryPrice, potentialAnomaly } = validatedFields.data;
  let enhancedContext: string | undefined = undefined;

  // Simulate saving the trade to a database
  const tradeId = `TRADE-${Date.now()}`;
  console.log(`Saving trade ${tradeId}:`, validatedFields.data);
  
  // If a potential anomaly is described, use AI to enhance the audit trail
  if (potentialAnomaly) {
    try {
      const tradeDetails = `Symbol: ${symbol}, Entry Price: ${entryPrice}`;
      const aiResponse = await enhanceAuditTrail({
        tradeDetails,
        potentialAnomaly,
      });
      enhancedContext = aiResponse.enhancedContext;
      console.log(`AI Enhanced Context for ${tradeId}:`, enhancedContext);
    } catch (error) {
      console.error('AI enhancement failed:', error);
      // Continue without AI context, but maybe log the error
    }
  }
  
  // Revalidate path or redirect here in a real app
  // revalidatePath('/trades');

  return { 
    message: 'Trade added successfully!',
    tradeId,
    enhancedContext,
  };
}
