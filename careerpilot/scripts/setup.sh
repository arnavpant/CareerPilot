#!/bin/bash

# CareerPilot Setup Script
# This script helps you set up the project for the first time

echo "🚀 CareerPilot Setup"
echo "===================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file exists"
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your DATABASE_URL and NEXTAUTH_SECRET"
    echo ""
    echo "To get a free database:"
    echo "  1. Visit https://neon.tech"
    echo "  2. Sign up and create a project"
    echo "  3. Copy the connection string to .env"
    echo ""
    echo "To generate NEXTAUTH_SECRET:"
    echo "  openssl rand -base64 32"
    echo ""
    read -p "Press Enter once you've updated .env..."
fi

echo ""
echo "🔍 Checking environment variables..."
npm run check:env

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Setup incomplete. Please update your .env file."
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
echo "Running: npx prisma db push"
npx prisma db push --accept-data-loss

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Database setup failed. Check your DATABASE_URL in .env"
    exit 1
fi

echo ""
echo "🌱 Seeding database with test data..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Seeding failed, but you can continue"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "  1. Run tests:"
echo "     npm run test:all"
echo ""
echo "  2. Start development server:"
echo "     npm run dev"
echo ""
echo "  3. Visit http://localhost:3000"
echo ""
echo "  4. Sign in with test account:"
echo "     Email: test@example.com"
echo "     Password: password123"
echo ""
echo "📚 For more info, see README.md and TESTING.md"
echo ""

