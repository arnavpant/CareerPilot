# CareerPilot Frontend Design Reference

## Overview
This document provides a comprehensive reference for the CareerPilot frontend design, based on the v0-generated prototype. This serves as the definitive guide for implementing the production version of the application.

---

## 🎨 Design Philosophy

### Core Aesthetic
- **Glassmorphism Design Language**: Modern, premium feel with frosted glass effects
- **Dark Theme**: Dark gradient background with light glass overlays
- **Vibrant Gradients**: Blue-to-purple gradients for primary actions and highlights
- **Smooth Animations**: Framer Motion for page transitions and micro-interactions
- **Modern Typography**: Inter font family, clean hierarchy

### Visual Principles
1. **Clarity over density**: Spacious layouts, generous padding
2. **Depth through layers**: Glass panels create visual hierarchy
3. **Subtle motion**: Smooth transitions, no jarring movements
4. **Consistent rounding**: Large border radii (12px-20px) throughout
5. **Color as meaning**: Stage-specific colors, semantic status indicators

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 14.1.0**: App Router (not Pages Router)
- **React 18.2.0**: Latest stable with hooks
- **TypeScript 5**: Full type safety

### UI & Styling
- **Tailwind CSS 3.4.17**: Utility-first styling
- **Shadcn/ui**: "New York" style variant
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Framer Motion 11.0.3**: Animation library
- **class-variance-authority**: Component variant management
- **tailwind-merge + clsx**: Dynamic className composition

### Data & Forms
- **React Hook Form 7.50.1**: Form management
- **Zod 3.22.4**: Schema validation
- **@hookform/resolvers**: Zod integration
- **TanStack Table 8.11.6**: Powerful table component
- **@hello-pangea/dnd 16.6.0**: Drag-and-drop for Kanban

### Charts & Visualization
- **Recharts 2.12.0**: Analytics charts
- **React Big Calendar 1.11.1**: Calendar view

### Other Libraries
- **date-fns 3.3.1**: Date manipulation
- **Sonner 1.4.0**: Toast notifications

---

## 🎨 Design System

### Color Palette

#### Background & Base
```css
/* Main background: Dark gradient */
background: linear-gradient(135deg, #0F172A → #1E293B → #312E81);
/* Dark slate to indigo gradient */
```

#### Glass System Colors
```css
--glass-bg: rgb(255 255 255 / 0.08);
--glass-gradient: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04));
--border-outer: rgba(255, 255, 255, 0.18);
--border-inner: rgba(0, 0, 0, 0.2);
```

#### Brand Colors
```css
--color-primary: #3b82f6;          /* Blue-500 */
--color-primary-dark: #2563eb;     /* Blue-600 */
--color-success: #10b981;          /* Emerald-500 */
--color-warning: #f59e0b;          /* Amber-500 */
--color-danger: #ef4444;           /* Red-500 */
```

#### Stage Colors
```css
--stage-discovered: 226 232 240;   /* Slate-200 */
--stage-applied: 59 130 246;       /* Blue-500 */
--stage-phone: 99 102 241;         /* Indigo-500 */
--stage-tech: 168 85 247;          /* Purple-500 */
--stage-onsite: 139 92 246;        /* Violet-500 */
--stage-offer: 251 191 36;         /* Amber-400 */
--stage-accepted: 34 197 94;       /* Green-500 */
--stage-rejected: 239 68 68;       /* Red-500 */
```

#### Text Colors
```css
--color-text-primary: #1f2937;     /* Gray-800 (on light surfaces) */
--color-text-secondary: #6b7280;   /* Gray-500 */
--color-text-muted: #9ca3af;       /* Gray-400 */
/* On dark background: white/slate-200 */
```

### Typography

#### Font Family
```css
font-family: Inter, system-ui, -apple-system, sans-serif;
```

