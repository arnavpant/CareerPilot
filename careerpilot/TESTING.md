# CareerPilot Testing Guide

## 🗄️ Database Setup

Before running the application, you need to set up a PostgreSQL database.

### Option 1: Neon (Free Cloud PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Create `.env` file:

```bash
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

5. Push schema and seed:

```bash
npm run db:push
npm run db:seed
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb careerpilot`
3. Update `.env` with local connection string:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/careerpilot"
```

4. Push schema and seed:

```bash
npm run db:push
npm run db:seed
```

---

## 🧪 Running Tests

### Database Tests

After setting up the database, run the comprehensive test suite:

```bash
npm run test:db
```

This will test:
- ✅ Database connection
- ✅ Password hashing (bcrypt)
- ✅ User creation and deletion
- ✅ User settings (all fields)
- ✅ Email uniqueness constraint
- ✅ Nullable fields (OAuth users, webhooks)
- ✅ Seeded test users
- ✅ Timezone validation
- ✅ Data retention ranges

---

## ✅ Manual Testing Checklist

### 1. Authentication Tests

#### Sign Up (`/signup`)
- [ ] Sign up with valid email/password
- [ ] Sign up with weak password (< 8 chars) → should fail
- [ ] Sign up with existing email → should fail
- [ ] Sign up with invalid email format → should fail
- [ ] Sign up with empty fields → should fail

#### Sign In (`/signin`)
- [ ] Sign in with correct credentials
- [ ] Sign in with wrong password → should fail
- [ ] Sign in with non-existent email → should fail
- [ ] Sign in redirects to `/dashboard`
- [ ] Sign in with `?from=/settings` redirects correctly

#### Google OAuth
- [ ] Click "Continue with Google"
- [ ] Complete Google auth flow
- [ ] User created in database
- [ ] Redirected to dashboard

### 2. Route Protection Tests

#### Middleware Protection
- [ ] Access `/dashboard` without auth → redirect to `/signin`
- [ ] Access `/settings` without auth → redirect to `/signin`
- [ ] Access `/signin` when authenticated → redirect to `/dashboard`
- [ ] Access `/signup` when authenticated → redirect to `/dashboard`

#### API Protection
- [ ] Call `/api/settings` without auth → 401 Unauthorized
- [ ] Call `/api/example-protected` without auth → 401 Unauthorized

### 3. Dashboard Tests (`/dashboard`)
- [ ] Page loads successfully
- [ ] Shows user's name or email
- [ ] Displays welcome message
- [ ] Lists upcoming features

### 4. Settings Tests (`/settings`)

#### Profile Section
- [ ] Update name successfully
- [ ] Name field shows current name
- [ ] Email field is disabled (read-only)
- [ ] Save button disabled when no changes
- [ ] Success toast on save

#### Timezone Section
- [ ] Dropdown shows 30+ timezones
- [ ] Select different timezone
- [ ] Save successfully
- [ ] Success toast on save

#### Notifications Section
- [ ] Toggle In-App notifications
- [ ] Toggle Email notifications
- [ ] Enable Slack → webhook field appears
- [ ] Disable Slack → webhook field disappears
- [ ] Enable Discord → webhook field appears
- [ ] Invalid webhook URL → validation error
- [ ] Save all settings successfully

#### Data Retention Section
- [ ] Select "Keep Forever" (null)
- [ ] Select "90 Days"
- [ ] Select "365 Days"
- [ ] Description updates based on selection
- [ ] Save successfully

#### Account Information
- [ ] Shows user ID
- [ ] Shows "Member since" date
- [ ] Date formatted correctly

### 5. Edge Case Tests

#### Authentication Edge Cases
- [ ] Sign up with email: `test+tag@example.com`
- [ ] Sign up with email: `user.name@subdomain.example.com`
- [ ] Password with special characters: `P@ssw0rd!#$`
- [ ] Very long name (100 chars)
- [ ] Emoji in name: `John 🚀 Doe`

#### Settings Edge Cases
- [ ] Set all notifications to false
- [ ] Set all notifications to true
- [ ] Very long webhook URL
- [ ] Empty webhook URL when notification enabled
- [ ] Switch between retention periods rapidly
- [ ] Update multiple settings in quick succession

