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

  // Create sample data for user1 (test@example.com)
  console.log("\n🏢 Creating sample companies for test user...")

  const company1 = await prisma.company.create({
    data: {
      userId: user1.id,
      name: "Google",
      website: "https://careers.google.com",
      industry: "Technology",
      size: "10000+",
      locations: ["Mountain View, CA", "New York, NY", "Seattle, WA"],
      notes: "Dream company! Strong engineering culture.",
    },
  })

  const company2 = await prisma.company.create({
    data: {
      userId: user1.id,
      name: "Meta",
      website: "https://www.metacareers.com",
      industry: "Technology",
      size: "10000+",
      locations: ["Menlo Park, CA", "New York, NY"],
      notes: "Innovative work in AR/VR and social platforms.",
    },
  })

  const company3 = await prisma.company.create({
    data: {
      userId: user1.id,
      name: "Stripe",
      website: "https://stripe.com/jobs",
      industry: "Fintech",
      size: "1000-5000",
      locations: ["San Francisco, CA", "Remote"],
      notes: "Payment infrastructure. Remote-friendly.",
    },
  })

  const company4 = await prisma.company.create({
    data: {
      userId: user1.id,
      name: "Anthropic",
      website: "https://www.anthropic.com/careers",
      industry: "AI Research",
      size: "100-500",
      locations: ["San Francisco, CA"],
      notes: "AI safety and research. Cutting-edge work.",
    },
  })

  const company5 = await prisma.company.create({
    data: {
      userId: user1.id,
      name: "Vercel",
      website: "https://vercel.com/careers",
      industry: "Developer Tools",
      size: "100-500",
      locations: ["Remote"],
      notes: "Next.js creators. Fully remote.",
    },
  })

  console.log(`✅ Created 5 companies`)

  // Create contacts
  console.log("\n👥 Creating sample contacts...")

  const contact1 = await prisma.contact.create({
    data: {
      userId: user1.id,
      companyId: company1.id,
      name: "Sarah Chen",
      email: "sarah.chen@google.com",
      role: "Senior Technical Recruiter",
      relationship: "Recruiter",
      notes: "Reached out on LinkedIn. Very responsive.",
    },
  })

  const contact2 = await prisma.contact.create({
    data: {
      userId: user1.id,
      companyId: company2.id,
      name: "Michael Rodriguez",
      email: "mrodriguez@meta.com",
      role: "Engineering Manager",
      relationship: "Hiring Manager",
      notes: "Interviewed with him for the backend role.",
    },
  })

  const contact3 = await prisma.contact.create({
    data: {
      userId: user1.id,
      companyId: company3.id,
      name: "Emily Thompson",
      email: "emily@stripe.com",
      role: "Recruiter",
      relationship: "Recruiter",
    },
  })

  console.log(`✅ Created 3 contacts`)

  // Create applications with different stages
  console.log("\n📝 Creating sample applications...")

  // Application 1: Google - ONSITE stage
  const app1 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: company1.id,
      roleTitle: "Senior Software Engineer",
      location: "Mountain View, CA",
      employmentType: "Full-time",
      source: "LinkedIn",
      postingUrl: "https://careers.google.com/jobs/123456",
      stage: "ONSITE",
      status: "ACTIVE",
      salaryMin: 180000,
      salaryMax: 250000,
      salaryCurrency: "USD",
      notes: "Exciting role working on distributed systems. Team seems great!",
      appliedAt: new Date("2025-01-15"),
    },
  })

  // Link contact to application
  await prisma.applicationContact.create({
    data: {
      applicationId: app1.id,
      contactId: contact1.id,
      role: "Recruiter",
    },
  })

  // Application 2: Meta - TECHNICAL stage
  const app2 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: company2.id,
      roleTitle: "Backend Engineer",
      location: "Menlo Park, CA",
      employmentType: "Full-time",
      source: "Referral",
      stage: "TECHNICAL",
      status: "ACTIVE",
      salaryMin: 170000,
      salaryMax: 230000,
      notes: "Referred by college friend. Focus on infrastructure.",
      appliedAt: new Date("2025-01-20"),
    },
  })

  await prisma.applicationContact.create({
    data: {
      applicationId: app2.id,
      contactId: contact2.id,
      role: "Hiring Manager",
    },
  })

  // Application 3: Stripe - PHONE_SCREEN stage
  const app3 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: company3.id,
      roleTitle: "Full Stack Engineer",
      location: "Remote",
      employmentType: "Full-time",
      source: "Company Website",
      postingUrl: "https://stripe.com/jobs/listing/123",
      stage: "PHONE_SCREEN",
      status: "ACTIVE",
      salaryMin: 150000,
      salaryMax: 200000,
      notes: "Remote position. Phone screen scheduled for next week.",
      appliedAt: new Date("2025-01-25"),
    },
  })

  await prisma.applicationContact.create({
    data: {
      applicationId: app3.id,
      contactId: contact3.id,
      role: "Recruiter",
    },
  })

  // Application 4: Anthropic - APPLIED stage
  const app4 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: company4.id,
      roleTitle: "ML Engineer",
      location: "San Francisco, CA",
      employmentType: "Full-time",
      source: "LinkedIn",
      stage: "APPLIED",
      status: "ACTIVE",
      notes: "Just submitted application. Very interested in AI safety work.",
      appliedAt: new Date("2025-02-01"),
    },
  })

  // Application 5: Vercel - OFFER stage
  const app5 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: company5.id,
      roleTitle: "Developer Advocate",
      location: "Remote",
      employmentType: "Full-time",
      source: "Twitter",
      stage: "OFFER",
      status: "ACTIVE",
      salaryMin: 140000,
      salaryMax: 180000,
      notes: "Received offer! Need to decide by Feb 15th.",
      appliedAt: new Date("2025-01-10"),
    },
  })

  console.log(`✅ Created 5 applications across different stages`)

  // Create interviews
  console.log("\n🎯 Creating sample interviews...")

  const interview1 = await prisma.interview.create({
    data: {
      userId: user1.id,
      applicationId: app1.id,
      roundName: "Phone Screen",
      type: "PHONE",
      outcome: "PASSED",
      scheduledAt: new Date("2025-01-22T10:00:00Z"),
      duration: 45,
      notes: "Went well! Discussed system design and past projects.",
      instructions: "Call with recruiter to discuss background and role fit.",
    },
  })

  const interview2 = await prisma.interview.create({
    data: {
      userId: user1.id,
      applicationId: app1.id,
      roundName: "Technical Interview",
      type: "TECHNICAL",
      outcome: "PASSED",
      scheduledAt: new Date("2025-01-29T14:00:00Z"),
      duration: 60,
      location: "Google Meet",
      notes: "Coding challenge on distributed systems. Solved all problems.",
      instructions: "1-hour technical interview with senior engineer. Expect DSA and system design.",
    },
  })

  const interview3 = await prisma.interview.create({
    data: {
      userId: user1.id,
      applicationId: app1.id,
      roundName: "Onsite - Round 1",
      type: "ONSITE",
      outcome: "PENDING",
      scheduledAt: new Date("2025-02-08T09:00:00Z"),
      duration: 360,
      location: "Google Mountain View Campus",
      notes: "Full day onsite. 4 rounds back-to-back.",
      instructions: "Report to Building 43. Bring ID. Lunch provided.",
    },
  })

  const interview4 = await prisma.interview.create({
    data: {
      userId: user1.id,
      applicationId: app2.id,
      roundName: "Phone Screen",
      type: "PHONE",
      outcome: "PASSED",
      scheduledAt: new Date("2025-01-27T15:00:00Z"),
      duration: 30,
      notes: "Quick intro call. Technical round scheduled.",
    },
  })

  const interview5 = await prisma.interview.create({
    data: {
      userId: user1.id,
      applicationId: app2.id,
      roundName: "Technical Round",
      type: "TECHNICAL",
      outcome: "PENDING",
      scheduledAt: new Date("2025-02-10T11:00:00Z"),
      duration: 90,
      location: "Zoom",
      instructions: "Live coding session. Review data structures and algorithms.",
    },
  })

  const interview6 = await prisma.interview.create({
    data: {
      userId: user1.id,
      applicationId: app3.id,
      roundName: "Recruiter Screen",
      type: "PHONE",
      outcome: "PENDING",
      scheduledAt: new Date("2025-02-12T13:00:00Z"),
      duration: 30,
      location: "Phone",
      notes: "Initial screening with Emily.",
    },
  })

  console.log(`✅ Created 6 interviews`)

  // Add interview panel members
  // Link some to existing contacts
  await prisma.interviewPanelMember.create({
    data: {
      interviewId: interview1.id,
      contactId: contact1.id, // Sarah Chen from contacts
      name: "Sarah Chen",
      role: "Recruiter",
    },
  })

  await prisma.interviewPanelMember.create({
    data: {
      interviewId: interview2.id,
      name: "David Park",
      role: "Senior Software Engineer",
    },
  })

  await prisma.interviewPanelMember.create({
    data: {
      interviewId: interview3.id,
      name: "Lisa Wang",
      role: "Engineering Manager",
    },
  })

  await prisma.interviewPanelMember.create({
    data: {
      interviewId: interview3.id,
      name: "James Liu",
      role: "Staff Engineer",
    },
  })

  await prisma.interviewPanelMember.create({
    data: {
      interviewId: interview4.id,
      contactId: contact2.id, // Michael Rodriguez from contacts
      name: "Michael Rodriguez",
      role: "Engineering Manager",
    },
  })

  await prisma.interviewPanelMember.create({
    data: {
      interviewId: interview6.id,
      contactId: contact3.id, // Emily Thompson from contacts
      name: "Emily Thompson",
      role: "Recruiter",
    },
  })

  console.log(`✅ Added interview panel members`)

  // Create tasks/reminders
  console.log("\n✅ Creating sample tasks...")

  const task1 = await prisma.task.create({
    data: {
      userId: user1.id,
      applicationId: app1.id,
      interviewId: interview3.id,
      title: "Prepare for Google onsite",
      description: "Review system design, practice coding problems, research team",
      priority: "HIGH",
      status: "IN_PROGRESS",
      dueDate: new Date("2025-02-07T00:00:00Z"),
    },
  })

  const task2 = await prisma.task.create({
    data: {
      userId: user1.id,
      applicationId: app2.id,
      title: "Follow up with Michael",
      description: "Send thank you email after phone screen",
      priority: "MEDIUM",
      status: "COMPLETED",
      dueDate: new Date("2025-01-28T00:00:00Z"),
      completedAt: new Date("2025-01-28T14:30:00Z"),
    },
  })

  const task3 = await prisma.task.create({
    data: {
      userId: user1.id,
      applicationId: app3.id,
      title: "Research Stripe engineering blog",
      description: "Read recent posts to prepare for interview",
      priority: "MEDIUM",
      status: "PENDING",
      dueDate: new Date("2025-02-11T00:00:00Z"),
    },
  })

  const task4 = await prisma.task.create({
    data: {
      userId: user1.id,
      applicationId: app5.id,
      title: "Respond to Vercel offer",
      description: "Need to accept or decline by Feb 15th",
      priority: "URGENT",
      status: "PENDING",
      dueDate: new Date("2025-02-15T00:00:00Z"),
    },
  })

  const task5 = await prisma.task.create({
    data: {
      userId: user1.id,
      applicationId: app4.id,
      title: "Follow up on Anthropic application",
      description: "Check status if no response by Feb 8th",
      priority: "LOW",
      status: "PENDING",
      dueDate: new Date("2025-02-08T00:00:00Z"),
    },
  })

  console.log(`✅ Created 5 tasks`)

  // Create offer for app5
  console.log("\n💰 Creating sample offer...")

  const offer1 = await prisma.offer.create({
    data: {
      applicationId: app5.id,
      baseSalary: 160000,
      bonus: 20000,
      equity: "0.05% (5000 shares)",
      benefits: "Health, dental, vision, 401k, unlimited PTO, home office stipend",
      location: "Remote",
      deadline: new Date("2025-02-15"),
      decision: "PENDING",
      notes: "Great offer! Proposed start date: March 1, 2025. Need to negotiate equity slightly.",
    },
  })

  console.log(`✅ Created 1 offer`)

  // Create activity timeline
  console.log("\n📜 Creating activity timeline...")

  await prisma.activity.createMany({
    data: [
      {
        userId: user1.id,
        applicationId: app1.id,
        type: "CREATED",
        description: "Application created for Senior Software Engineer at Google",
      },
      {
        userId: user1.id,
        applicationId: app1.id,
        type: "STAGE_CHANGED",
        description: "Stage changed from DISCOVERED to APPLIED",
        metadata: JSON.stringify({ from: "DISCOVERED", to: "APPLIED" }),
      },
      {
        userId: user1.id,
        applicationId: app1.id,
        type: "INTERVIEW_SCHEDULED",
        description: "Phone Screen scheduled with Sarah Chen",
      },
      {
        userId: user1.id,
        applicationId: app1.id,
        type: "INTERVIEW_COMPLETED",
        description: "Phone Screen completed - PASSED",
      },
      {
        userId: user1.id,
        applicationId: app1.id,
        type: "STAGE_CHANGED",
        description: "Stage changed from APPLIED to TECHNICAL",
        metadata: JSON.stringify({ from: "APPLIED", to: "TECHNICAL" }),
      },
      {
        userId: user1.id,
        applicationId: app1.id,
        type: "INTERVIEW_SCHEDULED",
        description: "Technical Interview scheduled",
      },
      {
        userId: user1.id,
        applicationId: app1.id,
        type: "INTERVIEW_COMPLETED",
        description: "Technical Interview completed - PASSED",
      },
      {
        userId: user1.id,
        applicationId: app1.id,
        type: "STAGE_CHANGED",
        description: "Stage changed from TECHNICAL to ONSITE",
        metadata: JSON.stringify({ from: "TECHNICAL", to: "ONSITE" }),
      },
      {
        userId: user1.id,
        applicationId: app5.id,
        type: "CREATED",
        description: "Application created for Developer Advocate at Vercel",
      },
      {
        userId: user1.id,
        applicationId: app5.id,
        type: "STAGE_CHANGED",
        description: "Stage changed to OFFER",
        metadata: JSON.stringify({ from: "PHONE_SCREEN", to: "OFFER" }),
      },
      {
        userId: user1.id,
        applicationId: app5.id,
        type: "OFFER_RECEIVED",
        description: "Offer received: $160k base + $20k bonus + 0.05% equity (5000 shares)",
      },
    ],
  })

  console.log(`✅ Created activity timeline`)

  // Create email connection (sample)
  console.log("\n📧 Creating sample email connection...")

  await prisma.emailConnection.create({
    data: {
      userId: user1.id,
      provider: "GMAIL",
      email: "test@example.com",
      accessToken: "sample_token_encrypted",
      refreshToken: "sample_refresh_token_encrypted",
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      scope: "https://www.googleapis.com/auth/gmail.readonly",
      labels: ["INBOX", "Jobs"],
    },
  })

  console.log(`✅ Created email connection`)

  console.log("\n📊 Seed Summary:")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`Users: 5`)
  console.log(`Companies: 5`)
  console.log(`Contacts: 3`)
  console.log(`Applications: 5 (across all stages)`)
  console.log(`  - APPLIED: 1`)
  console.log(`  - PHONE_SCREEN: 1`)
  console.log(`  - TECHNICAL: 1`)
  console.log(`  - ONSITE: 1`)
  console.log(`  - OFFER: 1`)
  console.log(`Interviews: 6`)
  console.log(`Tasks: 5`)
  console.log(`Offers: 1`)
  console.log(`Activities: 11`)
  console.log(`Email Connections: 1`)
  console.log("\n🔑 Test Credentials:")
  console.log("  1. test@example.com / password123 (has sample data)")
  console.log("  2. demo@careerpilot.com / password456")
  console.log("  3. minimal@example.com / secure123")
  console.log("  4. notifications@example.com / testpass789")
  console.log("  5. oauth@example.com (OAuth only, no password)")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("\n✨ Database seeded successfully with comprehensive sample data!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

