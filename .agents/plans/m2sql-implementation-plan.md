# Implementation Plan: M2SQL Power Query to SQL Translator

## Overview
Build a production-ready Next.js app that translates Power Query (M) code into optimized T-SQL using Claude 3.5 Sonnet via OpenRouter. Features include split-pane code editors with CodeMirror 6, real-time streaming translation, side-by-side comparison mode, in-memory translation history, and 5-10 realistic example snippets.

**Tech Stack:**
- Next.js 16.2.6 (App Router)
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui components
- Vercel AI SDK + OpenRouter
- CodeMirror 6 for code editing
- Claude 3.5 Sonnet model

---

## Implementation Steps

### Phase 1: Foundation & Dependencies (30-45 min)

**1.1 Initialize shadcn/ui**
- Run: `npx shadcn@latest init`
- Accept defaults for Next.js App Router + Tailwind CSS v4
- Creates `components.json`, sets up aliases `@/components/ui` and `@/lib/utils`

**1.2 Install core dependencies** (*parallel with 1.1*)
```bash
pnpm add ai @ai-sdk/react @openrouter/ai-sdk-provider zod
pnpm add @uiw/react-codemirror @codemirror/lang-sql @codemirror/language
pnpm add lucide-react
```

**1.3 Install shadcn/ui components**
```bash
npx shadcn@latest add button resizable card textarea alert select spinner sonner scroll-area badge separator skeleton
```

**1.4 Configure environment variables**
- Create `.env.local` with `OPENROUTER_API_KEY=sk-or-...`
- Add `.env.local` to `.gitignore` if not already present

**1.5 Update app metadata** (*parallel with 1.3-1.4*)
- Modify `app/layout.tsx`: Update title to "M2SQL - Power Query to SQL Translator"
- Update description: "Translate Power Query (M) code into optimized Microsoft SQL Server T-SQL queries using AI"

---

### Phase 2: Core UI Layout (1-1.5 hours)

**2.1 Create base page layout**
- File: `app/page.tsx`
- Replace default content with `'use client'` component
- Set up main container with header, resizable panels, and action toolbar
- *Dependencies: Phase 1 complete*

**2.2 Build resizable split-pane layout**
- Use `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` from shadcn
- Default split: 50/50 horizontal layout
- Left panel: M Code input
- Right panel: SQL output
- Minimum panel size: 30%

**2.3 Create CodeEditor component** (*parallel with 2.4*)
- File: `app/components/code-editor.tsx`
- Wrap `@uiw/react-codemirror` with CodeMirror
- Props: `value`, `onChange`, `language` ('sql' or custom 'mcode'), `readOnly`, `placeholder`
- Configure SQL syntax highlighting with `@codemirror/lang-sql`
- Create basic M Code language definition (keywords: `let`, `in`, `each`, `Table.`, operators)
- Dark mode theme integration
- Height: `min-h-[500px]`

**2.4 Create SQLOutput component** (*parallel with 2.3*)
- File: `app/components/sql-output.tsx`
- Uses `CodeEditor` component in read-only mode
- Wraps in `Card` component
- Includes copy button in `CardHeader`
- `ScrollArea` for better overflow handling
- Show skeleton loader when translating

**2.5 Build ActionToolbar component**
- File: `app/components/action-toolbar.tsx`
- Buttons: Translate (primary), Copy SQL, Clear All, Download SQL
- Loading state on Translate button with `Spinner`
- Icon support with Lucide React (`Zap`, `Copy`, `Trash2`, `Download`)
- Disabled states during translation

---

### Phase 3: AI Translation Core (1.5-2 hours)

**3.1 Create API route handler**
- File: `app/api/translate/route.ts`
- Set up OpenRouter provider with `createOpenRouter()`
- Configure `streamText()` with Claude 3.5 Sonnet (`anthropic/claude-3.5-sonnet`)
- Implement system prompt from PROMPT.md requirements
- Use `Output.object()` with zod schema: `{ sql: string, explanation: string, optimizations: string[] }`
- Return `result.toTextStreamResponse()` for streaming
- Error handling with try/catch and proper error responses
- *Dependencies: Phase 1 complete*

**3.2 Create translation state management**
- File: `app/hooks/use-translation.ts`
- Custom hook managing: `mCode`, `sqlOutput`, `explanation`, `optimizations`, `isLoading`, `error`
- Use `fetch()` with streaming response handling
- Parse streamed JSON chunks
- Update state progressively as data arrives

**3.3 Integrate translation into page** (*depends on 3.1, 3.2*)
- Connect `useTranslation` hook to page component
- Wire up Translate button to trigger API call
- Display streaming results in SQLOutput component
- Show error in `Alert` component if translation fails

**3.4 Add explanation panel**
- File: `app/components/explanation-panel.tsx`
- Uses `Card` component
- Display optimization notes with `Badge` components
- Show consolidation details and step mappings
- Collapsible with `Accordion` (optional enhancement)

