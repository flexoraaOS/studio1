# TradeSight Pro - Enterprise Features README

This document outlines the architecture, data contracts, and integration notes for the enterprise-grade analytics features of TradeSight Pro.

## 1. Overview

This suite of features is built with a **frontend-first** methodology using a mock-driven approach. All components are designed to be production-quality, responsive, and accessible. They are currently powered by mock data located in `src/lib/enterprise/mock-data.ts`.

The calculation logic for these features is located in `src/lib/enterprise/utils.ts` and is intended to be unit-tested.

## 2. Running the Application

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`. The new enterprise dashboard is located at `/enterprise`.

## 3. Technology Stack

-   **Framework**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS with `shadcn/ui` components
-   **Data Visualization**: Recharts
-   **Testing**: Jest (configuration to be added)
-   **Component Library**: Storybook (configuration to be added)

## 4. Folder Structure

-   `src/app/(app)/enterprise/`: Main dashboard page for the enterprise suite.
-   `src/components/enterprise/`: Contains all React components for the enterprise features.
-   `src/lib/enterprise/types.ts`: Centralized TypeScript interfaces.
-   `src/lib/enterprise/mock-data.ts`: Mock datasets and data generators.
-   `src/lib/enterprise/utils.ts`: Calculation utilities.
-   `src/stories/enterprise/`: Storybook stories for each component.
-   `src/tests/`: Unit tests for utilities.

## 5. API Contracts & Backend Integration Notes

The following sections define the expected API contracts for each component when transitioning from mock data to a live backend.

### **PlaybookBuilder.tsx**

-   **Props**:
    ```typescript
    interface PlaybookBuilderProps {
      templates: PlaybookTemplate[];
    }
    ```
-   **API Endpoints (Future)**:
    -   `GET /api/playbooks`: Fetch all playbook templates for the user.
    -   `POST /api/playbooks`: Create a new playbook template.
    -   `PUT /api/playbooks/{id}`: Update an existing playbook template.

### **PerformanceMatrix.tsx**

-   **Props**:
    ```typescript
    interface PerformanceMatrixProps {
      data: PerformanceMatrixData;
    }
    ```
-   **API Endpoints (Future)**:
    -   `GET /api/analytics/performance-matrix?timeframe=...&accountId=...`: Fetch matrix data based on filters. The backend should perform the time-based aggregation.

### **RiskOfRuin.tsx**

-   **Props**: This component is self-contained but will need live data to populate initial parameters.
-   **API Endpoints (Future)**:
    -   `GET /api/analytics/risk-params?accountId=...`: Fetch user's current win rate and avg. R:R to pre-fill the sliders.

### **MultiPathMonteCarlo.tsx**

-   **Props**: None. Fetches its own data.
-   **API Endpoints (Future)**:
    -   `GET /api/simulations/monte-carlo`: Fetch historical returns for client-side simulation.
    -   `POST /api/simulations/monte-carlo/run`: **(Recommended for Scale)** Offload large-scale simulations to the backend. Request body would include `numSims`, `horizonDays`, `scenario`, etc. The endpoint would return a job ID to poll for results.

### **NLPCompanionPanel.tsx**

-   **Props**: None.
-   **API Endpoints (Future)**:
    -   `POST /api/ai/companion`: Send user query and conversation history.
        -   **Request Body**: `{ query: string; history: { role: 'user' | 'assistant', content: string }[] }`
        -   **Response Body**: `{ reply: string; type: 'summary' | 'suggestion'; relatedTrades?: string[] }`

---
*This README will be expanded as more components are built.*
