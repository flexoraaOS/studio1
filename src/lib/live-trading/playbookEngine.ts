// This file contains the logic for the playbook rule engine.

import { 
    PlaybookRule, 
    ChecklistItem,
    LiveTradeSession,
    CompletedTrade,
    RuleEvaluationResult, 
    PlaybookResult 
} from './types';

/**
 * =================================================================
 * PLAYBOOK RULE ENGINE
 * =================================================================
 * This file contains the deterministic logic for evaluating trade
 * data against a playbook's rules and calculating adherence scores.
 * 
 * TODO: Add unit tests for this engine in `tests/utils/playbookEngine.test.ts`.
 */

// --- Rule Evaluation ---

function evaluateRule(rule: PlaybookRule, trade: CompletedTrade): RuleEvaluationResult {
    const { condition } = rule;
    let passed = false;
    let actualValue: any = 'N/A';
    let expectedValue: string = 'N/A';

    // Helper to get time from ISO string as HH:mm
    const getHhMm = (isoString: string) => new Date(isoString).toTimeString().substring(0, 5);

    try {
        switch (condition.type) {
            case 'numeric':
                actualValue = trade.session.params[condition.metric as keyof typeof trade.session.params];
                expectedValue = `${condition.operator} ${condition.value}`;
                if (typeof actualValue === 'number') {
                    if (condition.operator === '>') passed = actualValue > condition.value;
                    if (condition.operator === '>=') passed = actualValue >= condition.value;
                    if (condition.operator === '<') passed = actualValue < condition.value;
                    if (condition.operator === '<=') passed = actualValue <= condition.value;
                }
                break;
            
            case 'timeWindow':
                actualValue = getHhMm(trade.execution.entryTimestamp);
                expectedValue = `between ${condition.after} and ${condition.before}`;
                passed = actualValue >= condition.after && actualValue <= condition.before;
                break;
            
            case 'equality':
                 actualValue = trade.session.params[condition.metric as keyof typeof trade.session.params];
                 expectedValue = String(condition.value);
                 if (actualValue !== undefined) {
                    passed = actualValue === condition.value;
                 }
                break;

            // TODO: Implement other rule types (range, textContains, boolean)
            
            default:
                // For un-implemented rule types, we mark as not applicable (passed = true by default)
                passed = true;
                actualValue = 'N/A';
                expectedValue = 'Rule type not implemented';
        }
    } catch (e) {
        console.error(`Error evaluating rule ${rule.id}:`, e);
        passed = false; // Fail rule if an error occurs during evaluation
        actualValue = 'Error';
    }


    return {
        ruleId: rule.id,
        ruleName: rule.name,
        passed,
        actualValue: String(actualValue),
        expectedValue,
    };
}


// --- Main Engine Function ---

/**
 * Runs the playbook engine to evaluate a completed trade against its playbook.
 * @param trade - The completed trade object.
 * @param playbook - The playbook template used for the trade.
 * @returns A PlaybookResult object with scores and detailed rule evaluations.
 */
export function runPlaybookEngine(trade: CompletedTrade, playbook: PlaybookTemplate): PlaybookResult {
    // 1. Evaluate Checklist Adherence
    const mandatoryChecks = playbook.checklist.filter(c => c.isMandatory);
    const passedMandatoryChecks = mandatoryChecks.every(c => trade.session.checklistState[c.id]);
    
    const checklistPassed = Object.values(trade.session.checklistState).filter(Boolean).length;
    const checklistTotal = playbook.checklist.length;

    // 2. Evaluate Playbook Rules
    const ruleResults = playbook.rules.map(rule => evaluateRule(rule, trade));
    const passedRules = ruleResults.filter(r => r.passed).length;
    const totalRules = playbook.rules.length;

    // 3. Calculate Adherence Percentage
    // (passed_rules + completed_manual_checks) / total_rules_and_checks * 100
    const adherencePercent = ((passedRules + checklistPassed) / (totalRules + checklistTotal)) * 100;

    // 4. Calculate Plan-Follow Score (weighted)
    // Weights: entry 40%, risk 30%, exit 20%, checklist 10%
    const categoryWeights = { Entry: 0.4, Risk: 0.3, Exit: 0.2, Setup: 0 }; // Setup is covered by checklist
    let weightedScore = 0;
    let totalWeight = 0;

    ruleResults.forEach(result => {
        const rule = playbook.rules.find(r => r.id === result.ruleId);
        if (rule) {
            const category = rule.condition.type === 'timeWindow' ? 'Entry' : rule.condition.type === 'numeric' ? 'Risk' : 'Entry'; // Simplified mapping
            const weight = categoryWeights[category as keyof typeof categoryWeights] || 0;
            if (result.passed) {
                weightedScore += weight;
            }
            totalWeight += weight;
        }
    });

    const checklistScore = (checklistPassed / checklistTotal) * 0.1; // Checklist weight
    weightedScore += checklistScore;
    totalWeight += 0.1;
    
    const planFollowScore = (totalWeight > 0 ? (weightedScore / totalWeight) : 0) * 100;

    return {
        adherencePercent: parseFloat(adherencePercent.toFixed(1)),
        planFollowScore: parseFloat(planFollowScore.toFixed(1)),
        ruleResults,
        checklistPassed,
        checklistTotal,
    };
}