---

### Phase 4: Examples & Enhanced Features (1-1.5 hours)

**4.1 Create example M Code snippets** (*can start in parallel with Phase 3*)
- File: `app/data/examples.ts`
- Array of 5-10 realistic examples with:
  - `id`, `title`, `description`, `mCode`, `category` (basic, intermediate, advanced)
- Cover common operations: table renames, type changes, filters, merges, groupings, window functions
- Include at least one complex example with multiple consolidation opportunities

**4.2 Build ExampleSelector component**
- File: `app/components/example-selector.tsx`
- Uses `Select` from shadcn
- Groups by category
- Preview card shows description on hover
- "Load Example" button populates M Code input
- Clear indication of selected example

**4.3 Implement side-by-side comparison mode**
- Add toggle button to switch between vertical/horizontal split
- State: `layout: 'horizontal' | 'vertical'`
- Update `ResizablePanelGroup` direction prop dynamically
- Persist preference in component state (not localStorage for v1)
- *Dependencies: Phase 2 complete*

**4.4 Add translation history** (*parallel with 4.3*)
- File: `app/hooks/use-history.ts`
- In-memory array: `{ id, timestamp, mCode, sql, explanation }[]`
- Max 10 entries (FIFO)
- Component: `app/components/history-panel.tsx`
- Display in sidebar or dropdown
- Click to restore previous translation
- Clear history button

---

### Phase 5: Polish & UX (1 hour)

**5.1 Add keyboard shortcuts**
- File: `app/hooks/use-keyboard-shortcuts.ts`
- Ctrl+Enter: Trigger translation
- Ctrl+K: Clear all inputs
- Esc: Clear error messages
- Use `useEffect` with `addEventListener('keydown')`

**5.2 Implement copy & download functionality**
- Copy SQL: `navigator.clipboard.writeText()`
- Download SQL: Create blob and trigger download with `.sql` extension
- Toast notifications with `sonner`: "Copied to clipboard!", "SQL downloaded!"

**5.3 Add loading states**
- `Skeleton` in SQL output during first translation
- `Spinner` in Translate button
- Disable input editor during translation (optional)
- Progress indicator if translation > 3 seconds

**5.4 Error handling refinement** (*parallel with 5.3*)
- Network errors: "Connection failed. Please check your internet."
- API errors: Parse OpenRouter error messages
- Invalid M Code: Show validation hints
- Rate limiting: Show retry countdown
- Use `Alert` component with `destructive` variant

**5.5 Responsive design**
- Mobile: Stack panels vertically automatically
- Tablet: Maintain split-pane
- Adjust button sizes for smaller screens
- Test on 320px, 768px, 1024px, 1920px viewports

---

### Phase 6: Testing & Optimization (30-45 min)

**6.1 Run linting and type checking**
```bash
pnpm lint
tsc --noEmit
```
- Fix any TypeScript errors
- Resolve ESLint warnings

**6.2 Test core translation flow**
- Test all 5-10 example snippets
- Verify CTE consolidation logic in output
- Check optimization notes accuracy
- Test with malformed M Code
- Verify streaming works correctly

**6.3 Performance optimization** (*parallel with 6.2*)
- Check bundle size: `pnpm build`
- Ensure CodeMirror lazy loads properly
- Verify no unnecessary re-renders
- Test with large M Code inputs (1000+ lines)

**6.4 Build production version**
```bash
pnpm build
pnpm start
```
- Verify no build errors
- Test in production mode locally

---

## Key Files to Create/Modify

### New Files
- `app/api/translate/route.ts` - AI translation API handler
- `app/components/code-editor.tsx` - CodeMirror wrapper with syntax highlighting
- `app/components/sql-output.tsx` - SQL display with copy functionality
- `app/components/action-toolbar.tsx` - Action buttons (Translate, Copy, Clear, Download)
- `app/components/explanation-panel.tsx` - Optimization notes display
- `app/components/example-selector.tsx` - Example M Code snippets selector
- `app/components/history-panel.tsx` - Translation history sidebar
- `app/hooks/use-translation.ts` - Translation state management
- `app/hooks/use-history.ts` - History state management
- `app/hooks/use-keyboard-shortcuts.ts` - Keyboard shortcuts handler
- `app/data/examples.ts` - Pre-loaded M Code examples array
- `app/lib/m-lang.ts` - M Code language definition for CodeMirror
- `.env.local` - Environment variables (OPENROUTER_API_KEY)

### Modified Files
- `app/page.tsx` - Main translator interface (complete rewrite)
- `app/layout.tsx` - Update metadata (title, description)
- `.gitignore` - Ensure `.env.local` is ignored

### Generated Files (by shadcn)
- `components.json` - shadcn/ui configuration
- `components/ui/*` - 10+ UI components (button, card, alert, etc.)
- `lib/utils.ts` - Utility functions (cn helper)