#### Scale
- **Page Title**: 4xl (36px), font-bold, text-white
- **Section Title**: 2xl (24px), font-bold, text-white
- **Card Title**: lg (18px), font-semibold, text-white
- **Body**: base (16px), font-medium/normal
- **Small**: sm (14px)
- **Tiny**: xs (12px)

### Spacing

#### Radius Values
```css
--radius-xs: 8px;
--radius-sm: 12px;
--radius-md: 16px;
--radius-lg: 20px;
```

#### Common Patterns
- **Large cards**: rounded-3xl (24px)
- **Medium cards**: rounded-2xl (16px)
- **Small cards/buttons**: rounded-xl (12px)
- **Input fields**: rounded-xl (12px)
- **Badges**: rounded-lg (8px)

#### Padding Scale
- **Page margins**: p-8 (32px)
- **Card padding**: p-6 (24px)
- **Compact card**: p-4 (16px)
- **Button padding**: px-4 py-2 or px-6 py-3
- **Section spacing**: space-y-6 or space-y-8

### Glassmorphism Effects

#### Primary Glass Panel
```css
.glass-panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04)), 
              rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

#### Hover Effect
```css
.glass-panel-hover:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
  transform: translateY(-2px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Backdrop Blur Levels
- **sm**: 4px
- **md**: 12px
- **lg**: 16px (most common)
- **xl**: 24px

### Animations

#### Page Transitions
```tsx
// Used in AppShell
<motion.div
  initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
  exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
>
```

#### Available Animations
- **shimmer**: 2s infinite (loading states)
- **float-subtle**: 3s ease-in-out infinite (subtle elevation)
- **fade-in**: 0.3s ease-out
- **scale-in**: 0.3s cubic-bezier
- **blur-in**: 0.4s cubic-bezier

#### Motion Principles
- Respect `prefers-reduced-motion`
- Use easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Keep transitions under 400ms
- Use spring physics for interactive elements

### Shadows

#### Glass Shadows
```css
--shadow-glass-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-glass-md: 0 4px 16px rgba(0, 0, 0, 0.12);
--shadow-glass-lg: 0 8px 32px rgba(0, 0, 0, 0.16);
```

All include subtle top inset highlight:
```css
inset 0 1px 0 rgba(255, 255, 255, 0.1-0.2);
```

---

## 🏗️ Project Structure

### Directory Layout
```
careerpilot-frontend/
├── app/                         # Next.js App Router
│   ├── (auth)/                  # Auth route group
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/             # Dashboard route group with layout
│   │   ├── layout.tsx           # Wraps with AppShell
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── pipeline/
│   │   │   └── page.tsx
│   │   ├── table/
│   │   │   └── page.tsx
│   │   ├── calendar/
│   │   │   └── page.tsx
│   │   ├── imports/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── globals.css              # Tailwind imports
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Root page (redirects to /dashboard)
├── src/
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── Section.tsx
│   │   │   └── SegmentedTabs.tsx
│   │   ├── kanban/              # Kanban board
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── StageColumn.tsx
│   │   │   └── ApplicationCard.tsx
│   │   ├── tables/              # Table components
│   │   ├── charts/              # Analytics charts
│   │   │   ├── KPICards.tsx
│   │   │   ├── FunnelChart.tsx
│   │   │   └── TimeMetricsChart.tsx
│   │   ├── forms/               # Form components
│   │   │   ├── QuickAddForm.tsx
│   │   │   └── SettingsForm.tsx
│   │   ├── calendar/            # Calendar components
│   │   └── ui/                  # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── tooltip.tsx
│   │       ├── switch.tsx
│   │       └── label.tsx
│   ├── lib/
│   │   ├── api/                 # API client functions
│   │   ├── constants/           # App constants
│   │   └── utils.ts             # Utility functions (cn)
│   ├── types/
│   │   ├── domain.ts            # Domain models
│   │   └── enums.ts             # Enums
│   └── styles/
│       ├── theme.css            # Glass theme & CSS variables
│       └── animations.css       # Animation definitions
├── components/                   # Legacy/alternate components
│   ├── kanban-board.tsx
│   ├── applications-table.tsx
│   ├── analytics-dashboard.tsx
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── auth/
│       └── signin-form.tsx
├── lib/
│   ├── mock-data.ts             # Mock data for development
│   └── utils.ts                 # cn utility
├── components.json              # Shadcn config
├── tailwind.config.ts           # Tailwind config
└── package.json
```

### Key Files to Use

#### From `src/` directory:
- **Layout**: Use `src/components/layout/*` for all layout components
- **Kanban**: Use `src/components/kanban/*` for production Kanban
- **Charts**: Use `src/components/charts/*` for analytics
- **Styles**: Import from `src/styles/theme.css` and `src/styles/animations.css`
- **Types**: Use `src/types/domain.ts` and `src/types/enums.ts`

#### From root `components/`:
- **Auth**: Use `components/auth/signin-form.tsx` as reference
- **Legacy components**: Reference for patterns but prefer `src/` versions

---

## 📐 Layout System

### AppShell Structure
The main layout wrapper that provides consistent structure:

```tsx
// src/components/layout/AppShell.tsx
<div className="min-h-screen flex">
  <Sidebar />                    {/* Fixed left sidebar, 80px wide */}
  <div className="flex-1 flex flex-col ml-20">
    <Topbar />                   {/* Sticky top header */}
    <main className="flex-1 p-8">
      {children}                 {/* Page content with animations */}
    </main>
  </div>
</div>
```

### Sidebar (Vertical Icon Nav)
- **Position**: Fixed left, 16px from edges
- **Width**: 64px (w-16)
- **Style**: Glass panel with rounded corners
- **Icons**: Lucide icons with tooltips
- **Active state**: Gradient background with animated indicator
- **Navigation items**:
  1. Dashboard (LayoutDashboard)
  2. Pipeline (Kanban)
  3. Table (Table2)
  4. Calendar (Calendar)
  5. Import (Upload)
  6. Settings (Settings)

```tsx
// Active indicator animation
<motion.div
  layoutId="sidebar-active"
  className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```

### Topbar
- **Position**: Sticky top with margin
- **Style**: Glass panel, rounded
- **Contents**:
  - Search bar (left)
  - Quick Add button (gradient)
  - Notifications bell (with red dot indicator)
  - User avatar dropdown (right)

```tsx
<Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
  <Plus className="w-4 h-4 mr-2" />
  Quick Add
</Button>
```

### PageHeader Component
Standard header for all pages:

```tsx
<PageHeader 
  title="Pipeline"
  description="Drag and drop to move applications through stages"
  actions={<Button>...</Button>}  // Optional
/>
```

**Styling**:
- Title: text-4xl font-bold text-white
- Description: text-lg text-slate-400

### Section Component
Wrapper for page sections:

```tsx
<Section 
  title="Key Metrics" 
  description="Your application statistics at a glance"
>
  <KPICards />
</Section>
```

---

## 🧩 Core Components

### Kanban Board

#### Structure
```
KanbanBoard (Container)
  ├── DragDropContext (@hello-pangea/dnd)
  └── StageColumn (for each stage)
      └── ApplicationCard (draggable)
```

#### Stage Configuration
```typescript
const STAGES = [
  "discovered",  // Gray
  "applied",     // Blue
  "phone",       // Indigo
  "tech",        // Purple
  "onsite",      // Violet
  "offer",       // Amber
  "accepted",    // Green
  "rejected"     // Red
]
```

#### Column Header
```tsx
<div className="glass-panel p-4 mb-4 rounded-[var(--radius-md)]">
  <h3 className="font-semibold text-white">{title}</h3>
  <span className="text-sm text-slate-400 bg-white/10 px-2 py-1 rounded-lg">
    {count}
  </span>
  <div className={`h-1 rounded-full bg-gradient-to-r ${stageColor}`} />
</div>
```

#### Application Card
```tsx
<div className="glass-panel glass-panel-hover rounded-[var(--radius-md)] p-4">
  {/* Company initial avatar */}
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
    {company[0]}
  </div>
  
  {/* Priority badge */}
  <span className="text-xs px-2 py-1 rounded-lg bg-{color}-100 text-{color}-700">
    {priority}
  </span>
  
  {/* Position & Company */}
  <h4 className="font-semibold text-white">{position}</h4>
  <span className="text-sm text-slate-400">{company}</span>
  
  {/* Metadata icons */}
  <div className="text-xs text-slate-500">
    <Calendar /> {appliedDate}
    <DollarSign /> {salary}
  </div>
</div>
```

#### Drag & Drop
- Uses optimistic updates
- Toast notifications on success/error
- Smooth spring animations
- Visual feedback during drag

### Table View

#### Features
- TanStack Table for data management
- Sortable columns
- Filterable rows
- Row selection
- Glass panel styling

#### Column Structure
1. Company (with avatar)
2. Position
3. Status (colored badge)
4. Location (with map pin icon)
5. Salary
6. Applied Date
7. Priority (colored badge)

#### Row Styling
```css
/* Base row */
border-b border-white/20
hover:bg-white/10
transition-colors
cursor-pointer
```

### Analytics Dashboard

#### KPI Cards
Grid of 4 cards showing:
1. Total Applications (Briefcase icon, blue gradient)
2. Active (Clock icon, indigo gradient)
3. Offers (CheckCircle icon, green gradient)
4. Rejected (XCircle icon, red gradient)

**Card Structure**:
```tsx
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
  className="glass-panel glass-panel-hover rounded-[var(--radius-md)] p-5"
>
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br ${gradient}">
    <Icon />
  </div>
  <div className="text-3xl font-bold text-white">{value}</div>
  <div className="text-sm text-slate-400">{label}</div>
  <div className="flex items-center gap-1 text-xs text-{color}">
    <TrendingUp /> {change}
  </div>
</motion.div>
```

#### Charts
- **FunnelChart**: Recharts bar chart showing stage conversion
- **TimeMetricsChart**: Recharts line chart showing days in each stage
- Both use glass panel backgrounds
- Color-coded by stage

### Calendar View

#### Layout
- Custom calendar grid (not React Big Calendar in basic view)
- Month navigation with arrows
- Days highlighted if they have events
- Glass panel container

#### Day Cell
```tsx
<div className={`
  aspect-square rounded-xl p-2 text-center transition-all
  ${hasEvents 
    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold shadow-lg"
    : "bg-white/10 text-slate-400 hover:bg-white/20"
  }
`}>
  {day}
</div>
```

### Forms

#### QuickAddForm
Modal dialog for quickly adding applications:
- Company name
- Position
- Status dropdown
- Location
- Salary (optional)
- URL (optional)
- Tags (optional)
- Notes textarea

**Styling pattern**:
```tsx
<Input 
  className="bg-white/5 border-white/10 focus:ring-indigo-500"
  placeholder="..."
/>
```

#### Button Variants
```tsx
// Primary (gradient)
<Button className="bg-gradient-to-r from-indigo-500 to-purple-600">

// Ghost
<Button variant="ghost">

// Icon only
<Button variant="ghost" size="icon">
```

### Authentication

#### Sign-In Form
- Centered glass card
- Logo with gradient background
- Email + Password fields
- Full-width gradient submit button
- Link to sign-up

**Container**:
```tsx
<div className="min-h-screen flex items-center justify-center">
  <div className="glass-card rounded-3xl p-8 w-full max-w-md">
    {/* Logo */}
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
      <Briefcase />
    </div>
    
    {/* Form */}
    <form className="space-y-4">
      <input className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30" />
      <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
    </form>
  </div>
</div>
```

---

## 🎭 UI Patterns & Interactions

### Gradient Patterns

#### Primary Actions
```css
background: linear-gradient(to right, #6366f1, #9333ea);  /* indigo to purple */
hover:from-indigo-600 hover:to-purple-700
```

#### Secondary Gradients
```css
/* Blue-Cyan */
from-blue-500 to-cyan-500

/* Green-Emerald */
from-green-500 to-emerald-500

/* Red-Pink */
from-red-500 to-pink-500
```

#### Card Accents
```css
/* For icons/avatars */
bg-gradient-to-br from-blue-500 to-indigo-600
```

### Icon Usage

#### Patterns
- Always paired with text in buttons
- 4-5px size in cards: `w-4 h-4` or `w-5 h-5`
- 6px in large icons: `w-6 h-6`
- Consistent spacing: `gap-2` or `gap-3`

#### Common Icons
- **Search**: Search
- **Add**: Plus
- **Notifications**: Bell
- **User**: User or Avatar
- **Dashboard**: LayoutDashboard
- **Pipeline**: Kanban
- **Table**: Table2
- **Calendar**: Calendar
- **Settings**: Settings
- **Upload**: Upload
- **Location**: MapPin
- **Money**: DollarSign
- **Date**: Calendar
- **Company**: Building2
- **Trends**: TrendingUp, TrendingDown

### Badge System

#### Priority Badges
```tsx
// High priority
<span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
  high
</span>

// Medium priority
<span className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
  medium
</span>

// Low priority
<span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
  low
</span>
```

#### Status Badges
```tsx
// Applied
<span className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
  applied
</span>

// Interview
<span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700">
  interview
</span>

// Offer
<span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
  offer
</span>

// Rejected
<span className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700">
  rejected
</span>
```

### Avatar System

#### User Avatar
```tsx
<Avatar className="w-8 h-8">
  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
    JD
  </AvatarFallback>
</Avatar>
```

#### Company Avatar
```tsx
<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
  {company.charAt(0)}
</div>
```

### Loading States

#### Skeleton Loader
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-white/10 rounded"></div>
  <div className="h-8 bg-white/10 rounded mt-2"></div>
</div>
```

#### Spinner
```tsx
<div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
```

### Hover Effects

#### Cards
```css
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
hover:shadow-lg
hover:transform hover:translateY(-2px)
```

#### Buttons
```css
transition-all duration-300
hover:shadow-lg
hover:scale-105
```

#### Links
```css
hover:text-indigo-400
transition-colors
```

---

## 📊 Data Models

### Application
```typescript
interface Application {
  id: string
  company: string
  position: string
  stage: string              // ApplicationStage enum value
  location?: string
  salary?: string
  appliedDate: string        // ISO date string
  url?: string
  tags?: string[]
  notes?: string
}
```

### User
```typescript
interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
```

### Enums
```typescript
enum ApplicationStage {
  DISCOVERED = "discovered",
  APPLIED = "applied",
  PHONE = "phone",
  TECH = "tech",
  ONSITE = "onsite",
  OFFER = "offer",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

enum InterviewType {
  PHONE = "phone",
  TECHNICAL = "technical",
  BEHAVIORAL = "behavioral",
  ONSITE = "onsite",
  FINAL = "final",
}
```

---

## 🎯 Page-Specific Details

### Dashboard Page (`/dashboard`)
**Purpose**: Overview with KPIs and charts

**Layout**:
```tsx
<div className="space-y-8">
  <PageHeader title="Dashboard" />
  
  <Section title="Key Metrics">
    <KPICards />
  </Section>
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <Section title="Application Funnel">
      <FunnelChart />
    </Section>
    
    <Section title="Time Metrics">
      <TimeMetricsChart />
    </Section>
  </div>
</div>
```

### Pipeline Page (`/pipeline`)
**Purpose**: Kanban board for drag-and-drop workflow

**Layout**:
```tsx
<div className="space-y-8">
  <PageHeader title="Pipeline" description="Drag and drop..." />
  <KanbanBoard />
</div>
```

### Table Page (`/table`)
**Purpose**: Sortable/filterable table view

**Features**:
- Column sorting
- Multi-column filtering
- Row selection
- Export functionality
- Inline editing

### Calendar Page (`/calendar`)
**Purpose**: Timeline view of interviews and deadlines

**Features**:
- Month/week view toggle
- Event highlights
- .ics export
- Quick add from date cell

### Imports Page (`/imports`)
**Purpose**: Bulk import applications

**Options**:
- CSV upload with field mapping
- Resume parsing (PDF/DOCX)
- Gmail label selection
- URL scraping

### Settings Page (`/settings`)
**Purpose**: User preferences and account management

**Sections**:
- Profile information
- Email connections (Gmail/Outlook)
- Notification preferences
- Data retention settings
- Theme customization

---

## 🔧 Utility Functions

### cn() - ClassName Merger
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage**:
```tsx
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  variant === "primary" && "variant-classes"
)}>
```

---

## 📱 Responsive Design

### Breakpoints
```typescript
// Tailwind defaults
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Grid Patterns
```tsx
// 4-column grid, responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// 2-column chart grid
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
```

