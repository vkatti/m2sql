# Plan: Add Authentication with Supabase to M2SQL App

**Created**: May 13, 2026  
**Status**: Planning  
**Branch**: `login_module`

---

## Overview

Wrap the M2SQL translator behind a complete authentication system using Supabase. Users must create accounts and login via email/password before accessing the translator. Include password reset, email verification, OAuth providers (Google, GitHub), and remember me functionality. Unauthenticated visitors get redirected to the login page.

---

## User Requirements

- ✅ New Supabase project needs to be created
- ✅ Email/password authentication (required)
- ✅ Password reset / forgot password flow
- ✅ Email verification required before login
- ✅ OAuth providers (Google, GitHub, etc.)
- ✅ Remember me functionality
- ✅ Redirect unauthenticated users to login page

---

## Current State Analysis

### Existing App Structure
- **Zero existing authentication** - clean slate
- **Single public page** at `/` with M2SQL translator
- **One API endpoint** `/api/translate` (unprotected)
- **Tech stack**: Next.js 16 with React 19, TypeScript, shadcn/ui
- **No Supabase packages** installed

### Key Files to Protect
1. `app/page.tsx` - Main translator page (redirect if not authenticated)
2. `app/api/translate/route.ts` - Translation API endpoint (verify session, return 401 if unauthenticated)

---

## Implementation Phases

### Phase 1: Supabase Project Setup
**Type**: User Action Required  
**Dependencies**: None

