# M2SQL - Power Query to SQL Translator

A production-ready Next.js application that translates Power Query (M) code into optimized Microsoft SQL Server T-SQL queries using Claude 3.5 Sonnet AI via OpenRouter.

## Features

- 🚀 **Real-time AI Translation**: Convert M Code to T-SQL instantly
- 📝 **Split-Pane Editor**: CodeMirror-powered editors with syntax highlighting
- 🎯 **Optimized Output**: Consolidates simple steps, uses CTEs and window functions
- 📚 **Example Library**: 8 pre-loaded examples (basic to advanced)
- ⌨️ **Keyboard Shortcuts**: Ctrl+Enter to translate, Ctrl+K to clear
- 🔄 **Layout Toggle**: Switch between horizontal and vertical split view
- 📋 **Export Options**: Copy to clipboard or download as .sql file
- 💡 **Explanation Panel**: Shows optimization notes and techniques applied

## Tech Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Code Editor**: CodeMirror 6
- **AI**: Vercel AI SDK + OpenRouter (Claude 3.5 Sonnet)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd m2sql
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Translation

1. **Load an Example** (optional): Select from the dropdown in the left panel
2. **Paste M Code**: Enter your Power Query code in the left editor
3. **Translate**: Click the "Translate" button or press `Ctrl+Enter`
4. **View Results**: SQL output appears in the right panel with explanations

### Keyboard Shortcuts

- `Ctrl+Enter` (or `Cmd+Enter` on Mac): Trigger translation
- `Ctrl+K` (or `Cmd+K` on Mac): Clear all inputs
- `Esc`: Dismiss error messages

### Layout Options

Click the **Vertical/Horizontal** button in the header to toggle between:
- **Horizontal**: Side-by-side editors (default)
- **Vertical**: Stacked editors

### Export Options

- **Copy SQL**: Click the copy button or use the toolbar
- **Download SQL**: Save the translated query as a `.sql` file

## Translation Features

The AI translator applies these optimizations:

### CTE Architecture
- Uses Common Table Expressions to represent transformation flow
- Maps M Code steps to logical SQL CTEs

### Optimization & Consolidation
- **Consolidates simple steps** (renames, type changes, filters) into single CTEs
- **Preserves complex operations** (merges, groups, window functions) in separate CTEs

### T-SQL Best Practices
- Explicit column names
- Appropriate data types
- `TRY_CAST` for data integrity
- Window functions instead of self-joins

### Documentation
- Inline comments mapping M steps to SQL transformations
- Optimization notes explaining consolidation decisions

## Project Structure

```
m2sql/
├── app/
│   ├── api/translate/        # AI translation API route
│   ├── components/           # React components
│   │   ├── code-editor.tsx
│   │   ├── sql-output.tsx
│   │   ├── action-toolbar.tsx
│   │   ├── explanation-panel.tsx
│   │   └── example-selector.tsx
│   ├── data/                 # Example M Code snippets
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities (M language definition)
│   └── page.tsx              # Main application page
├── components/ui/            # shadcn/ui components
└── .env.local               # Environment variables (not committed)
```

## Development

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

### Build
```bash
npm run build
```

### Production Server
```bash
npm start
```

## Troubleshooting

### API Key Issues
- Ensure `.env.local` exists with valid `OPENROUTER_API_KEY`
- Restart dev server after adding environment variables

### Translation Errors
- Check network connection
- Verify API key has sufficient credits
- Try with a shorter M Code snippet first

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## License

This project is built with Next.js and uses various open-source libraries. Check individual package licenses for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [CodeMirror 6](https://codemirror.net/docs/)

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add `OPENROUTER_API_KEY` to environment variables
4. Deploy!

---

Built with ❤️ using Next.js, TypeScript, and Claude AI
