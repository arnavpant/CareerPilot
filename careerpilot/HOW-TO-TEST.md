# 🧪 How to Run All Tests

## 🎯 Quick Test Commands

### 1️⃣ **Test Without Database** (Works Immediately)

```bash
npm run test:build
```

**What it does**: Tests if your code compiles and builds successfully
**Time**: ~15-30 seconds
**Result**: Shows build output, bundle sizes, and confirms zero errors

---

### 2️⃣ **Check Environment Variables**

```bash
npm run check:env
```

**What it does**: Validates your `.env` file has all required variables
**Time**: <1 second
**Result**: Shows which variables are set and which are missing

---

### 3️⃣ **Test Database Operations** (Requires Database)

```bash
npm run test:db
```

**What it does**: Runs 9 comprehensive database tests
**Requirements**: `.env` file with valid `DATABASE_URL`
**Time**: ~5-10 seconds
**Tests**:
- ✅ Database connection
- ✅ Password hashing
- ✅ User creation/deletion
- ✅ Settings updates
- ✅ Email uniqueness
- ✅ Nullable fields
- ✅ Seeded users
- ✅ Timezone validation
- ✅ Data retention ranges

---

### 4️⃣ **Run ALL Tests** (Full Suite)

```bash
npm run test:all
```

**What it does**: Runs all tests in sequence
**Steps**:
1. Check environment ✅
2. Test build ✅
3. Test database ✅

**Time**: ~20-40 seconds
**Requirements**: Valid `.env` file with database

---

## 📋 Step-by-Step: Running Tests

### Option A: Quick Test (No Setup Needed)

```bash
# Just test if the code compiles
npm run test:build
```

**Expected Output**:
```
🏗️  Testing Build Process
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Running: npm run build
This may take 15-30 seconds...

✓ Compiled successfully
✓ Generating static pages (12/12)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Build Test Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Build successful!
⏱️  Duration: 15.23s

🎉 Your app is ready to deploy!
```

---

### Option B: Full Test Suite (Requires Setup)

#### Step 1: Get a Free Database (2 minutes)

```bash
# Visit https://neon.tech
# Sign up (free, no credit card)
# Create a project
# Copy the connection string
```

#### Step 2: Create `.env` File

```bash
# Copy the example
cp .env.example .env

# Edit with your values
nano .env
```

Add:
```bash
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

Generate secret:
```bash
openssl rand -base64 32
```

#### Step 3: Check Environment

```bash
npm run check:env
```

**Expected Output**:
```
🔍 Checking environment variables...

