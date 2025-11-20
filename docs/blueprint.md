# **App Name**: TradeSight Pro

## Core Features:

- Journal Entry Recording: Record detailed trade information including trade ID, user ID, entry/exit times, market details, pricing, fees, P&L, currency, strategy, notes, emotions, confidence, risk metrics, and associated media.
- Multi-Currency FX Normalization: Automatically convert trade values to a normalized base currency (INR) using timestamped FX rates for accurate P&L calculations.
- Broker Data Import: Import trade data from various sources, including CSV/XLS files (with mapping UI), email confirmations (with OCR), broker APIs (REST/WebSocket/FIX), and webhook endpoints for real-time fills.
- Advanced Analytics Dashboard: Display institutional-level analytics and key performance indicators (KPIs) such as equity curve, P&L, win rate, expectancy, Sharpe ratio, Sortino ratio, Kelly criterion, CAGR, max drawdown, volatility, and performance across different timeframes, strategies, and instruments.
- Interactive Charting: Provide advanced interactive charts for visualizing trading performance, including equity curves (zoom/pan/brush), drawdown curves, heatmaps, rolling metrics, waterfall charts, multi-strategy overlays, and trade playback. Also provide annotation and export features.
- Secure User Authentication: Implement secure user authentication using OAuth2 and optional SSO, with support for 2FA and role-based access control (RBAC) for user, admin, and auditor roles.
- Audit Trail Generation: Track all updates to trade journal entries for auditing purposes. If some input information looks potentially wrong (perhaps outside of a normal trading range, such as slippage percentage), use an AI tool to incorporate more information into the audit trail by checking financial news and data from the approximate time period. This may illuminate a trading rationale, market event, etc., and will become part of the version history.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) to convey sophistication and trust in financial data.
- Background color: Light gray (#F0F0F0) to ensure readability and reduce eye strain during prolonged use.
- Accent color: Vibrant orange (#FFA500) for CTAs, highlights, and interactive elements, providing contrast and drawing attention.
- Headline font: 'Space Grotesk', a geometric sans-serif font for headlines to bring a touch of modernism, appropriate to financial application.
- Body font: 'Inter', a grotesque-style sans-serif with a clean and neutral design, making it easy to read, especially at smaller sizes. 
- Code font: 'Source Code Pro' for displaying code snippets and technical information.
- Use a consistent set of minimalist icons to represent different financial instruments, market types, and analytical metrics.
- Employ a clean and organized layout with a focus on data visualization and user interaction, ensuring that key information is easily accessible and digestible.
- Incorporate subtle animations and transitions to enhance user experience and provide feedback during data loading and interaction.