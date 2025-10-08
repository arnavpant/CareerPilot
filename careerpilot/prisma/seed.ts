import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Clean up existing data
  console.log("🧹 Cleaning up existing data...")
  await prisma.user.deleteMany()

  console.log("👤 Creating test users...")

  // Create test user 1: Email/Password user
  const password1 = await hash("password123", 10)
  const user1 = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      password: password1,
      timezone: "America/New_York",
      notifyInApp: true,
      notifyEmail: true,
      notifySlack: false,
      notifyDiscord: false,
      dataRetentionDays: 365,
    },
  })
  console.log(`✅ Created user: ${user1.email}`)

  // Create test user 2: Another email/password user with different settings
  const password2 = await hash("password456", 10)
  const user2 = await prisma.user.create({
    data: {
      email: "demo@careerpilot.com",
      name: "Demo User",
      password: password2,
      timezone: "America/Los_Angeles",
      notifyInApp: true,
      notifyEmail: false,
      notifySlack: true,
      notifyDiscord: false,
      slackWebhook: "https://hooks.slack.com/services/example",
      dataRetentionDays: 180,
    },
  })
  console.log(`✅ Created user: ${user2.email}`)

  // Create test user 3: User with minimal notifications
  const password3 = await hash("secure123", 10)
  const user3 = await prisma.user.create({
    data: {
      email: "minimal@example.com",
      name: "Minimal User",
      password: password3,
      timezone: "UTC",
      notifyInApp: false,
      notifyEmail: false,
      notifySlack: false,
      notifyDiscord: false,
      dataRetentionDays: null, // Keep forever
    },
  })
  console.log(`✅ Created user: ${user3.email}`)

  // Create test user 4: User with all notifications enabled
  const password4 = await hash("testpass789", 10)
  const user4 = await prisma.user.create({
    data: {
      email: "notifications@example.com",
      name: "Notification Lover",
      password: password4,
      timezone: "Europe/London",
      notifyInApp: true,
      notifyEmail: true,
      notifySlack: true,
      notifyDiscord: true,
      slackWebhook: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX",
      discordWebhook: "https://discord.com/api/webhooks/000000000000000000/XXXXXXXXXXXXXXXXXXXX",
      dataRetentionDays: 90,
    },
  })
  console.log(`✅ Created user: ${user4.email}`)

  // Create OAuth user (no password)
  const user5 = await prisma.user.create({
    data: {
      email: "oauth@example.com",
      name: "OAuth User",
      password: null, // OAuth users don't have passwords
      emailVerified: new Date(),
      timezone: "Asia/Tokyo",
      notifyInApp: true,
      notifyEmail: true,
      dataRetentionDays: 730,
    },
  })
  console.log(`✅ Created OAuth user: ${user5.email}`)

  console.log("\n📊 Seed Summary:")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`Total Users Created: 5`)
  console.log("\nTest Credentials:")
  console.log("  1. test@example.com / password123")
  console.log("  2. demo@careerpilot.com / password456")
  console.log("  3. minimal@example.com / secure123")
  console.log("  4. notifications@example.com / testpass789")
  console.log("  5. oauth@example.com (OAuth only, no password)")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("\n✨ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