📋 Required Variables:
✅ DATABASE_URL - SET (postgresql://...neon.tech/...)
✅ NEXTAUTH_URL - SET (http://localhost:3000)
✅ NEXTAUTH_SECRET - SET (aBcDeFgH...XyZ=)

🔧 Optional Variables:
⚠️  GOOGLE_CLIENT_ID - NOT SET (Google OAuth client ID)
⚠️  GOOGLE_CLIENT_SECRET - NOT SET (Google OAuth client secret)

✅ All required environment variables are set!
🚀 Ready to run tests and start the app!
```

#### Step 4: Initialize Database

```bash
# Push schema
npm run db:push

# Seed test data
npm run db:seed
```

#### Step 5: Run All Tests

```bash
npm run test:all
```

**Expected Output**:
```
🔍 Checking environment variables...
✅ All required environment variables are set!

🏗️  Testing Build Process...
✅ Build successful!

🧪 CareerPilot Test Suite
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Database Connection - Connected to database (123ms)
✅ Password Hashing - Bcrypt working correctly (456ms)
✅ User Creation - User created and deleted successfully (234ms)
✅ User Settings - Settings created and updated correctly (345ms)
✅ Email Uniqueness - Duplicate email correctly rejected (178ms)
✅ Nullable Fields - Nullable fields handled correctly (156ms)
✅ Seeded Users - Found 5 users including test accounts (89ms)
✅ Timezone Validation - All timezones stored correctly (267ms)
✅ Data Retention Ranges - All retention values stored correctly (312ms)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Results Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests: 9
✅ Passed: 9
❌ Failed: 0
⏱️  Total Duration: 2160ms
📈 Success Rate: 100.0%

🎉 All tests passed!
```

---

## 🗂️ Other Useful Commands

### Database Management

```bash
# View database in GUI
npm run db:studio

# Reset database (⚠️ deletes all data)
npm run db:reset

# Push schema changes
npm run db:push

# Reseed test data
npm run db:seed
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📊 What Each Test Validates

### Build Test (`test:build`)
- ✅ TypeScript compiles without errors
- ✅ ESLint passes without errors
- ✅ All pages generate successfully
- ✅ Bundle sizes are reasonable
- ✅ Production build works

### Environment Test (`check:env`)
- ✅ `.env` file exists
- ✅ `DATABASE_URL` is set
- ✅ `NEXTAUTH_URL` is set
- ✅ `NEXTAUTH_SECRET` is set
- ⚠️  Optional variables (Google OAuth)

### Database Test (`test:db`)

**Connection Tests**:
- ✅ Can connect to PostgreSQL
- ✅ Prisma client works

**Authentication Tests**:
- ✅ Bcrypt hashing works
- ✅ Password verification works
- ✅ Passwords are never plain text

**CRUD Tests**:
- ✅ Can create users
- ✅ Can update users
- ✅ Can delete users
- ✅ Transactions work

**Settings Tests**:
- ✅ Default settings are correct
- ✅ Settings can be updated
- ✅ All 30+ timezones work
- ✅ Notification toggles work
- ✅ Webhook URLs validate
- ✅ Data retention works

**Constraint Tests**:
- ✅ Email must be unique
- ✅ Duplicate emails rejected
- ✅ Nullable fields work (OAuth users)
- ✅ Required fields enforced

**Seed Data Tests**:
- ✅ All 5 test users exist
- ✅ Password users have passwords
- ✅ OAuth users don't have passwords
- ✅ Settings vary per user

---

## ❓ Troubleshooting

### "Can't reach database server"

```bash
# Check your DATABASE_URL
npm run check:env

# Make sure you copied the full connection string from Neon
# Should look like: postgresql://...@...neon.tech/...?sslmode=require
```

### "Tests fail with 'User not found'"

```bash
# Reseed the database
npm run db:seed
```

### "Environment variable missing"

```bash
# Check what's missing
npm run check:env

# Make sure .env is in the root (same folder as package.json)
ls -la .env
```

### "Build succeeds but tests fail"

```bash
# Try regenerating Prisma client
npx prisma generate

# Then run tests again
npm run test:all
```

### "Permission denied on setup.sh"

```bash
# Make it executable
chmod +x scripts/setup.sh

# Or run directly with bash
bash scripts/setup.sh
```

---

## 🎯 Testing Checklist

Before deploying or considering Task 1.0 complete:

- [ ] ✅ `npm run test:build` passes
- [ ] ✅ `npm run check:env` shows all required vars
- [ ] ✅ `npm run test:db` all 9 tests pass
- [ ] ✅ Can sign up with new email
- [ ] ✅ Can sign in with test account
- [ ] ✅ Dashboard loads without errors
- [ ] ✅ Settings page works
- [ ] ✅ Can update profile name
- [ ] ✅ Can change timezone
- [ ] ✅ Can toggle notifications
- [ ] ✅ Can sign out

---

## 📚 Test Files Location

- `scripts/test-all.ts` - Database test suite (9 tests)
- `scripts/test-build.ts` - Build test script
- `scripts/check-env.ts` - Environment validation
- `scripts/setup.sh` - One-command setup
- `prisma/seed.ts` - Database seeding

---

## 🚀 Automated Testing (CI/CD)

To run tests in CI/CD (GitHub Actions, etc.):

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:build
      # Database tests would need a test database
```

---

## 💡 Pro Tips

1. **Run build test first** (fastest, no setup):
   ```bash
   npm run test:build
   ```

2. **Use Prisma Studio** to visually check test data:
   ```bash
   npm run db:studio
   ```

3. **Reset and reseed** if data gets messy:
   ```bash
   npm run db:reset && npm run db:seed
   ```

4. **Check environment** if anything breaks:
   ```bash
   npm run check:env
   ```

5. **Run linter** before committing:
   ```bash
   npm run lint && npm run format
   ```

---

## ✅ Success Criteria

All tests pass when you see:

```
✅ Build successful!
✅ All required environment variables are set!
✅ Passed: 9
❌ Failed: 0
📈 Success Rate: 100.0%
🎉 All tests passed!
```

You're ready to deploy! 🚀

