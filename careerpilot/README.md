# CareerPilot - Job Application Tracker CRM

A modern, beautiful job application tracker designed for students and early-career professionals. Track applications, parse emails, get reminders, and visualize your job search progress.

## 🚀 Tech Stack

- **Framework**: Next.js 14.1.0 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Shadcn/ui (New York style)
- **Animation**: Framer Motion 11.0.3
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table 8.11.6
- **Drag & Drop**: Hello Pangea DnD 16.6.0
- **Charts**: Recharts 2.12.0
- **Calendar**: React Big Calendar 1.11.1
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🎨 Design

This application uses a premium **glassmorphism design language** with:
- Dark gradient backgrounds
- Frosted glass panels with backdrop blur
- Indigo-to-purple gradients for primary actions
- Smooth Framer Motion animations
- Stage-specific color coding

See `tasks/front-end-reference.md` for complete design specifications.

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Neon/Supabase)
- Git

## 🛠️ Setup

### 1. Clone and Install

\`\`\`bash
cd careerpilot
npm install
\`\`\`

### 2. Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/careerpilot"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Gmail API (optional)
GMAIL_CLIENT_ID=""
GMAIL_CLIENT_SECRET=""

# Microsoft Graph (optional)
MICROSOFT_CLIENT_ID=""
MICROSOFT_CLIENT_SECRET=""

# Email Service - Resend (optional)
RESEND_API_KEY=""

# File Storage - Vercel Blob (optional)
BLOB_READ_WRITE_TOKEN=""
\`\`\`

Generate a secure `NEXTAUTH_SECRET`:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 3. Database Setup

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint
- \`npm run format\` - Format code with Prettier

## 📁 Project Structure

\`\`\`
careerpilot/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Main app pages
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── layout/            # Layout components (AppShell, Sidebar, Topbar)
│   │   ├── kanban/            # Kanban board components
│   │   ├── charts/            # Analytics charts
│   │   ├── forms/             # Form components
│   │   ├── tables/            # Table components
│   │   └── ui/                # Shadcn UI primitives
│   ├── lib/
│   │   ├── api/               # API client functions
│   │   ├── constants/         # App constants
│   │   └── utils.ts           # Utility functions
│   ├── types/
│   │   ├── domain.ts          # Domain models
│   │   └── enums.ts           # Enums
│   └── styles/
│       ├── theme.css          # Glass theme & variables
│       └── animations.css     # Animation definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── components.json            # Shadcn config
├── tailwind.config.ts         # Tailwind config
└── package.json
\`\`\`

## 🎯 Features

- ✅ **Application Tracking**: Track jobs through stages (discovered → applied → interviews → offer)
- ✅ **Kanban Board**: Drag-and-drop applications between stages
- ✅ **Table View**: Sortable, filterable data table
- ✅ **Calendar View**: See interviews and deadlines
- ✅ **Analytics Dashboard**: KPIs, funnel charts, time metrics
- ✅ **Email Parsing**: Auto-create applications from Gmail/Outlook (coming soon)
- ✅ **Smart Reminders**: Get notified for follow-ups (coming soon)
- ✅ **Import Tools**: CSV upload, resume parsing (coming soon)

## 🔐 Authentication

Uses NextAuth.js with:
- Email/password authentication
- Google OAuth (optional)
- Session-based auth
- Protected routes via middleware

## 🗄️ Database

Uses Prisma ORM with PostgreSQL for:
- Type-safe database access
- Automatic migrations
- Schema management

Free hosting options:
- **Neon**: 0.5GB free tier
- **Supabase**: 500MB free tier
- **Railway**: Free tier available

## 📊 Admin Dashboard

Access at `/admin` (creator only) to view:
- Total users and activity
- Platform statistics
- Database health
- User management

Use \`npx prisma studio\` for direct database access.

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

\`\`\`bash
npm run build
npm run start
\`\`\`

## 📝 License

MIT

## 🤝 Contributing

This is a personal project. Feel free to fork and adapt for your own use.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using Next.js and modern web technologies.