#### Tasks
1. Create new Supabase project at [supabase.com](https://supabase.com)
2. Enable Email provider in Supabase dashboard:
   - Navigate to Authentication > Providers
   - Enable Email provider
   - Configure email settings
3. Enable OAuth providers:
   - Google: Configure OAuth app in Google Cloud Console, add credentials to Supabase
   - GitHub: Configure OAuth app in GitHub Settings, add credentials to Supabase
4. Configure email templates:
   - Navigate to Authentication > Email Templates
   - Customize "Confirm signup" template
   - Customize "Reset password" template
   - Customize "Magic Link" template (if using)
5. Copy project credentials:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public key

#### Verification
- [ ] Supabase project created successfully
- [ ] Email provider enabled and configured
- [ ] Google OAuth configured with client ID/secret
- [ ] GitHub OAuth configured with client ID/secret
- [ ] Email templates customized
- [ ] Credentials copied and ready

---

### Phase 2: Install Dependencies & Configuration
**Type**: Development  
**Dependencies**: Can run in parallel with Phase 1  
**Priority**: High

#### Tasks

1. **Install Supabase packages**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Create `.env.local`**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # App Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Create Supabase client utilities**

   **File: `lib/supabase/client.ts`**
   - Client-side Supabase client factory
   - Uses browser cookies for session management
   ```typescript
   import { createBrowserClient } from '@supabase/ssr'
   
   export function createClient() {
     return createBrowserClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
   }
   ```

   **File: `lib/supabase/server.ts`**
   - Server-side Supabase client with Next.js cookie handling
   - Supports both Server Components and Route Handlers
   ```typescript
   import { createServerClient } from '@supabase/ssr'
   import { cookies } from 'next/headers'
   
   export async function createClient() {
     const cookieStore = await cookies()
     
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name: string) {
             return cookieStore.get(name)?.value
           },
           set(name: string, value: string, options: CookieOptions) {
             cookieStore.set({ name, value, ...options })
           },
           remove(name: string, options: CookieOptions) {
             cookieStore.set({ name, value: '', ...options })
           },
         },
       }
     )
   }
   ```

   **File: `lib/supabase/middleware.ts`**
   - Middleware helper for session refresh
   ```typescript
   import { createServerClient } from '@supabase/ssr'
   import { NextResponse, type NextRequest } from 'next/server'
   
   export async function updateSession(request: NextRequest) {
     let response = NextResponse.next({
       request: {
         headers: request.headers,
       },
     })
   
     const supabase = createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name: string) {
             return request.cookies.get(name)?.value
           },
           set(name: string, value: string, options: CookieOptions) {
             request.cookies.set({ name, value, ...options })
             response = NextResponse.next({
               request: {
                 headers: request.headers,
               },
             })
             response.cookies.set({ name, value, ...options })
           },
           remove(name: string, options: CookieOptions) {
             request.cookies.set({ name, value: '', ...options })
             response = NextResponse.next({
               request: {
                 headers: request.headers,
               },
             })
             response.cookies.set({ name, value: '', ...options })
           },
         },
       }
     )
   
     await supabase.auth.getUser()
   
     return response
   }
   ```

#### Verification
- [ ] Dependencies installed successfully
- [ ] `.env.local` created with placeholder values
- [ ] `lib/supabase/client.ts` created
- [ ] `lib/supabase/server.ts` created
- [ ] `lib/supabase/middleware.ts` created

---

### Phase 3: Authentication Pages
**Type**: Development  
**Dependencies**: Phase 2  
**Priority**: High

#### Tasks

1. **Create `app/auth/login/page.tsx`**
   - Email/password login form
   - "Remember me" checkbox (controls session persistence)
   - Link to signup page
   - Link to forgot password page
   - OAuth buttons for Google and GitHub
   - Error message display
   - Loading states

2. **Create `app/auth/signup/page.tsx`**
   - Email/password registration form
   - Password confirmation field
   - Terms of service checkbox (optional)
   - Trigger email verification on signup
   - Success message: "Check your email to verify your account"
   - Link back to login page

3. **Create `app/auth/forgot-password/page.tsx`**
   - Single email input field
   - Send password reset email
   - Success message: "Check your email for reset instructions"
   - Link back to login page

4. **Create `app/auth/reset-password/page.tsx`**
   - New password input
   - Confirm password input
   - Extract reset token from URL
   - Update password via Supabase
   - Redirect to login on success

5. **Create `app/auth/verify-email/page.tsx`**
   - Confirmation message after email verification
   - Success state: "Email verified! You can now log in."
   - Error state: "Verification link expired or invalid."
   - Button to redirect to login page

6. **Create `app/auth/callback/route.ts`**
   - Handle OAuth callback from Google/GitHub
   - Handle email confirmation callback
   - Exchange code for session
   - Set session cookies
   - Redirect to main app (`/`)

#### UI Components to Create
- `app/auth/components/auth-form.tsx` - Reusable form wrapper
- `app/auth/components/oauth-buttons.tsx` - Google/GitHub buttons
- `app/auth/components/auth-error.tsx` - Error display component

#### Verification
- [ ] All auth pages created
- [ ] Forms styled with shadcn/ui components
- [ ] Loading and error states implemented
- [ ] OAuth buttons functional
- [ ] Email verification flow configured

---

### Phase 4: Middleware Protection
**Type**: Development  
**Dependencies**: Phase 2  
**Priority**: High

#### Tasks

1. **Create `middleware.ts` at workspace root**
   ```typescript
   import { type NextRequest } from 'next/server'
   import { updateSession } from '@/lib/supabase/middleware'
   
   export async function middleware(request: NextRequest) {
     return await updateSession(request)
   }
   
   export const config = {
     matcher: [
       '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
     ],
   }
   ```

2. **Add route protection logic**
   - Check session for all routes except `/auth/*`
   - Redirect unauthenticated users from `/` to `/auth/login`
   - Redirect authenticated users from `/auth/login` to `/`
   - Refresh session cookies automatically

#### Verification
- [ ] Middleware created
- [ ] Protected routes redirect to login
- [ ] Auth routes redirect to app when logged in
- [ ] Session refresh works automatically

---

### Phase 5: Layout & Context
**Type**: Development  
**Dependencies**: Phase 2  
**Priority**: High

#### Tasks

1. **Create `app/providers.tsx`**
   - Supabase session provider wrapper
   - Make user session available to all client components
   ```typescript
   'use client'
   
   import { createContext, useContext, useEffect, useState } from 'react'
   import { createClient } from '@/lib/supabase/client'
   import type { User } from '@supabase/supabase-js'
   
   type AuthContextType = {
     user: User | null
     loading: boolean
   }
   
   const AuthContext = createContext<AuthContextType>({
     user: null,
     loading: true,
   })
   
   export function Providers({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null)
     const [loading, setLoading] = useState(true)
     const supabase = createClient()
   
     useEffect(() => {
       const {
         data: { subscription },
       } = supabase.auth.onAuthStateChange((_event, session) => {
         setUser(session?.user ?? null)
         setLoading(false)
       })
   
       return () => subscription.unsubscribe()
     }, [supabase])
   
     return (
       <AuthContext.Provider value={{ user, loading }}>
         {children}
       </AuthContext.Provider>
     )
   }
   
   export const useAuth = () => useContext(AuthContext)
   ```

2. **Update `app/layout.tsx`**
   - Wrap children with `<Providers>` component
   - Keep existing Toaster and font configuration

3. **Create `lib/auth/hooks.ts`**
   - `useAuth()` - Access current user and auth state
   - `useSession()` - Access full session object
   - `useSignIn()` - Login helper
   - `useSignUp()` - Signup helper
   - `useSignOut()` - Logout helper

#### Verification
- [ ] `app/providers.tsx` created
- [ ] `app/layout.tsx` updated with providers
- [ ] `lib/auth/hooks.ts` created with all hooks
- [ ] Auth context accessible in components

---

### Phase 6: API Route Protection
**Type**: Development  
**Dependencies**: Phase 2  
**Priority**: High

#### Tasks

1. **Update `app/api/translate/route.ts`**
   - Import `createClient` from `@/lib/supabase/server`
   - Add session verification at the start of POST handler
   - Return 401 Unauthorized if no session
   - Optionally: Log API usage per user for analytics
   
   ```typescript
   import { createClient } from '@/lib/supabase/server'
   
   export async function POST(req: Request) {
     // Verify authentication
     const supabase = await createClient()
     const {
       data: { user },
     } = await supabase.auth.getUser()
   
     if (!user) {
       return new Response('Unauthorized', { status: 401 })
     }
   
     // Continue with existing translation logic...
     const { mCode } = await req.json()
     // ...
   }
   ```

#### Optional Enhancements
- Add rate limiting per user (track in Supabase table)
- Log translation requests with user ID for analytics
- Return user-specific error messages

#### Verification
- [ ] Session verification added to POST handler
- [ ] Returns 401 when unauthenticated
- [ ] Existing translation logic still works
- [ ] Optional: Usage logging implemented

---

### Phase 7: UI Updates
**Type**: Development  
**Dependencies**: Phase 5  
**Priority**: Medium

#### Tasks

1. **Update `app/page.tsx`**
   - Import `useAuth` hook from providers
   - Display logged-in user email/name in header
   - Add logout button
   - Show loading state while auth initializes
   
   ```typescript
   'use client'
   
   import { useAuth } from './providers'
   import { createClient } from '@/lib/supabase/client'
   
   export default function Home() {
     const { user, loading } = useAuth()
     const supabase = createClient()
   
     const handleLogout = async () => {
       await supabase.auth.signOut()
       window.location.href = '/auth/login'
     }
   
     if (loading) {
       return <div>Loading...</div>
     }
   
     return (
       <div>
         <header>
           <span>Logged in as: {user?.email}</span>
           <button onClick={handleLogout}>Logout</button>
         </header>
         {/* Existing translator UI */}
       </div>
     )
   }
   ```

2. **Optional: Create user profile dropdown**
   - Use shadcn/ui DropdownMenu component
   - Show user avatar (from OAuth or initials)
   - Show email
   - Settings link (future)
   - Logout button

3. **Optional: Add usage tracking display**
   - Show number of translations today
   - Show remaining API quota (if implementing limits)

#### Verification
- [ ] User email displayed in header
- [ ] Logout button works
- [ ] Loading state prevents flash of unstyled content
- [ ] Optional: Profile dropdown implemented
- [ ] Optional: Usage stats displayed

---

## File Checklist

### Files to Create

#### Supabase Utilities
- [ ] `lib/supabase/client.ts` - Client-side Supabase client
- [ ] `lib/supabase/server.ts` - Server-side Supabase client with cookies
- [ ] `lib/supabase/middleware.ts` - Middleware helper for session refresh

#### Auth Hooks & Context
- [ ] `lib/auth/hooks.ts` - Custom auth hooks
- [ ] `app/providers.tsx` - Session provider wrapper

#### Middleware
- [ ] `middleware.ts` - Next.js middleware for route protection

#### Auth Pages
- [ ] `app/auth/login/page.tsx` - Login page
- [ ] `app/auth/signup/page.tsx` - Registration page
- [ ] `app/auth/forgot-password/page.tsx` - Password reset request
- [ ] `app/auth/reset-password/page.tsx` - Password reset form
- [ ] `app/auth/verify-email/page.tsx` - Email verification confirmation
- [ ] `app/auth/callback/route.ts` - OAuth and email callback handler

#### Auth Components
- [ ] `app/auth/components/auth-form.tsx` - Reusable form wrapper
- [ ] `app/auth/components/oauth-buttons.tsx` - OAuth provider buttons
- [ ] `app/auth/components/auth-error.tsx` - Error display

#### Configuration
- [ ] `.env.local` - Environment variables for Supabase
- [ ] `.env.example` - Template for environment variables

### Files to Modify

- [ ] `app/layout.tsx` - Wrap with session provider
- [ ] `app/page.tsx` - Add user display and logout button
- [ ] `app/api/translate/route.ts` - Add session verification
- [ ] `package.json` - Add Supabase dependencies

---

## Testing & Verification

### 1. Supabase Setup Verification
- [ ] Supabase project created successfully
- [ ] Email templates configured and tested
- [ ] OAuth providers (Google, GitHub) configured
- [ ] Can send test emails from Supabase dashboard

### 2. Authentication Flow Testing

#### Signup Flow
- [ ] User can register with email/password
- [ ] Verification email is sent
- [ ] Email contains working verification link
- [ ] Clicking link verifies account
- [ ] Can login after verification

#### Login Flow
- [ ] User can login with email/password
- [ ] Invalid credentials show error
- [ ] Unverified email shows verification reminder
- [ ] "Remember me" persists session across browser restarts
- [ ] Session without "remember me" clears on browser close

#### OAuth Flow
- [ ] Google OAuth button redirects to Google
- [ ] Successfully authenticates and redirects back
- [ ] GitHub OAuth button redirects to GitHub
- [ ] Successfully authenticates and redirects back
- [ ] User profile data populated from OAuth provider

#### Password Reset Flow
- [ ] User can request password reset
- [ ] Reset email is sent
- [ ] Email contains working reset link
- [ ] Can set new password via link
- [ ] Old password no longer works
- [ ] New password works for login
- [ ] Expired reset links show error

#### Logout Flow
- [ ] Logout button clears session
- [ ] Redirects to login page
- [ ] Cannot access protected routes after logout

### 3. Route Protection Testing
- [ ] Accessing `/` without login redirects to `/auth/login`
- [ ] Accessing `/auth/login` while logged in redirects to `/`
- [ ] Accessing `/auth/signup` while logged in redirects to `/`
- [ ] Can access `/auth/forgot-password` when not logged in
- [ ] Middleware doesn't block static assets

### 4. API Protection Testing
- [ ] `/api/translate` returns 401 without session
- [ ] `/api/translate` works with valid session
- [ ] Session token is properly validated
- [ ] Expired sessions return 401

### 5. Error Handling Testing
- [ ] Invalid credentials show user-friendly error
- [ ] Network errors show appropriate message
- [ ] Expired password reset links show error
- [ ] Invalid email format prevented on client
- [ ] Password strength requirements enforced (if configured)
- [ ] OAuth errors handled gracefully

### 6. Production Readiness
- [ ] No auth credentials hardcoded in code
- [ ] All env vars in `.env.local` (not committed to git)
- [ ] `.env.example` provided for team setup
- [ ] Session tokens use secure, httpOnly cookies
- [ ] PKCE flow enabled for OAuth (default in Supabase)
- [ ] CORS configured properly for production domain
- [ ] Rate limiting considered (optional for MVP)

---

## Technical Decisions

### Authentication Provider
**Choice**: Supabase Auth  
**Rationale**: 
- Built-in user management and secure password hashing (bcrypt)
- OAuth support for Google, GitHub, and 10+ providers
- Email verification and password reset flows included
- Row-level security for database access
- Active development and strong community

### Session Management
**Choice**: Cookie-based sessions via `@supabase/ssr`  
**Rationale**: 
- Next.js 14+ compatible with Server Components
- Automatic session refresh
- Secure httpOnly cookies
- Works with both client and server components

### Route Protection
**Choice**: Next.js middleware  
**Rationale**: 
- Checks authentication before page loads
- Prevents flash of protected content
- Centralized auth logic
- Minimal performance impact

### Password Storage
**Choice**: Supabase-managed (bcrypt)  
**Rationale**: 
- Industry-standard bcrypt with proper salting
- Managed by Supabase, no custom implementation needed
- Automatic security updates
- Compliant with security best practices

### OAuth Providers
**Choice**: Google and GitHub  
**Rationale**: 
- Most requested by users
- Easy to configure in Supabase
- Can add more providers later (Twitter, Apple, etc.)

### Remember Me
**Choice**: Supabase session `persistent` option  
**Rationale**: 
- Built-in support in Supabase
- Secure implementation
- User-controlled via checkbox

### Email Verification
**Choice**: Required before login  
**Rationale**: 
- Prevents spam signups
- Verifies email deliverability
- Can be enforced in Supabase settings
- Industry best practice

---

## Further Considerations

### 1. Rate Limiting
**Question**: Should authenticated API usage be rate-limited per user?

**Option A**: No limits for now
- Pros: Simpler MVP, faster to market
- Cons: Potential abuse, higher costs

**Option B**: Track usage in Supabase table, implement daily/hourly limits
- Pros: Prevents abuse, controls costs, fairer to all users
- Cons: More complex, requires usage tracking table and middleware

**Recommendation**: Option A for MVP, add limits later if needed

### 2. User Profile Management
**Question**: Should users be able to edit profile (name, avatar, change password)?

**Option A**: Not in initial release
- Pros: Faster MVP, less code to maintain
- Cons: Less user control, support burden for password changes

**Option B**: Add profile page with edit capabilities
- Pros: Better UX, self-service password changes
- Cons: More development time, additional testing

**Recommendation**: Option B if time permits (nice-to-have for launch)

### 3. Admin Panel
**Question**: Do you need an admin interface to manage users?

**Option A**: Use Supabase dashboard only
- Pros: Zero development time, fully functional
- Cons: Requires sharing Supabase credentials

**Option B**: Build custom admin UI
- Pros: Granular permissions, better UX
- Cons: Significant development time, security considerations

**Recommendation**: Option A for now (Supabase dashboard is sufficient)

### 4. Email Customization
**Question**: Should email templates match app branding?

**Current**: Default Supabase email templates  
**Enhancement**: Custom HTML templates with app logo and colors

**Recommendation**: Customize during Phase 1 (quick win, professional appearance)

### 5. Multi-Factor Authentication (MFA)
**Question**: Should MFA be supported?

**Current Scope**: Not included  
**Future Enhancement**: Supabase supports TOTP-based MFA

**Recommendation**: Add in future release if security requirements increase

---

## Success Criteria

### MVP Launch Criteria
- [ ] Users can signup, verify email, and login
- [ ] Users can reset forgotten passwords
- [ ] OAuth login works for Google and GitHub
- [ ] Main translator page requires authentication
- [ ] API endpoint verifies user session
- [ ] Logout clears session properly
- [ ] All auth flows tested and working

### Post-Launch Enhancements
- User profile management page
- Usage tracking and limits
- Custom email templates
- Admin dashboard
- Multi-factor authentication
- Session management (view/revoke active sessions)

---

## Implementation Notes

### Development Flow
1. Start with Phase 1 (Supabase setup) - user action
2. Run Phase 2 (dependencies) in parallel
3. Phase 3-7 can be tackled incrementally
4. Test each phase before moving to next
5. Use subagents for parallel implementation

### Git Strategy
- Branch: `login_module` (already created)
- Commit frequently with descriptive messages
- Test thoroughly before merging to main

### Environment Setup
1. Never commit `.env.local` to git
2. Add `.env.example` for team members
3. Document Supabase setup steps in README
4. Include screenshots for OAuth configuration

---

## Resources

### Documentation
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/server-side-rendering)
- [Next.js Authentication Patterns](https://nextjs.org/docs/app/guides/authentication)

### Example Repositories
- [Supabase Next.js Starter](https://github.com/vercel/next.js/tree/canary/examples/with-supabase)
- [Next.js Auth Example](https://github.com/supabase/examples/tree/main/auth/nextjs)

---

**Status**: Ready for implementation  
**Next Step**: Create Supabase project and configure authentication providers
