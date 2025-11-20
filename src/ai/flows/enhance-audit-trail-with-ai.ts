'use server';
/**
 * @fileOverview Enhances audit trails with relevant financial news and data using AI.
 *
 * - enhanceAuditTrail - A function that enhances the audit trail.
 * - EnhanceAuditTrailInput - The input type for the enhanceAuditTrail function.
 * - EnhanceAuditTrailOutput - The return type for the enhanceAuditTrail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceAuditTrailInputSchema = z.object({
  tradeDetails: z.string().describe('Details of the trade including timestamp, symbol, price, and volume.'),
  potentialAnomaly: z.string().describe('Description of the potential anomaly detected in the trade.'),
});
export type EnhanceAuditTrailInput = z.infer<typeof EnhanceAuditTrailInputSchema>;

const EnhanceAuditTrailOutputSchema = z.object({
  enhancedContext: z.string().describe('A summary of relevant financial news and data that provides context for the trade and potential anomaly.'),
});
export type EnhanceAuditTrailOutput = z.infer<typeof EnhanceAuditTrailOutputSchema>;

export async function enhanceAuditTrail(input: EnhanceAuditTrailInput): Promise<EnhanceAuditTrailOutput> {
  return enhanceAuditTrailFlow(input);
}

const enhanceAuditTrailPrompt = ai.definePrompt({
  name: 'enhanceAuditTrailPrompt',
  input: {schema: EnhanceAuditTrailInputSchema},
  output: {schema: EnhanceAuditTrailOutputSchema},
  prompt: `You are an AI assistant specializing in financial auditing. Given the details of a trade and a description of a potential anomaly, research and summarize relevant financial news and data from the trade's time period that might provide context for the trade and anomaly.

Trade Details: {{{tradeDetails}}}
Potential Anomaly: {{{potentialAnomaly}}}

Provide a concise summary of the relevant financial context:
`,
});

const enhanceAuditTrailFlow = ai.defineFlow(
  {
    name: 'enhanceAuditTrailFlow',
    inputSchema: EnhanceAuditTrailInputSchema,
    outputSchema: EnhanceAuditTrailOutputSchema,
  },
  async input => {
    const {output} = await enhanceAuditTrailPrompt(input);
    return output!;
  }
);
