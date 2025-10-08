# 🧪 Testing Guide - Task 1 & 2 Complete

This guide will walk you through testing all the features we've implemented in **Task 1.0** (Authentication & Settings) and **Task 2.0** (Database & Seed Data).

---

## 📋 Prerequisites

Before testing, ensure you have:
- ✅ `.env` file configured with `DATABASE_URL` and `NEXTAUTH_SECRET`
- ✅ Database seeded (run `npm run db:seed` if not already done)
- ✅ Dependencies installed (`npm install`)

---

## 🚀 Step 1: Start the Development Server

```bash
cd /home/ugrads/majors/arnavpant27/CareerPilot/careerpilot
npm run dev
```

**Expected Output:**
```
> careerpilot@0.1.0 dev
> next dev

  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Environment:  development

 ✓ Starting...
 ✓ Ready in 2.3s
```

The server is now running at **http://localhost:3000**

---

## 🧪 Part 1: Testing Authentication (Task 1.0)

### Test 1.1: Sign In with Email/Password

1. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

2. **Expected Behavior:**
   - You should be **automatically redirected** to `/signin` (because you're not authenticated)
   - You'll see a beautiful **glassmorphism sign-in form** with:
     - CareerPilot logo (briefcase icon with gradient)
     - "Welcome Back" heading
     - Email input field
     - Password input field
     - "Sign In" button (gradient blue-to-indigo)
     - "Or continue with" divider
     - "Continue with Google" button
     - "Don't have an account? Sign up" link at bottom

3. **Enter Test Credentials:**
   ```
   Email: test@example.com
   Password: password123
   ```

4. **Click "Sign In"**

5. **Expected Result:**
   - ✅ Green toast notification: "Welcome back!"
   - ✅ Redirect to `/dashboard`
   - ✅ You'll see a welcome message with your name: "Hello, Alex Johnson!" or "test@example.com"
   - ✅ Dashboard shows placeholder roadmap for upcoming features

**Screenshot What You'll See:**
```
╔════════════════════════════════════════════════════════╗
║  🎉 Welcome to CareerPilot! 🚀                         ║
║                                                        ║
║  Hello, Alex Johnson!                                  ║
║                                                        ║
║  Your dashboard is being built. Here's what's coming   ║
║  next:                                                 ║
║                                                        ║
║  • Analytics and KPI cards                            ║
║  • Application pipeline (Kanban board)                ║
║  • Table view with filters                            ║
║  • Calendar for interviews and tasks                  ║
║  • Email integrations for auto-tracking               ║
╚════════════════════════════════════════════════════════╝
```

---

### Test 1.2: Sign Out and Try Invalid Credentials

1. **Sign Out:**
   - Currently, there's no sign-out button in the UI yet
   - Manually navigate to: `http://localhost:3000/api/auth/signout`
   - Or clear your cookies

2. **Try Invalid Login:**
   ```
   Email: test@example.com
   Password: wrongpassword
   ```

3. **Expected Result:**
   - ❌ Red toast notification: "Invalid email or password"
   - ❌ Stays on sign-in page

---

### Test 1.3: Sign Up New Account

1. **Navigate to Sign Up:**
   - Click "Sign up" link at bottom of sign-in page
   - Or go directly to: `http://localhost:3000/signup`

2. **You'll See:**
   - "Join CareerPilot" heading
   - Full Name input
   - Email input
   - Password input
   - "Sign Up" button (gradient)
   - "Already have an account? Sign in" link

3. **Create New Account:**
   ```
   Full Name: Test User 2
   Email: testuser2@example.com
   Password: securepass123
   ```

4. **Click "Sign Up"**

5. **Expected Result:**
   - ✅ Green toast: "Account created successfully! Please sign in."
   - ✅ Redirect to `/signin` page
   - ✅ New user created in database

6. **Sign In with New Credentials:**
   ```
   Email: testuser2@example.com
   Password: securepass123
   ```

7. **Expected Result:**
   - ✅ Successfully signed in
   - ✅ See welcome dashboard

---

### Test 1.4: Google OAuth (Optional - Requires Setup)

1. **Click "Continue with Google"** on sign-in page

2. **If Google OAuth is configured:**
   - Redirects to Google consent screen
   - After approval, redirects back to `/dashboard`

3. **If NOT configured** (no `GOOGLE_CLIENT_ID` in `.env`):
   - Error page or redirect back to sign-in
   - This is expected if you haven't set up Google OAuth

---

### Test 1.5: Route Protection

1. **While Signed OUT, try accessing protected routes:**
   ```
   http://localhost:3000/dashboard
   http://localhost:3000/settings
   ```

2. **Expected Result:**
   - ✅ Automatically redirected to `/signin?from=/dashboard`
   - ✅ After signing in, redirected back to original page

3. **While Signed IN, try accessing auth routes:**
   ```
   http://localhost:3000/signin
   http://localhost:3000/signup
   ```

4. **Expected Result:**
   - ✅ Automatically redirected to `/dashboard`
   - ✅ Can't access sign-in/sign-up while authenticated

---

### Test 1.6: Settings Page (Task 1.5)

1. **While Signed IN, navigate to:**
   ```
   http://localhost:3000/settings
   ```

2. **You'll See 4 Sections:**

   **Section 1: Profile Information**
   - Your name in an input field
   - "Save Changes" button
   - Try changing your name and clicking "Save Changes"
   - ✅ Green toast: "Profile updated successfully!"

   **Section 2: Timezone Settings**
   - Dropdown with timezone options grouped by region
   - US & Canada, Europe, Asia Pacific, etc.
   - Try changing timezone and clicking "Save Changes"
   - ✅ Green toast: "Timezone updated successfully!"

   **Section 3: Notification Preferences**
   - Toggle switches for:
     - In-App Notifications (default: ON)
     - Email Notifications (default: ON)
     - Slack Notifications (default: OFF)
     - Discord Notifications (default: OFF)
   - When you enable Slack/Discord, webhook URL fields appear
   - Try toggling and clicking "Save Changes"
   - ✅ Green toast: "Notification settings updated!"

   **Section 4: Data Retention Policy**
   - Dropdown with options:
     - Keep Forever
     - 90 Days
     - 180 Days (6 Months)
     - 365 Days (1 Year)
     - 730 Days (2 Years)
     - 1095 Days (3 Years)
   - Try changing and clicking "Save Changes"
   - ✅ Green toast: "Data retention policy updated!"

3. **Test Validation:**
   - Try enabling Slack notifications without entering webhook URL
   - ❌ Red toast: "Slack webhook URL is required when Slack notifications are enabled"

---

## 🗄️ Part 2: Testing Database & Seed Data (Task 2.0)

### Test 2.1: Verify Database Connection

```bash
npm run db:studio
```

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Prisma Studio is up on http://localhost:5555
```

**Open Prisma Studio:** `http://localhost:5555`

You'll see a database browser with all your models in the left sidebar:
- User
- Company
- Contact
- Application
- ApplicationContact
- Interview
- InterviewPanelMember
- Task
- Offer
- Activity
- Attachment
- EmailConnection
- ShareLink
- AuditLog

---

### Test 2.2: Explore Seeded Data

**In Prisma Studio, click on each model to see the data:**

#### **User Model** (2 records)
```
1. test@example.com (Alex Johnson)
   - timezone: America/New_York
   - notifyInApp: true
   - notifyEmail: true
   - dataRetentionDays: 365

2. demo@careerpilot.com (Sarah Chen)
   - timezone: America/Los_Angeles
   - notifyInApp: true
   - notifySlack: true
   - slackWebhook: https://hooks.slack.com/services/example
   - dataRetentionDays: 180
```

#### **Company Model** (5 records)
```
1. TechCorp Inc. (Technology, 1000-5000 employees)
2. DataWorks AI (Artificial Intelligence, 100-500 employees)
3. CloudScale Solutions (Cloud Infrastructure, 5000+)
4. FinTech Innovations (Financial Technology, 500-1000)
5. DevTools Pro (Developer Tools, 50-100)
```

#### **Application Model** (7 records - ALL STAGES)
```
1. DISCOVERED - Staff Engineer at CloudScale
2. APPLIED - Developer Advocate at DevTools Pro
3. PHONE_SCREEN - Backend Engineer at FinTech Innovations
4. TECHNICAL - Cloud Infrastructure Engineer at CloudScale
5. ONSITE - ML Engineer at DataWorks AI
6. OFFER - Senior Full Stack at TechCorp ⭐
7. REJECTED - Senior DevOps at TechCorp
```

#### **Interview Model** (4 records)
```
1. Final Round (TechCorp) - PASSED ✅
2. Onsite Day 1 (DataWorks) - PENDING (scheduled for tomorrow)
3. Technical Screen (CloudScale) - PASSED ✅
4. Recruiter Screen (FinTech) - PENDING (next week)
```

#### **Task Model** (5 records)
```
1. URGENT - Review and sign offer letter (TechCorp) ⏰
2. HIGH - Prepare for onsite interview (DataWorks)
3. MEDIUM - Send thank you email (CloudScale) ✅ COMPLETED
4. MEDIUM - Follow up with recruiter (DevTools Pro)
5. LOW - Update resume for staff role (CloudScale)
```

#### **Offer Model** (1 record)
```
TechCorp Senior Full Stack Engineer:
- Base Salary: $165,000
- Bonus: $20,000
- Equity: 0.15% (15,000 shares vesting over 4 years)
- Currency: USD
- Benefits: Full health/dental/vision, 401k 6% match, unlimited PTO, $2000 learning budget
- Decision: PENDING
```

#### **Activity Model** (9 records - Timeline for TechCorp Application)
```
2024-01-15: Application created
2024-01-15: Stage changed from DISCOVERED to APPLIED
2024-01-22: Stage changed from APPLIED to PHONE_SCREEN
2024-01-25: Technical interview scheduled
2024-01-28: Stage changed from PHONE_SCREEN to TECHNICAL
2024-02-01: Technical interview completed - Passed
2024-02-05: Stage changed from TECHNICAL to ONSITE
2024-02-10: Stage changed from ONSITE to OFFER
2024-02-10: Received offer: $165k base + $20k bonus + 0.15% equity
```

---

### Test 2.3: Verify Relationships

**Click on Application #1 (TechCorp Senior Full Stack):**

You should see related data:
- **company** → TechCorp Inc.
- **user** → Alex Johnson (test@example.com)
- **contacts** (2) → Emily Rodriguez (Hiring Manager), Michael Park (Recruiter)
- **interviews** (1) → Final Round
- **tasks** (1) → Review and sign offer letter
- **offer** (1) → Full compensation details
- **activities** (9) → Complete timeline
- **attachments** (2) → techcorp-offer-letter.pdf, my-resume-2024.pdf

**This verifies ALL relationships are working!** ✅

---

### Test 2.4: Verify Cascade Deletes

**⚠️ WARNING: This is destructive. Only do this in development!**

1. **In Prisma Studio, go to User model**
2. **Find the user: testuser2@example.com** (the one you just created)
3. **Click the red delete icon**
4. **Confirm deletion**

**Expected Result:**
- ✅ User deleted
- ✅ All related data deleted (applications, companies, contacts, etc.)
- ✅ No orphaned records left behind

**Verify by checking other models - they should have no records for that user.**

---

### Test 2.5: Run Automated Tests

**Test Relations & Cascading:**
```bash
npm run test:relations
```

**Expected Output:**
```
🧪 CareerPilot Relations & Cascading Test Suite
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ User Cascade Delete - All related records deleted
✅ Application Cascade Delete - Related records deleted, user/company preserved
✅ Contact SetNull - companyId set to null on company delete
✅ Unique Email Constraint - Duplicate email correctly rejected
✅ Many-to-Many Relation - Application linked to 2 contacts correctly
✅ Indexed Queries - Queries executed in 37ms
✅ Enum Constraints - All enum values stored correctly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Test Results Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Tests: 7
✅ Passed: 7
❌ Failed: 0
⏱️  Total Duration: 2446ms
📈 Success Rate: 100.0%

🎉 All relation tests passed!
```

**Test Database Connection:**
```bash
npm run test:db
```

**Test Build:**
```bash
npm run test:build
```

**Run All Tests:**
```bash
npm run test:all
```

---

## 🎯 What You Should See - Quick Checklist

### ✅ Task 1.0 Verification Checklist

- [ ] Can sign in with test@example.com / password123
- [ ] Can sign up with new email
- [ ] Invalid credentials show error toast
- [ ] Protected routes redirect to /signin
- [ ] Signed-in users can't access /signin or /signup
- [ ] Settings page loads all 4 sections
- [ ] Can update profile name
- [ ] Can change timezone
- [ ] Can toggle notification preferences
- [ ] Can set data retention policy
- [ ] Validation works (e.g., Slack webhook required)

### ✅ Task 2.0 Verification Checklist

- [ ] Database has 2 users
- [ ] Database has 5 companies
- [ ] Database has 5 contacts
- [ ] Database has 7 applications (all stages represented)
- [ ] Database has 4 interviews
- [ ] Database has 5 tasks
- [ ] Database has 1 offer with full compensation
- [ ] Database has 9 activities showing timeline
- [ ] Database has 4 attachments
- [ ] Prisma Studio shows all relationships correctly
- [ ] Can click through related data (Application → Company → User)
- [ ] All automated tests pass (7/7)

---

## 🐛 Troubleshooting

### Issue: "Database URL not found"
**Solution:**
```bash
npm run check:env
```
Make sure `.env` has `DATABASE_URL` set correctly.

### Issue: "Can't connect to database"
**Solution:**
- Check your Neon database is active (doesn't auto-sleep)
- Verify connection string has `?sslmode=require`
- Run `npm run db:push` to sync schema

### Issue: "No seed data in database"
**Solution:**
```bash
npm run db:seed
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Issue: "NextAuth URL mismatch"
**Solution:**
Make sure `.env` has:
```
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📸 Expected Screenshots

### 1. Sign-In Page
- Dark gradient background
- Frosted glass card in center
- Blue briefcase icon
- "Welcome Back" heading
- Email and password inputs
- Gradient "Sign In" button
- Google sign-in button
- "Sign up" link at bottom

### 2. Dashboard Page
- "Welcome to CareerPilot! 🚀" heading
- User greeting: "Hello, Alex Johnson!"
- Roadmap list of upcoming features
- Glassmorphism card style

### 3. Settings Page
- 4 distinct sections with icons:
  - 👤 Profile Information (blue icon)
  - 🌍 Timezone Settings (green icon)
  - 🔔 Notification Preferences (purple icon)
  - 📦 Data Retention Policy (orange icon)
- Toggle switches for notifications
- "Save Changes" buttons per section

### 4. Prisma Studio
- Clean white interface
- Left sidebar with all 14 models
- Table view with data
- Relationship icons showing connected data

---

## 🎉 Success Criteria

If you can complete all the tests above and see the expected results, then **Task 1.0 and Task 2.0 are fully working!** 🚀

**You should be able to:**
1. ✅ Sign up, sign in, sign out
2. ✅ Access protected routes only when authenticated
3. ✅ Update user settings (profile, timezone, notifications, retention)
4. ✅ See all seeded data in Prisma Studio
5. ✅ Navigate through relationships in database
6. ✅ Have all 7 automated tests passing
7. ✅ See realistic application pipeline with all stages
8. ✅ View detailed offer, interviews, tasks, and activities

---

## 🚀 Next Steps

After verifying everything works:

1. **Keep the dev server running** for ongoing development
2. **Keep Prisma Studio open** for database exploration
3. **Move to Task 3.0** - Build CRUD APIs for applications, companies, contacts, etc.
4. **Then Task 4.0** - Build the beautiful UI (Kanban board, table, calendar, analytics)

---

## 💡 Pro Tips

1. **Use Prisma Studio frequently** - It's the best way to visualize your data
2. **Check the browser console** - Useful for debugging API calls
3. **Watch the terminal** - Next.js logs show route access and errors
4. **Use toast notifications** - They confirm all actions worked
5. **Test in incognito** - Ensures clean state without cached auth

---

**Happy Testing! 🧪✨**

If anything doesn't work as expected, check the terminal logs for errors and verify your `.env` configuration.
