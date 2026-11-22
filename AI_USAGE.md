# AI Usage Disclosure (AI_USAGE.md)

This disclosure document complies with the **FocusBoard Candidate Assessment** requirements regarding AI tool transparency, prompt documentation, and human verification.

---

## 1. AI Tools Used
- **Google Antigravity & Gemini 3.8 Flash (Agentic Architecture)**: Utilized for codebase scaffolding, Figma token extraction, component structure generation, and headless browser automated verification.
- **Antigravity Browser Subagents (`webview_browser`)**: Used to inspect the live Figma design frames (1:2, 1:167, 1:279, 15:2, 15:30, 15:58) directly and perform end-to-end responsive UI tests at 1440px, 768px, and 390px.

---

## 2. Representative Prompts (2-5 Examples)

### Prompt 1: Live Figma Token Extraction & Frame Inspection
> *"Navigate to the live Figma design file at https://www.figma.com/design/09TveHXjOvI73KDNndCFM4/FocusBoard-%E2%80%94-Dashboard-References. Inspect the Desktop Dashboard (1440x1000, 1:2), Mobile Dashboard (390x1128, 1:167), Create Task Modal (760x822, 1:279), and Focus Notes Slides (15:2, 15:30, 15:58). Extract exact color hex codes, typography sizes, card structures, badges, and layout hierarchy."*

### Prompt 2: Single Source of Truth & Reactive State Architecture
> *"Design a robust TaskContext with immutable CRUD operations in React 19 and TypeScript. Ensure total tasks, in-progress tasks, completed tasks, and completion percentage are dynamically calculated from task data and never hardcoded. Sync state reliably with localStorage under a resilient key."*

### Prompt 3: Focus Notes Carousel Synchronization
> *"Implement the 3-slide Focus Notes carousel (1106x152 px) matching Figma frames 15:2, 15:30, and 15:58. Ensure previous/next buttons cycle with boundary wrapping, synchronize horizontal indicator bars with active slide state, and support touch swipe gestures on mobile."*

### Prompt 4: Responsive Reflow & Touch Targets
> *"Adapt the task dashboard across 1440px desktop, 768px tablet, and 390px mobile viewports. On mobile, stack task cards with >= 44px hit targets, render the sticky bottom navigation bar (Overview, Tasks, Calendar, Settings), and ensure zero horizontal scrolling or layout clipping."*

---

## 3. AI-Assisted Areas
- **Figma Design Analysis**: Extracting typography styles, spacing tokens, badge pills, and frame dimensions from the live Figma link.
- **Component Modularization**: Structuring the UI into reusable components (`Sidebar`, `Header`, `FocusNotesCarousel`, `OverviewStats`, `TaskSection`, `TaskModal`, `DeleteConfirmModal`, `MobileBottomNav`).
- **TypeScript Types**: Defining comprehensive interfaces (`Task`, `TaskStatus`, `TaskPriority`, `TaskCategory`, `FocusNoteSlide`, `TaskStats`, `FilterState`).
- **Automated Verification**: Headless browser automation executing user interactions (slide cycling, form validation error triggers, task creation, and task completion).

---

## 4. Suggestions Checked, Corrected & Rejected

### Checked & Corrected: TypeScript `verbatimModuleSyntax` Compliance
- **Issue**: Modern Vite TypeScript configuration enables `verbatimModuleSyntax: true` by default. Early AI imports bundled type imports directly (`import { Task, TaskPriority } from './types'`), which caused compiler error `TS1484: 'Task' is a type and must be imported using a type-only import`.
- **Correction**: Manually checked and refactored all import statements across `TaskContext.tsx`, `TaskList.tsx`, `TaskFilters.tsx`, and `TaskModal.tsx` to strictly use `import type { ... }` syntax.

### Checked & Corrected: Figma Brand Fidelity vs Generic Tailwind Colors
- **Issue**: Standard AI-generated dashboards often default to generic Tailwind `indigo-600` (`#4F46E5`), generic gray backgrounds, and round circular badges.
- **Correction**: Inspected the exact Figma frames to discover specific design tokens:
  - Custom brand indigo `#4F46E5` paired with background canvas `#F8FAFC`.
  - Floating preview cards embedded inside the Focus Notes banner with individual task progress rings.
  - Square checkbox outlines with rounded-md edges (purple outline when incomplete, mint green `#DCFCE7` filled with `#16A34A` checkmark when completed).
  - Exact slide copy: "Make today count.", "Small steps, big progress.", "Celebrate the wins."

### Checked & Rejected: Prebuilt Heavy UI Libraries / Third-Party State Packages
- **Suggestion**: The AI suggested installing `@radix-ui/react-dialog`, `zustand`, or `framer-motion`.
- **Decision**: Rejected. Following the assessment guideline to demonstrate core React fundamentals and avoid bloated dependencies, we built lightweight, highly accessible native React dialogs, touch-friendly carousel transitions, and React Context + `useMemo` state management with zero external UI framework bloat.
