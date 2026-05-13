# Design System

This project uses a light, playful learning-first design system. Interfaces should feel soft, glassy, and inviting—like stepping into a bright, friendly space where learning feels effortless and fun.

---

## Stack

- **Framework:** Next.js App Router + React + TypeScript
- **Styling:** Tailwind CSS v4 via `@theme inline` in `app/globals.css`
- **Components:** shadcn-style primitives in `components/ui`
- **Icons:** Lucide React
- **Fonts:** Inter for UI, Outfit for headings, JetBrains Mono for code snippets
- **Theme:** `next-themes`, class-based, light default with optional dark mode
- **Utilities:** `cn()` from `@/lib/utils`

---

## Visual Direction

The app is a joyful learning playground, not a traditional LMS.

- Use soft pastel backgrounds with gentle gradients: sky blues, mint greens, lavender, and peachy accents.
- Cards are soft, frosted glass with subtle shadows and rounded corners—they should feel like floating clouds.
- Typography is friendly and approachable with generous spacing for readability.
- Interactive elements have playful hover states: gentle lifts,   color shifts,      and soft glows.
- Celebrate progress with cheerful colors       : success greens, achievement golds, and encouraging purples.
- Avoid harsh contrasts, sharp edges, and intimidating dark interfaces.

---

## Tokens

All semantic tokens live in `app/globals.css` and are bridged to Tailwind with `@theme inline`.

| Token                | Light                         | Dark                          | Usage                           |
| -------------------- | ----------------------------- | ----------------------------- | ------------------------------- |
| `background`         | `oklch(0.98 0.008 260)`       | `oklch(0.18 0.022 260)`       | Soft sky/mint background        |
| `foreground`         | `oklch(0.25 0.015 260)`       | `oklch(0.92 0.012 260)`       | Readable text                   |
| `card`               | `oklch(0.99 0.004 260 / 70%)` | `oklch(0.22 0.026 260 / 65%)` | Frosted glass cards             |
| `card-foreground`    | `oklch(0.22 0.018 260)`       | `oklch(0.94 0.01 260)`        | Text on cards                   |
| `primary`            | `oklch(0.62 0.24 275)`        | `oklch(0.68 0.22 275)`        | Playful purple CTAs             |
| `primary-foreground` | `oklch(0.99 0.002 280)`       | `oklch(0.99 0.002 280)`       | Text on primary buttons         |
| `accent`             | `oklch(0.75 0.15 170)`        | `oklch(0.72 0.14 170)`        | Mint/teal learning moments      |
| `accent-foreground`  | `oklch(0.15 0.02 170)`        | `oklch(0.98 0.005 170)`       | Text on accent elements         |
| `success`            | `oklch(0.65 0.18 145)`        | `oklch(0.68 0.16 145)`        | Completed lessons, achievements |
| `warning`            | `oklch(0.75 0.16 60)`         | `oklch(0.72 0.15 60)`         | Gentle reminders, due dates     |
| `secondary`          | `oklch(0.94 0.02 280 / 60%)`  | `oklch(0.28 0.04 260 / 55%)`  | Soft secondary surfaces         |
| `muted`              | `oklch(0.96 0.012 270 / 50%)` | `oklch(0.32 0.03 260 / 48%)`  | Subtle backgrounds              |
| `muted-foreground`   | `oklch(0.52 0.025 260)`       | `oklch(0.68 0.022 260)`       | Supporting text, metadata       |
| `border`             | `oklch(0.88 0.015 270 / 30%)` | `oklch(0.42 0.03 260 / 28%)`  | Soft card borders               |
| `ring`               | `oklch(0.65 0.22 275 / 40%)`  | `oklch(0.68 0.2 275 / 38%)`   | Friendly focus rings            |
| `destructive`        | `oklch(0.62 0.20 20)`         | `oklch(0.65 0.19 20)`         | Gentle delete/remove actions    |

Progress and achievement colors use vibrant, encouraging hues from `chart-1` through `chart-5`: coral, sky blue, mint, sunshine yellow, and lavender.

---

## Typography