### Mobile Considerations
- Sidebar collapses to hamburger (not implemented in prototype)
- Tables become horizontally scrollable
- Cards stack vertically
- Reduce padding on mobile: `p-4 md:p-8`

---

## 🎨 Component Composition Examples

### Glass Panel Card
```tsx
<div className="glass-panel glass-panel-hover rounded-[var(--radius-md)] p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-xl font-bold text-white">Title</h3>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="w-4 h-4" />
    </Button>
  </div>
  <div className="space-y-4">
    {/* Content */}
  </div>
</div>
```

### Stat Card with Icon
```tsx
<div className="glass-panel rounded-[var(--radius-md)] p-5">
  <div className="flex items-center justify-between mb-3">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="text-xs text-green-400 flex items-center gap-1">
      <TrendingUp className="w-3.5 h-3.5" />
      +12%
    </span>
  </div>
  <div className="text-3xl font-bold text-white mb-1">47</div>
  <div className="text-sm text-slate-400">Total Applications</div>
</div>
```

### Input Field
```tsx
<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">
    Email
  </label>
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
    <Input
      type="email"
      placeholder="you@example.com"
      className="pl-10 bg-white/5 border-white/10 focus:ring-indigo-500"
    />
  </div>
</div>
```

### Modal Dialog
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-[600px]">
    <DialogHeader>
      <DialogTitle>Quick Add Application</DialogTitle>
    </DialogHeader>
    <form className="space-y-4">
      {/* Form fields */}
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          Add Application
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
```

---

## 🚀 Implementation Guidelines

### When Building the Real App

1. **Start with the design system**
   - Set up CSS variables in `globals.css`
   - Create reusable glass panel classes
   - Define color tokens
   - Set up animation keyframes

2. **Build layout components first**
   - AppShell
   - Sidebar
   - Topbar
   - PageHeader

3. **Use the src/ directory structure**
   - Keep components organized by feature
   - Use `src/components/layout/` for shell
   - Use `src/components/ui/` for Shadcn components
   - Use feature folders: `kanban/`, `charts/`, `forms/`

4. **Follow the glassmorphism pattern**
   - Always use `.glass-panel` base class
   - Add `.glass-panel-hover` for interactive cards
   - Maintain consistent border-radius
   - Use backdrop-blur consistently

5. **Animation guidelines**
   - Page transitions via Framer Motion in AppShell
   - Card entrance animations with staggered delays
   - Hover effects with cubic-bezier easing
   - Respect reduced motion preferences

6. **Gradient usage**
   - Primary actions: indigo-to-purple
   - Icons/avatars: blue-to-indigo
   - Stage indicators: per-stage colors
   - Always use `bg-gradient-to-r` or `bg-gradient-to-br`

7. **Typography hierarchy**
   - Page titles: text-4xl font-bold text-white
   - Section titles: text-2xl font-bold text-white
   - Card titles: text-lg font-semibold text-white
   - Body: text-base text-slate-300
   - Muted: text-sm text-slate-400

8. **Spacing consistency**
   - Page padding: p-8
   - Card padding: p-4 to p-6
   - Section gaps: space-y-6 or space-y-8
   - Element gaps: gap-2, gap-3, gap-4

9. **Interactive states**
   - Buttons: hover:shadow-lg hover:scale-105
   - Cards: hover:transform hover:-translate-y-0.5
   - Links: hover:text-indigo-400
   - Inputs: focus:ring-2 focus:ring-indigo-500

10. **Accessibility**
    - All buttons have aria-labels if icon-only
    - Form inputs have associated labels
    - Focus rings are visible
    - Color contrast meets WCAG AA
    - Keyboard navigation works throughout

---

## 📚 Key Takeaways

### Design DNA
- **Dark + Glass**: Dark background with frosted glass overlays
- **Vibrant Accents**: Indigo/purple gradients for primary actions
- **Smooth Motion**: 200-400ms transitions with cubic-bezier easing
- **Generous Space**: Large padding, rounded corners
- **Semantic Color**: Stage colors convey meaning

### Component Patterns
- **Glass Panel**: Base for all cards and surfaces
- **Gradient Icons**: Circle/square with gradient background
- **Badge System**: Colored pills for status/priority
- **Hover Effects**: Lift and shadow on interaction
- **Staggered Animation**: Cards enter with delays

### Technical Foundation
- **Next.js 14 App Router**: Modern routing with layouts
- **Shadcn/ui New York**: Consistent component library
- **Framer Motion**: Smooth page transitions
- **TanStack Table**: Powerful data tables
- **Hello Pangea DnD**: Accessible drag-and-drop

### File Organization
- **Use src/ directory**: For production components
- **Feature folders**: Group related components
- **Shared UI**: Shadcn components in `ui/`
- **Types**: Centralized in `types/`
- **Styles**: CSS variables in `styles/`

---

## 🎓 Notes for Implementation

### What to Keep Exactly
✅ Color palette and gradients
✅ Glassmorphism effect CSS
✅ Component structure (Sidebar, Topbar, AppShell)
✅ Animation timings and easing
✅ Typography scale
✅ Badge and avatar patterns

### What to Adapt
🔄 Mock data → Real API calls
🔄 Component file locations (consolidate to src/)
🔄 Add proper form validation with Zod
🔄 Add proper error boundaries
🔄 Add loading states throughout
🔄 Add proper TypeScript types for all props

### What to Add
➕ API client layer
➕ State management (if needed beyond React state)
➕ Error handling and retry logic
➕ Proper authentication flow
➕ Data fetching with SWR or React Query
➕ Form submission and validation
➕ Toast notifications throughout
➕ Empty states for all views
➕ Mobile responsive layouts
➕ Accessibility improvements

---

## 🎬 Conclusion

This frontend reference provides a complete blueprint for building CareerPilot's user interface. The design is modern, polished, and production-ready. The glassmorphism aesthetic combined with smooth animations creates a premium feel that will delight users.

Key principles to remember:
- **Glass over everything**: The design system revolves around frosted glass panels
- **Motion matters**: Smooth transitions make the app feel alive
- **Gradients are your friend**: Used consistently for primary actions and accents
- **Dark is the base**: Light text and UI elements on dark backgrounds
- **Consistency wins**: Reuse patterns, spacing, and components

Follow this reference closely and you'll create a beautiful, cohesive application that matches the v0 prototype while adding production-ready features and functionality.



