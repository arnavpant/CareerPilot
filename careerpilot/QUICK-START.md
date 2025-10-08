# 🚀 CareerPilot Quick Start

## ⚡ TL;DR - Get Running in 5 Minutes

### 1. **Get a Free Database** (2 minutes)

Visit [neon.tech](https://neon.tech) and:
1. Sign up (it's free, no credit card)
2. Create a new project
3. Copy the connection string (looks like `postgresql://username:password@ep-...`)

### 2. **Set Up Environment** (1 minute)

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your database URL
# Also generate a secret: openssl rand -base64 32
nano .env  # or use your favorite editor
```

### 3. **Run the Setup Script** (2 minutes)

```bash
npm run setup
```

This will:
- ✅ Check your environment variables
- ✅ Install dependencies
- ✅ Push database schema
- ✅ Seed test data

### 4. **Start the App**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧪 Testing

### Quick Test (No Database Needed)

```bash
# Test if the build works
npm run test:build
```

### Full Test Suite (Database Required)

```bash
# Check environment
npm run check:env

# Test database operations
npm run test:db

# Run all tests
npm run test:all
```

### Manual Testing

Sign in with test account:
- **Email**: `test@example.com`
- **Password**: `password123`

Explore:
- `/dashboard` - Dashboard page
- `/settings` - Settings with 4 sections

---

## 📝 Environment Variables

Your `.env` file needs these:

```bash
# Database (REQUIRED)
DATABASE_URL="postgresql://..."

# NextAuth (REQUIRED)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="QXJuYXZAMDAyNwo="

# Google OAuth (OPTIONAL)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET="..."
```

---

## 🔧 Available Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
```

### Database
```bash
npm run db:push          # Push schema to database
npm run db:seed          # Seed test data
npm run db:reset         # Reset database (⚠️ deletes data)
npm run db:studio        # Open Prisma Studio (GUI)
```

### Testing
```bash
npm run check:env        # Check environment variables
npm run test:build       # Test build process
npm run test:db          # Test database operations
npm run test:all         # Run all tests
```

### Setup
```bash
npm run setup            # Interactive setup script
```

---

## 🎯 Test Users (After Seeding)

| Email | Password | Features |
|-------|----------|----------|
| `test@example.com` | `password123` | Standard user |
| `demo@careerpilot.com` | `password456` | Has Slack integration |
| `minimal@example.com` | `secure123` | Minimal notifications |
| `notifications@example.com` | `testpass789` | All notifications |
| `oauth@example.com` | (OAuth only) | Google sign-in only |

---

## ❓ Troubleshooting

### "Can't reach database server"
**Solution**: Check your `DATABASE_URL` in `.env`
```bash
npm run check:env
```

### "Invalid credentials" on sign-in
**Solution**: Run the seed script
```bash
npm run db:seed
```

### "User already exists" on signup
**Solution**: Use a different email or reset database
```bash
npm run db:reset
npm run db:seed
```

### Environment variables not loading
**Solution**: Make sure `.env` is in the root directory (same as `package.json`)

### Build errors
**Solution**: Clean and rebuild
```bash
rm -rf .next
npm run build
```

---

## 🎓 Next Steps

1. **Read the docs**:
   - `README.md` - Complete documentation
   - `TESTING.md` - Testing guide
   - `TASK-1-COMPLETE.md` - What was built

2. **Explore the features**:
   - Sign up with a new account
   - Try Google OAuth
   - Update settings (timezone, notifications)
   - Try different test users

3. **Check the database**:
   ```bash
   npm run db:studio
   ```
   Opens a GUI to browse your data

4. **Review the code**:
   - `src/app/(auth)/signin` - Auth pages
   - `src/app/(dashboard)/settings` - Settings page
   - `src/lib/auth` - Auth utilities
   - `prisma/schema.prisma` - Database schema

---

## 🚨 Common Mistakes

❌ **Mistake**: Running `npm run dev` without setting up `.env`  
✅ **Fix**: Run `npm run setup` first

❌ **Mistake**: Using local PostgreSQL without installing it  
✅ **Fix**: Use Neon (free, no installation needed)

❌ **Mistake**: Forgetting to generate `NEXTAUTH_SECRET`  
✅ **Fix**: Run `openssl rand -base64 32` and add to `.env`

❌ **Mistake**: Running tests without seeding  
✅ **Fix**: Run `npm run db:seed` first

---

## 📚 Full Documentation

- **Setup Guide**: `README.md`
- **Testing Guide**: `TESTING.md`
- **Task Summary**: `TASK-1-COMPLETE.md`

---

## 💡 Pro Tips

1. **Use Prisma Studio** to inspect your database:
   ```bash
   npm run db:studio
   ```

2. **Format your code** before committing:
   ```bash
   npm run format
   ```

3. **Test your build** before deploying:
   ```bash
   npm run test:build
   ```

4. **Check environment** if something doesn't work:
   ```bash
   npm run check:env
   ```

---

## 🎉 You're All Set!

Your CareerPilot app is ready to go! 🚀

Questions? Check the docs or the code comments.

Happy coding! ✨