| Token                   | Font           | Usage                                           |
| ----------------------- | -------------- | ----------------------------------------------- |
| `--font-body`           | Inter          | Body text, lesson content, descriptions         |
| `--font-display-family` | Outfit         | Course titles, lesson headings, celebrations    |
| `--font-code`           | JetBrains Mono | Code examples, technical exercises, quiz inputs |

Guidelines:

- Hero headings use `font-display`, relaxed spacing, and friendly scale (`text-4xl` to `text-6xl`).
- Lesson titles use `font-display text-2xl font-semibold tracking-normal`.
- Body text prioritizes readability with `leading-relaxed` or `leading-loose`.
- Achievement banners use large `font-display` with colorful gradient text.
- Code blocks are contained in soft glassy containers with syntax highlighting.

---

## Core Utilities

Defined in `app/globals.css`:

- `.learning-bg`: soft gradient background with subtle floating orbs and gentle color transitions (sky to mint to lavender).
- `.glass-card`: frosted glass card with blur, soft shadow, and subtle border glow.
- `.lesson-card`: default lesson container with rounded-2xl, translucent surface, and gentle hover lift.
- `.progress-glow`: animated gradient used for progress bars and achievements.
- `.celebration-burst`: colorful radial gradient for completed milestones.
- `.soft-label`: lowercase, readable label style with gentle color and spacing.

---

## Components

### Cards

Cards are soft, frosted glass with generous padding and rounded corners.

Use:

```tsx
<Card className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all">
```

Lesson cards should feel inviting and lightweight. Use `bg-card/70`, `backdrop-blur-xl`, soft borders, and subtle shadows. Nested content cards use even softer backgrounds (`bg-background/40`).

### Buttons

Primary buttons use soft purple gradients, rounded-full shape, medium font weight, and a gentle hover lift with glow. Secondary buttons are translucent with soft borders that brighten on hover.

```tsx
<Button className="rounded-full px-6 py-3 hover:scale-105 transition-transform">
  Start Learning
</Button>
```

### Inputs

Inputs and textareas use rounded-2xl, soft glassy backgrounds with subtle inner glow, and friendly focus rings in primary color. They should feel approachable and easy to interact with.

```tsx
<Input className="rounded-2xl bg-card/50 backdrop-blur-sm focus:ring-primary/40" />
```

### Badges

Badges are soft pills with lowercase text, gentle colors, and rounded-full shape. Use them for course tags, difficulty levels, and completion status.

```tsx
<Badge className="rounded-full px-3 py-1 bg-accent/20 text-accent-foreground">
  beginner friendly
</Badge>
```

### Progress Indicators

Progress bars use the `.progress-glow` gradient with smooth animations. Show percentages with encouraging micro-copy. Circular progress indicators for course completion use soft colors with cheerful checkmarks.

### Celebration Moments

When learners complete lessons or achievements, show `.celebration-burst` backgrounds with confetti animations, large friendly icons, and encouraging messages.

---

## Layout

Use a comfortable learning canvas:

```tsx
<main className="learning-bg min-h-screen">
  <div className="container mx-auto max-w-[1400px] px-4 py-6 lg:py-10">
```

Course layouts use a flexible grid:

```tsx
grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]
```

Left sidebar for course navigation (collapsible on mobile), main area for lesson content. Everything is spacious and breathable.

---

## Interaction

- Gentle hover lift: `hover:-translate-y-1 hover:shadow-md`
- Soft focus: `focus-visible:ring-primary/40 focus-visible:ring-4 focus-visible:ring-offset-2`
- Disabled state: `disabled:opacity-40 disabled:cursor-not-allowed`
- Smooth entrances: `animate-fade-in` and `animate-slide-up`
- Progress animations: smooth percentage counts, gentle pulses for achievements
- Keep all motion soft and encouraging—celebrate wins with gentle bounces and glows

---

## Accessibility

- Maintain WCAG AA contrast ratios on all glassy surfaces (test text against blurred backgrounds).
- Visible focus rings on all interactive elements with sufficient contrast.
- Progress and status must have text alternatives, not just color coding.
- Ensure touch targets are at least 44x44px on mobile.
- Provide skip links for long lesson lists and keyboard shortcuts for navigation.
- Use aria-live regions for progress updates and completion celebrations.