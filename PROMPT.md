# M2SQL: Power Query to SQL Translator

## Project Overview
Build a lightweight, production-ready web application that translates Power Query (M) code into optimized Microsoft SQL Server (T-SQL) queries using AI.

## Core Functionality

### AI Translation Agent Role
The AI translator acts as a **Senior Data Engineer and MS SQL Server specialist** with expertise in translating Power Query logic into highly optimized, production-ready T-SQL.

### Translation Requirements

#### 1. CTE Architecture
- Use Common Table Expressions (CTEs) to represent the transformation flow
- Each CTE should map to logical transformation steps in the M code

#### 2. Window Functions
- Utilize SQL Window Functions (e.g., `ROW_NUMBER()`, `RANK()`, `SUM(...) OVER(...)`)
- Use for grouping, indexing, or running totals to avoid inefficient self-joins

#### 3. T-SQL Best Practices
- Use explicit column names
- Apply appropriate data types
- Use `TRY_CAST` where data integrity might be an issue

#### 4. Optimization & Consolidation (Critical)
- **Club Simple Steps**: Do not create a new CTE for every single line of M code
- Consolidate sequential "low-value" transformations into a single CTE block:
  - Column renames (`Table.RenameColumns`)
  - Type changes (`Table.TransformColumnTypes`)
  - Simple filters (`Table.SelectRows`)
- **Preserve Complexity**: Keep complex steps in their own distinct CTEs:
  - Merges
  - Groupings
  - Window Function logic

#### 5. Mapping & Documentation
- Include inline comments that map original M code step names to SQL transformations
- If multiple M steps were consolidated into one CTE, list all mapped M steps in the comment header
- Example: `-- Mapping M Steps: #"Renamed Columns", #"Changed Type", #"Filtered Rows"`

#### 6. Output Format
- Provide the final SQL code in a formatted code block
- Include brief explanation of where and why steps were consolidated for optimization
- Display before/after comparison or transformation summary

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI SDK**: Vercel AI SDK with OpenRouter
- **Code Display**: Syntax highlighting for M Code and SQL

## Architecture

### Pages/Routes
1. **`/` (Home)**: Main translator interface
   - Split-pane layout: M Code input | SQL output
   - Action buttons: Translate, Copy, Clear, Download
   - Optional: Example M Code snippets

2. **`/examples`** (Optional): Gallery of M Code → SQL translations
   - Pre-loaded examples with explanations
   - Filter by complexity or operation type

### Core Components
- `CodeEditor`: M Code input with syntax highlighting
- `SQLOutput`: T-SQL output display with copy functionality
- `TranslationPanel`: Controls and action buttons
- `ExplanationCard`: Shows optimization notes and step mapping
- `ExampleSelector`: Dropdown/sidebar for example M Code snippets

### Data Flow
1. User pastes M Code into input editor
2. User clicks "Translate" button
3. App sends M Code to AI SDK with specialized system prompt
4. AI processes according to translation requirements
5. Stream response back to SQL output panel
6. Display optimization notes and step mappings
7. User can copy, edit, or download SQL

### AI Integration
```typescript
// System prompt includes the Senior Data Engineer role + translation requirements
// Use streaming for real-time feedback
// Structure output as: { sql: string, explanation: string, optimizations: string[] }
```

## Implementation Phases

### Phase 1: Foundation
- Set up Next.js project with TypeScript
- Install and configure shadcn/ui components
- Integrate AI SDK with OpenRouter
- Create basic layout and routing

### Phase 2: Core Translation
- Build M Code input editor with syntax highlighting
- Build SQL output display with syntax highlighting
- Implement AI translation with specialized system prompt
- Add streaming support for real-time feedback

### Phase 3: UX Enhancements
- Add example M Code snippets
- Implement copy/download functionality
- Add loading states and error handling
- Create explanation/optimization display

### Phase 4: Polish
- Add responsive design
- Implement keyboard shortcuts
- Add dark mode support
- Performance optimization and testing

## Edge Cases & Considerations
- Handle invalid or incomplete M Code gracefully
- Set reasonable token limits for input/output
- Provide helpful error messages for API failures
- Handle edge cases in M Code syntax that might not translate directly
- Consider rate limiting for API calls
- Handle streaming interruptions or timeouts

## Out of Scope (v1)
- User authentication
- Database persistence
- Payment/subscription model
- M Code validation/linting
- SQL execution or testing
- Multi-file/project translation

## Success Criteria
- Clean, intuitive single-page interface
- Fast translation (< 5 seconds for typical queries)
- High-quality, optimized SQL output
- Clear mapping between M steps and SQL CTEs
- Responsive design that works on desktop and tablet