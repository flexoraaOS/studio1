# Live Trading Cockpit - README

This document outlines the architecture, features, and technical details of the Live Trading Cockpit UI. This feature is built with a frontend-first, mock-driven approach.

## 1. Core Workflow: Draft → Finalize

The cockpit is **not** a live execution platform. It is a high-fidelity tool for preparing, logging, and reviewing trades via a "Draft-to-Finalize" workflow.

1.  **Prepare a Trade**: The user selects a playbook, instrument, and other parameters in the `LiveControlBar`. Clicking "Prepare Trade" (or pressing `S`) creates a `TradeDraft` object.
2.  **Open Post-Trade Modal**: This immediately opens the `PostTradeModal`, pre-filled with data from the draft.
3.  **Log Details**: The user fills in final details like exit price, fees, and notes.
4.  **Finalize**: Clicking "Save Finalized Trade" converts the draft into a `CompletedTrade` object, saves it, and removes the original draft.

## 2. Running the Application

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The cockpit is available at `/live-trading`.

## 3. Data Persistence (Mock)

All data is persisted in the browser's **localStorage**.

-   **Drafts Key**: `ts_drafts`
-   **Completed Trades Key**: `ts_closed_trades`

To clear old data from previous versions, run this snippet in your browser's developer console:
```javascript
localStorage.removeItem('ts_live_trades'); // Old key for live data
localStorage.removeItem('ts_drafts');
localStorage.removeItem('ts_closed_trades');
console.log('Live trading mock data cleared.');
```

## 4. Keyboard Shortcuts

-   `Ctrl/Cmd + K`: Focus the Instrument selection dropdown.
-   `S`: Prepare a new trade draft.
-   `E`: Open the Post-Trade Modal for a manual entry.
-   `Esc`: Close any open modal.

## 5. Folder Structure

-   `src/app/live-trading/page.tsx`: Main page component.
-   `src/components/live/`: All React components for this feature.
-   `src/lib/live-trading/types.ts`: TypeScript interfaces for `TradeDraft`, `CompletedTrade`, etc.
-   `src/lib/live-trading/mock-data.ts`: Mock playbooks and instruments.
-   `src/lib/live-trading/trade-utils.ts`: Calculation functions (PnL, R-Multiple).
-   `src/lib/live-trading/storage.ts`: `localStorage` wrapper for mock data persistence.

## 6. Future Backend Integration (Firestore)

This UI is designed to be easily migrated to a Firestore backend.

### Migration Steps:

1.  **Set up Firebase**: Ensure your Firebase project is configured in `src/firebase/config.ts`.
2.  **Update `storage.ts`**: Replace `localStorage` calls with Firestore SDK calls.

**Example: Migrating `saveDraft`**

```typescript
// BEFORE: src/lib/live-trading/storage.ts
import { TradeDraft } from './types';

export function saveDraft(draft: TradeDraft): void {
  // ... localStorage logic ...
}
```

```typescript
// AFTER: src/lib/live-trading/storage.ts
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase'; // Assuming these hooks
import { TradeDraft } from './types';

// This would become a React hook or part of a service class
export function useTradeActions() {
    const firestore = useFirestore();
    const { user } = useUser();

    const saveDraft = async (draft: TradeDraft) => {
        if (!user) throw new Error("User not authenticated");
        const draftRef = doc(firestore, 'users', user.uid, 'drafts', draft.id);
        // Use the non-blocking update wrapper
        await setDoc(draftRef, draft, { merge: true });
    };

    // ... other functions like saveTrade, deleteDraft, etc.
    return { saveDraft };
}
```

### Proposed Firestore Schema:

-   `/users/{userId}/drafts/{draftId}` (Collection: `drafts`)
-   `/users/{userId}/trades/{tradeId}` (Collection: `trades`)
-   `/playbooks/{playbookId}` (Global Collection)

---
*This README should be updated as the feature evolves.*
```