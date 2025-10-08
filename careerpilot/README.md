# 🚀 CareerPilot - Job Application Tracker

A modern, beautiful job application tracking system built with Next.js, featuring glassmorphism design, authentication, and comprehensive settings.

## ✨ Features

### 🔐 Authentication
- **Email/Password Sign Up & Sign In**
- **Google OAuth Integration**
- **Secure Password Hashing** (bcryptjs)
- **Protected Routes** with Next.js middleware
- **Session Management** with NextAuth.js

### ⚙️ User Settings
- **Profile Management** - Update name and email
- **Timezone Selection** - 30+ timezones worldwide
- **Notification Preferences**:
  - In-App Notifications
  - Email Notifications
  - Slack Webhook Integration
  - Discord Webhook Integration
- **Data Retention Policy** - 90 days to forever

### 🎨 Design
- **Glassmorphism UI** - Modern frosted glass aesthetic
- **Dark Theme** - Gradient background (slate → indigo)
- **Smooth Animations** - Framer Motion transitions
- **Responsive** - Works on all screen sizes
- **Toast Notifications** - Sonner for user feedback

---

## 🛠️ Tech Stack

### Core
- **Next.js 14.1.0** - React framework with App Router
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **PostgreSQL** - Database (via Neon or local)

### Authentication
- **NextAuth.js** - Authentication library
- **Bcryptjs** - Password hashing
- **@auth/prisma-adapter** - Prisma adapter

### Database
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Production database

### UI Components
- **Shadcn/ui** - Accessible components
- **Radix UI** - Component primitives
- **Lucide Icons** - Icon library
- **Sonner** - Toast notifications
- **Framer Motion** - Animations

### Validation
- **Zod** - Schema validation
- **React Hook Form** - Form management

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or Neon)
- npm or yarn package manager

### 1. Clone and Install

```bash
cd CareerPilot/careerpilot
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root:

```bash
# Database (Neon PostgreSQL - free tier recommended)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Getting a Neon Database (Free)**:
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

### 3. Set Up Database

```bash
# Push schema to database
npm run db:push

# Seed with test data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

### Quick Test

After seeding, sign in with:
- **Email**: `test@example.com`
- **Password**: `password123`

### Run Database Tests

```bash
npm run test:db
```

---

## 📁 Project Structure

```
careerpilot/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth pages (signin, signup)
│   │   ├── (dashboard)/       # Protected pages (dashboard, settings)
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # SessionProvider wrapper
│   ├── components/
│   │   ├── auth/              # Auth forms
│   │   ├── settings/          # Settings sections
│   │   └── ui/                # Shadcn components
│   ├── lib/
│   │   ├── auth/              # Auth utilities
│   │   ├── db/                # Prisma client
│   │   ├── timezones.ts       # Timezone constants
│   │   └── utils.ts           # Utility functions
│   ├── styles/
│   │   ├── theme.css          # Glassmorphism theme
│   │   └── animations.css     # Animation definitions
│   └── middleware.ts          # Route protection
├── scripts/
│   └── test-all.ts            # Test suite
├── TESTING.md                  # Testing guide
└── package.json
```

---

## 🎯 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier

npm run db:push      # Push schema to database
npm run db:seed      # Seed database with test data
npm run db:reset     # Reset database (⚠️ deletes all data)

npm run test:db      # Run database tests
```

---

## 🔒 Security Features

- ✅ **Password Hashing** - Bcrypt with salt rounds
- ✅ **JWT Sessions** - Secure, httpOnly cookies
- ✅ **Route Protection** - Middleware guards all routes
- ✅ **API Authentication** - All API routes protected
- ✅ **Input Validation** - Zod schemas on all endpoints
- ✅ **XSS Protection** - React auto-escaping
- ✅ **CSRF Protection** - NextAuth.js built-in

---

## 📊 Database Schema

### User Model
```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String
  password          String?   // Null for OAuth
  avatar            String?
  emailVerified     DateTime?
  
  // Settings
  timezone          String    @default("UTC")
  notifyInApp       Boolean   @default(true)
  notifyEmail       Boolean   @default(true)
  notifySlack       Boolean   @default(false)
  notifyDiscord     Boolean   @default(false)
  slackWebhook      String?
  discordWebhook    String?
  dataRetentionDays Int?      @default(365)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

---

## 🎨 Design System

### Colors
- **Background**: Dark gradient (slate → indigo)
- **Glass Panels**: `rgba(255, 255, 255, 0.08)` with blur
- **Primary**: Blue-500 to Indigo-600 gradient
- **Text**: White on dark, slate-400 for secondary

### Typography
- **Font**: Inter (via next/font/google)
- **Sizes**: 4xl (page titles), 2xl (sections), lg (cards)

### Animations
- **Duration**: 200-400ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover**: Scale + shadow effects

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy 🎉

### Environment Variables for Production
```
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 📝 API Routes

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update settings

### Protected Example
- `GET /api/example-protected` - Demo protected route

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (`npm run test:db`)
5. Build (`npm run build`)
6. Submit a pull request

---

## 📄 License

MIT License - feel free to use this project for learning or production!

---

## 🎉 What's Next?

### Upcoming Features (Task 2.0+)
- 📊 **Data Models**: Applications, Companies, Contacts, Interviews
- 📋 **Kanban Board**: Drag-and-drop pipeline
- 📅 **Calendar**: Interview scheduling
- 📈 **Analytics**: KPIs and charts
- 📧 **Email Parsing**: Auto-import from Gmail/Outlook
- 🔔 **Smart Reminders**: Follow-up notifications

---

## 💡 Tips

### Test Users
After seeding, you can sign in with:
- `test@example.com` / `password123`
- `demo@careerpilot.com` / `password456`
- `minimal@example.com` / `secure123`

### Development
- Use `npm run dev` for hot reload
- Use `npm run db:push` to sync schema changes
- Use Prisma Studio: `npx prisma studio` for database GUI

### Troubleshooting
- Clear cookies if you get auth errors
- Run `npm run db:reset` to start fresh
- Check `.env` file is in the root directory
- Ensure PostgreSQL is running (or Neon is accessible)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/careerpilot/issues)
- **Documentation**: [TESTING.md](./TESTING.md)

---

Made with ❤️ using Next.js, TypeScript, and Glassmorphism ✨
