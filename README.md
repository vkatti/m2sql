# M2SQL - Power Query to SQL Translator

A production-ready Next.js application that translates Power Query (M) code into optimized Microsoft SQL Server T-SQL queries using Claude 3.5 Sonnet AI via OpenRouter.

**Note**: This application requires authentication. Users must create an account and sign in before accessing the translator.

## Features

- � **Secure Authentication**: Email/password and OAuth (Google, GitHub) via Supabase
- �🚀 **Real-time AI Translation**: Convert M Code to T-SQL instantly
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
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Code Editor**: CodeMirror 6
- **AI**: Vercel AI SDK + OpenRouter (Claude 3.5 Sonnet)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account ([Create one here](https://supabase.com))
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
   # OpenRouter API Key
   OPENROUTER_API_KEY=your_api_key_here
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # App Configuration
6. **Create your first account**
   
   Navigate to [http://localhost:3000](http://localhost:3000), which will redirect you to the login page. Click "Sign up" to create a new account.

## Usage

### Authentication

1. **Sign Up**: Create an account with email/password or use OAuth (Google/GitHub)
2. **Email Verification**: Check your email for a verification link (required before login)
3. **Sign In**: Use your credentials to access the translator
4. **Remember Me**: Check this option to stay logged in across browser sessions
   a. **Create a Supabase project**:
      - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
      - Click "New Project"
      - Fill in project details and create
   
   b. **Get your credentials**:
      - Go to Project Settings > API
      - Copy the "Project URL" to `NEXT_PUBLIC_SUPABASE_URL`
      - Copy the "anon/public" key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   
   c. **Configure Email Authentication**:
      - Go to Authentication > Providers
      - Enable "Email" provider
      - Configure email templates (optional)
   
   d. **Configure OAuth Providers** (optional):
      
      **Google OAuth**:
      - Go to [Google Cloud Console](https://console.cloud.google.com/)
      - Create OAuth 2.0 credentials
      - Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
      - Copy Client ID and Secret to Supabase Dashboard > Authentication > Providers > Google
      
      **GitHub OAuth**:
      - Go to GitHub Settings > Developer settings > OAuth Apps
      - Create new OAuth App
      - Add Authorization callback URL: `https://[your-project-ref].supabase.co/auth/v1/callback`
      - Copy Client ID and Secret to Supabase Dashboard > Authentication > Providers > GitHub
   
   e. **Configure Email Settings**:
      - Go to Authentication > Email Templates
      - Customize confirmation and password reset emails (optional)

5
4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Translation
 (protected)
│   ├── auth/                 # Authentication pages
│   │   ├── login/            # Login page
│   │   ├── signup/           # Registration page
│   │   ├── forgot-password/  # Password reset request
│   │   ├── reset-password/   # Password reset form
│   │   ├── verify-email/     # Email verification page
│   │   ├── callback/         # OAuth callback handler
│   │   └── components/       # Auth UI components
│   ├── components/           # React components
│   │   ├── code-editor.tsx
│   │   ├── sql-output.tsx
│   │   ├── action-toolbar.tsx
│   │   ├── explanation-panel.tsx
│   │   └── example-selector.tsx
│   ├── data/                 # Example M Code snippets
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities (M language definition)
│   ├── providers.tsx         # Auth context provider
│   └── page.tsx              # Main application page (protected)
├── components/ui/            # shadcn/ui components
├── lib/supabase/             # Supabase client utilities
│   ├── client.ts             # Client-side Supabase client
│   ├── server.ts             # Server-side Supabase client
│   └── middleware.ts         # Session refresh helper
├── middleware.ts             # Next.js middleware (route protection)
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
