# DSArena: Business & Technical Specification

## 1. Platform Overview
**DSArena** is an enterprise-grade competitive programming and learning ecosystem. It serves as a high-fidelity "battleground" for Data Structures & Algorithms (DSA), blending the rigorous evaluation of platforms like LeetCode with the immersive gamification and anti-cheat proctoring required for high-stakes assessments.

### Core Value Propositions
- **Gamified Neural Link:** Integrated "Lives System" that enforces focus and precision.
- **Mission-Critical Integrity:** Multi-layered proctoring for exams (visibility monitoring, fullscreen enforcement).
- **Personalized Evolution:** AI-driven hints and learning tracks tailored to user performance.
- **Language Polyglot:** Support for 10+ major programming languages with standardized I/O templates.

---

## 2. Business Logic & Rules Engine

### 2.1 The Focus Economy (Lives System)
The platform uses a "Hearts" mechanic to regulate the economy of focus.
- **Hard Metric:** Users start with 3 Lives (Hearts).
- **Deduction Triggers:** 
    - Failed code submissions (in certain modes).
    - Focus violations during high-stakes exams (tab switching, window blurring).
- **Restoration Cycle:** 1 life restores every 10 minutes (configured via `LIVES_CONFIG.RESTORE_TIME_MS`).
- **Business Impact:** Prevents "brute-force" guessing of solutions and emphasizes code quality over quantity.

### 2.2 High-Stakes Exam Framework
Exams are the definitive gatekeepers for user progression and certification.
- **Weighted Scoring:** 
    - Easy: 30%
    - Medium: 30%
    - Hard: 40%
- **Passing Threshold:** Standardized at 60% (`EXAM_CONFIG.MIN_PASS_SCORE`).
- **Eligibility Lockout:** Failure to pass an exam results in an eligibility block, requiring administrative override or a cooldown period.
- **Anti-Cheat Pipeline:** Real-time visibility monitoring with a 10-second "grace period" before life deduction.

### 2.3 Engagement Loops (XP & Streaks)
- **XP System:** Problems yield XP based on difficulty, contributing to a global rank (Operative -> Elite Commander).
- **Daily Challenges:** A seed-based problem generator ensures every user globally faces the same challenge daily, driving community engagement and consistent habits.
- **Streak Management:** Tracks consecutive days of activity, resetting upon missed participation.

---

## 3. High-Level Architecture

### THE NEUTRAL LINK (Frontend)
Built on **React 18** and **TypeScript**, the frontend is designed for high responsiveness and sleek "Neural" aesthetics.
- **Hook-Driven Service Layer:** Core logic is centralized in specialized hooks (e.g., `useExamEvaluation`, `useLivesManager`) to ensure predictable state transitions across the app.
- **Monaco Pro Editor:** A production-grade code editor providing IDE-level features (IntelliSense, syntax highlighting) in-browser.

### CORE SERVICES & DATABASE (Backend)
Powered by **Supabase (PostgreSQL)** for real-time data persistence and **Edge Functions** for isolated compute tasks.
- **Execution Pipeline:** An asynchronous flow that sends user code to a sandboxed Piston API runtime, returning results in <500ms.
- **AI Core:** Integration with **Google Gemini** for context-aware coding assistance and performance analysis.

---

## 4. Key Functional Modules

| Module | Purpose | Key Components |
| :--- | :--- | :--- |
| **Arena** | Real-time competitive solving. | `ProblemDetail`, `DailyChallenge` |
| **Academy** | Structured curriculum tracks. | `LearningTracks`, `LanguageTrackPage` |
| **Proctor** | High-stakes exam management. | `Exam`, `ExamAdmin`, `useExamSecurity` |
| **Analytics** | User progress and performance. | `Dashboard`, `Leaderboard` |

---

## 5. Security & Platform Integrity
1. **Sandboxed Execution:** User-provided code never executes on the platform's primary servers; it is offloaded to ephemeral, isolated Piston runtimes.
2. **Proctoring Engine:** Deep integration with browser visibility APIs and fullscreen events to detect and penalize external lookups during exams.
3. **Data Protection:** Row-Level Security (RLS) ensures users only have read/write access to their own submission history and metadata.
4. **Anti-Paste:** Context-aware paste blocking in specific "hardened" input fields.

---

## 6. Development & Deployment Model
- **Build System:** Vite + Bun for ultra-fast development cycles and optimized production bundles.
- **Performance Patterns:** 
    - **Code Splitting:** Route-based lazy loading ensures the initial payload remains small even as the application scales.
    - **Global Error Boundaries:** Fault-tolerant architecture that intercepts core exceptions to prevent service interruption.
- **Infrastructure:** Deployed via Netlify with Supabase as the unified backend-as-a-service.

---

## 7. Configuration Management
All platform-wide rules are virtualized in `src/lib/constants.ts`, allowing for rapid tuning:
- **`MAX_LIVES`**: 3
- **`EXAM_DURATION`**: 2 Hours
- **`XP_PER_PROBLEM`**: 50 XP
- **`MIN_PASS_SCORE`**: 60%

---
*Document Version: 1.1.0*
*Last Infrastructure Audit: 2026-01-14*