#### Session Edge Cases
- [ ] Open app in two tabs
- [ ] Sign out in one tab → other tab redirects
- [ ] Session expires → redirected to signin
- [ ] Close browser and reopen → session persists

---

## 🔍 Database Verification

After seeding, verify these test users exist:

```sql
-- Check all users
SELECT email, name, password IS NOT NULL as has_password, timezone, "notifyInApp", "dataRetentionDays" 
FROM users;
```

Expected users:
1. `test@example.com` - password: `password123`
2. `demo@careerpilot.com` - password: `password456`
3. `minimal@example.com` - password: `secure123`
4. `notifications@example.com` - password: `testpass789`
5. `oauth@example.com` - OAuth only (no password)

---

## 🐛 Common Issues & Solutions

### Issue: "Can't reach database server"
**Solution**: Ensure PostgreSQL is running or your Neon connection string is correct in `.env`

### Issue: "Invalid credentials" on sign-in
**Solution**: Make sure you ran `npm run db:seed` to create test users

### Issue: "User already exists" when signing up
**Solution**: Try a different email or run `npm run db:reset` to reset the database

### Issue: Settings not saving
**Solution**: 
1. Check browser console for errors
2. Verify API route is protected with authentication
3. Check Prisma schema matches database

### Issue: Middleware redirecting incorrectly
**Solution**:
1. Clear cookies/local storage
2. Check `NEXTAUTH_URL` in `.env`
3. Restart dev server

---

## 📊 Performance Tests

### Load Testing (Optional)
```bash
# Install artillery
npm install -g artillery

# Run load test on signup endpoint
artillery quick --count 10 --num 5 http://localhost:3000/api/auth/signup
```

### Build Size Check
```bash
npm run build

# Check First Load JS size
# Should be under 200 kB for good performance
```

---

## 🔒 Security Tests

### Authentication Security
- [ ] Passwords are hashed (never stored plain text)
- [ ] Session tokens are secure (httpOnly cookies)
- [ ] API routes require authentication
- [ ] Middleware protects all routes except auth pages
- [ ] No sensitive data in client-side JavaScript

### Input Validation
- [ ] Zod schema validation on all API endpoints
- [ ] Email format validated
- [ ] Password minimum length enforced (8 chars)
- [ ] URL validation for webhooks
- [ ] XSS protection (React escapes by default)

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All manual tests pass
- [ ] Database tests pass
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] Environment variables set in production
- [ ] Database connection works in production
- [ ] HTTPS enabled
- [ ] NEXTAUTH_URL set to production URL
- [ ] NEXTAUTH_SECRET is secure (32+ random chars)
- [ ] Google OAuth credentials for production domain

---

## 🎯 Test User Credentials

For manual testing, use these accounts:

1. **Standard User**
   - Email: `test@example.com`
   - Password: `password123`
   - Timezone: Eastern Time
   - Notifications: In-App + Email

2. **Demo User**
   - Email: `demo@careerpilot.com`
   - Password: `password456`
   - Timezone: Pacific Time
   - Notifications: In-App + Slack
   - Has Slack webhook configured

3. **Minimal User**
   - Email: `minimal@example.com`
   - Password: `secure123`
   - Timezone: UTC
   - Notifications: All disabled
   - Retention: Forever

4. **Notification Lover**
   - Email: `notifications@example.com`
   - Password: `testpass789`
   - Timezone: London
   - Notifications: All enabled
   - Has both Slack and Discord webhooks

5. **OAuth User**
   - Email: `oauth@example.com`
   - Password: None (OAuth only)
   - Timezone: Tokyo

---

## 📝 Test Report Template

After completing all tests, document results:

```
Test Date: [DATE]
Tester: [NAME]
Environment: [Local/Staging/Production]

Authentication Tests: ✅ PASS / ❌ FAIL
Route Protection Tests: ✅ PASS / ❌ FAIL
Dashboard Tests: ✅ PASS / ❌ FAIL
Settings Tests: ✅ PASS / ❌ FAIL
Edge Case Tests: ✅ PASS / ❌ FAIL
Database Tests: ✅ PASS / ❌ FAIL

Issues Found:
1. [Description]
2. [Description]

Notes:
[Any additional observations]
```