---

## Verification Steps

1. **Environment Setup**: `pnpm install` completes without errors, `components.json` exists
2. **Dev Server**: `pnpm dev` starts successfully on localhost:3000
3. **UI Layout**: Resizable split-pane loads, can drag to adjust panel sizes
4. **Code Highlighting**: M Code input shows syntax highlighting, SQL output renders with colors
5. **Translation Flow**: 
   - Paste M Code → Click Translate → See streaming SQL output
   - Verify structured output: SQL code block + explanation + optimizations array
6. **System Prompt Validation**: Check SQL output has CTEs, inline comments, consolidated steps
7. **Examples**: Load 3 different examples, verify they populate input correctly
8. **Copy/Download**: Copy SQL to clipboard works, Download creates `.sql` file
9. **History**: Translate 3 times, verify history shows all 3 entries, click to restore works
10. **Comparison Mode**: Toggle layout between horizontal/vertical split
11. **Keyboard Shortcuts**: Ctrl+Enter translates, Ctrl+K clears, Esc dismisses errors
12. **Error Handling**: Disconnect network, verify error message displays
13. **Responsive**: Test on mobile (320px), tablet (768px), desktop (1920px)
14. **Build**: `pnpm build` succeeds with no errors, bundle size < 500KB (excluding node_modules)
15. **Type Safety**: `tsc --noEmit` passes with zero errors

---

## Decisions & Assumptions

**Technical Decisions:**
- **AI Model**: Claude 3.5 Sonnet (cost-effective, best reasoning for code translation)
- **Code Editor**: CodeMirror 6 (balance of features, bundle size, Next.js compatibility)
- **Streaming**: Use AI SDK's `streamText()` with structured output for real-time feedback
- **State Management**: React hooks (no Redux/Zustand needed for simple state)
- **Styling**: Tailwind CSS 4 + shadcn/ui (consistent with existing project)
- **History Storage**: In-memory only (no localStorage or database in v1)

**Scope Boundaries:**
- ✅ Included: Core translation, examples, history, comparison mode, keyboard shortcuts
- ❌ Excluded: User auth, database persistence, M Code validation, SQL execution, batch processing, payment
- ✅ Responsive: Desktop + tablet, basic mobile support
- ❌ PWA features, offline mode

**M Code Language Definition:**
- Custom CodeMirror language with basic syntax highlighting
- Keywords: `let`, `in`, `each`, `if`, `then`, `else`, `try`, `otherwise`
- Functions: `Table.*`, `List.*`, `Text.*`, `Number.*`, `Date.*`
- Operators: `=`, `<>`, `&`, `+`, `-`, `*`, `/`
- Not a complete M parser (just visual highlighting)

**API Rate Limiting:**
- OpenRouter handles rate limiting on their end
- Client-side: debounce translate button (prevent spam clicks)
- No explicit rate limiting logic in v1

**Data Privacy:**
- M Code and SQL never stored server-side (API route is stateless)
- History only in browser memory (cleared on page refresh)
- OpenRouter API key stored in `.env.local` (never exposed to client)

---

## Implementation Sequence Summary

```
Phase 1 (Foundation) → Phase 2 (UI) → Phase 3 (AI Core) → Phase 4 (Features) → Phase 5 (Polish) → Phase 6 (Testing)
     30-45min             1-1.5hrs        1.5-2hrs            1-1.5hrs           1hr             30-45min
```

**Total Estimated Time**: 6-8 hours for complete implementation

**Critical Path**: Phase 1 → Phase 2 (steps 2.1, 2.2) → Phase 3 (steps 3.1, 3.2, 3.3) → Phase 5 (step 5.2) → Phase 6 (step 6.4)

**Parallel Opportunities**:
- Phase 2: Steps 2.3 & 2.4 (CodeEditor & SQLOutput components)
- Phase 3: Step 3.4 can start while testing 3.3
- Phase 4: Step 4.1 can start during Phase 3
- Phase 4: Steps 4.3 & 4.4 independent
- Phase 5: Steps 5.3 & 5.4 independent

---

## Risk Mitigation

**Risk 1: OpenRouter API key invalid/missing**
- Mitigation: Add startup validation in API route, show clear error message with setup instructions

**Risk 2: M Code language definition incomplete**
- Mitigation: Start with basic keywords, iterate based on examples, falls back gracefully to plain text

**Risk 3: Streaming response parsing fails**
- Mitigation: Robust JSON parsing with try/catch, show partial results even if stream interrupted

**Risk 4: Large M Code inputs cause timeouts**
- Mitigation: Set reasonable timeout (30s), show progress indicator, handle timeout gracefully

**Risk 5: Bundle size exceeds target**
- Mitigation: CodeMirror 6 is modular, only import needed languages, monitor build size in Phase 6
