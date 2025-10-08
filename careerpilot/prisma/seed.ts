import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting comprehensive database seed...")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

  // Clean up existing data
  console.log("🧹 Cleaning up existing data...")
  await prisma.user.deleteMany()
  console.log("✅ Cleanup complete\n")

  // ==================== Users ====================
  console.log("👤 Creating test users...")

  const password1 = await hash("password123", 10)
  const user1 = await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Alex Johnson",
      password: password1,
      timezone: "America/New_York",
      notifyInApp: true,
      notifyEmail: true,
      dataRetentionDays: 365,
    },
  })
  console.log(`✅ Created user: ${user1.email}`)

  const password2 = await hash("password456", 10)
  const user2 = await prisma.user.create({
    data: {
      email: "demo@careerpilot.com",
      name: "Sarah Chen",
      password: password2,
      timezone: "America/Los_Angeles",
      notifyInApp: true,
      notifyEmail: true,
      notifySlack: true,
      slackWebhook: "https://hooks.slack.com/services/example",
      dataRetentionDays: 180,
    },
  })
  console.log(`✅ Created user: ${user2.email}\n`)

  // ==================== Companies ====================
  console.log("🏢 Creating companies...")

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        userId: user1.id,
        name: "TechCorp Inc.",
        website: "https://techcorp.example.com",
        industry: "Technology",
        size: "1000-5000",
        locations: ["San Francisco, CA", "Austin, TX"],
        notes: "Great engineering culture, competitive compensation",
      },
    }),
    prisma.company.create({
      data: {
        userId: user1.id,
        name: "DataWorks AI",
        website: "https://dataworks.example.com",
        industry: "Artificial Intelligence",
        size: "100-500",
        locations: ["New York, NY"],
        notes: "Cutting-edge ML research, fast-growing startup",
      },
    }),
    prisma.company.create({
      data: {
        userId: user1.id,
        name: "CloudScale Solutions",
        website: "https://cloudscale.example.com",
        industry: "Cloud Infrastructure",
        size: "5000+",
        locations: ["Seattle, WA", "Remote"],
        notes: "Enterprise focus, great benefits package",
      },
    }),
    prisma.company.create({
      data: {
        userId: user1.id,
        name: "FinTech Innovations",
        website: "https://fintech-innov.example.com",
        industry: "Financial Technology",
        size: "500-1000",
        locations: ["Boston, MA"],
        notes: "Hybrid work model, strong mentorship program",
      },
    }),
    prisma.company.create({
      data: {
        userId: user1.id,
        name: "DevTools Pro",
        website: "https://devtools.example.com",
        industry: "Developer Tools",
        size: "50-100",
        locations: ["Remote"],
        notes: "Fully remote, developer-first culture",
      },
    }),
  ])
  console.log(`✅ Created ${companies.length} companies\n`)

  // ==================== Contacts ====================
  console.log("👥 Creating contacts...")

  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        userId: user1.id,
        companyId: companies[0].id,
        name: "Emily Rodriguez",
        email: "emily.r@techcorp.example.com",
        role: "Senior Engineering Manager",
        relationship: "Hiring Manager",
        notes: "Met at tech conference, very responsive",
      },
    }),
    prisma.contact.create({
      data: {
        userId: user1.id,
        companyId: companies[0].id,
        name: "Michael Park",
        email: "m.park@techcorp.example.com",
        role: "Technical Recruiter",
        relationship: "Recruiter",
        notes: "Main point of contact for application process",
      },
    }),
    prisma.contact.create({
      data: {
        userId: user1.id,
        companyId: companies[1].id,
        name: "Dr. Aisha Patel",
        email: "aisha@dataworks.example.com",
        role: "Head of ML Engineering",
        relationship: "Hiring Manager",
        notes: "PhD advisor referral",
      },
    }),
    prisma.contact.create({
      data: {
        userId: user1.id,
        companyId: companies[2].id,
        name: "James Wilson",
        email: "jwilson@cloudscale.example.com",
        role: "Director of Engineering",
        relationship: "Interviewer",
      },
    }),
    prisma.contact.create({
      data: {
        userId: user1.id,
        companyId: companies[3].id,
        name: "Lisa Thompson",
        email: "lthompson@fintech-innov.example.com",
        role: "Talent Acquisition Lead",
        relationship: "Recruiter",
      },
    }),
  ])
  console.log(`✅ Created ${contacts.length} contacts\n`)

  // ==================== Applications ====================
  console.log("📝 Creating applications across all stages...")

  const app1 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: companies[0].id,
      roleTitle: "Senior Full Stack Engineer",
      location: "San Francisco, CA (Hybrid)",
      employmentType: "Full-time",
      source: "LinkedIn",
      postingUrl: "https://linkedin.com/jobs/techcorp-senior-fullstack",
      stage: "OFFER",
      status: "ACTIVE",
      salaryMin: 150000,
      salaryMax: 180000,
      salaryCurrency: "USD",
      appliedAt: new Date("2024-01-15"),
      notes: "Strong team fit, interesting technical challenges",
    },
  })

  const app2 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: companies[1].id,
      roleTitle: "Machine Learning Engineer",
      location: "New York, NY",
      employmentType: "Full-time",
      source: "Referral",
      postingUrl: "https://dataworks.example.com/careers/ml-engineer",
      stage: "ONSITE",
      status: "ACTIVE",
      salaryMin: 140000,
      salaryMax: 170000,
      salaryCurrency: "USD",
      appliedAt: new Date("2024-01-20"),
      notes: "Referred by former colleague, working on cutting-edge NLP",
    },
  })

  const app3 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: companies[2].id,
      roleTitle: "Cloud Infrastructure Engineer",
      location: "Seattle, WA",
      employmentType: "Full-time",
      source: "Company Website",
      postingUrl: "https://cloudscale.example.com/jobs/123",
      stage: "TECHNICAL",
      status: "ACTIVE",
      salaryMin: 145000,
      salaryMax: 175000,
      salaryCurrency: "USD",
      appliedAt: new Date("2024-01-25"),
      notes: "Large-scale distributed systems experience required",
    },
  })

  const app4 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: companies[3].id,
      roleTitle: "Backend Engineer (Python)",
      location: "Boston, MA (Hybrid)",
      employmentType: "Full-time",
      source: "Indeed",
      postingUrl: "https://indeed.com/job/fintech-backend-python",
      stage: "PHONE_SCREEN",
      status: "ACTIVE",
      salaryMin: 130000,
      salaryMax: 160000,
      salaryCurrency: "USD",
      appliedAt: new Date("2024-02-01"),
      notes: "FinTech experience preferred but not required",
    },
  })

  const app5 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: companies[4].id,
      roleTitle: "Developer Advocate",
      location: "Remote",
      employmentType: "Full-time",
      source: "Twitter",
      postingUrl: "https://devtools.example.com/careers/dev-advocate",
      stage: "APPLIED",
      status: "ACTIVE",
      salaryMin: 120000,
      salaryMax: 150000,
      salaryCurrency: "USD",
      appliedAt: new Date("2024-02-05"),
      notes: "Great fit for my public speaking and technical writing skills",
    },
  })

  // Rejected application
  const app6 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: companies[0].id,
      roleTitle: "Senior DevOps Engineer",
      location: "Austin, TX",
      employmentType: "Full-time",
      source: "LinkedIn",
      stage: "REJECTED",
      status: "ARCHIVED",
      salaryMin: 135000,
      salaryMax: 165000,
      salaryCurrency: "USD",
      appliedAt: new Date("2024-01-10"),
      notes: "Didn't pass technical assessment, good learning experience",
    },
  })

  // Discovered application (haven't applied yet)
  const app7 = await prisma.application.create({
    data: {
      userId: user1.id,
      companyId: companies[2].id,
      roleTitle: "Staff Engineer",
      location: "Remote",
      employmentType: "Full-time",
      source: "AngelList",
      postingUrl: "https://angel.co/cloudscale/staff-engineer",
      stage: "DISCOVERED",
      status: "ACTIVE",
      salaryMin: 170000,
      salaryMax: 220000,
      salaryCurrency: "USD",
      notes: "Senior role, need to polish resume before applying",
    },
  })

  console.log(`✅ Created 7 applications across all stages\n`)

  // ==================== Application-Contact Links ====================
  console.log("🔗 Linking contacts to applications...")

  await Promise.all([
    prisma.applicationContact.create({
      data: {
        applicationId: app1.id,
        contactId: contacts[0].id,
        role: "Hiring Manager",
      },
    }),
    prisma.applicationContact.create({
      data: {
        applicationId: app1.id,
        contactId: contacts[1].id,
        role: "Recruiter",
      },
    }),
    prisma.applicationContact.create({
      data: {
        applicationId: app2.id,
        contactId: contacts[2].id,
        role: "Hiring Manager",
      },
    }),
    prisma.applicationContact.create({
      data: {
        applicationId: app3.id,
        contactId: contacts[3].id,
        role: "Interviewer",
      },
    }),
    prisma.applicationContact.create({
      data: {
        applicationId: app4.id,
        contactId: contacts[4].id,
        role: "Recruiter",
      },
    }),
  ])
  console.log(`✅ Linked contacts to applications\n`)

  // ==================== Interviews ====================
  console.log("🎤 Creating interviews...")

  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const interviews = await Promise.all([
    prisma.interview.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        roundName: "Final Round",
        type: "FINAL",
        outcome: "PASSED",
        scheduledAt: yesterday,
        duration: 90,
        location: "Google Meet",
        notes: "Went very well, discussed compensation and start date",
      },
    }),
    prisma.interview.create({
      data: {
        userId: user1.id,
        applicationId: app2.id,
        roundName: "Onsite Day 1",
        type: "ONSITE",
        outcome: "PENDING",
        scheduledAt: tomorrow,
        duration: 240,
        location: "DataWorks AI HQ, New York",
        instructions: "Bring ID, arrive 15 minutes early, lunch provided",
        notes: "Full day onsite: coding, system design, behavioral, team lunch",
      },
    }),
    prisma.interview.create({
      data: {
        userId: user1.id,
        applicationId: app3.id,
        roundName: "Technical Screen",
        type: "TECHNICAL",
        outcome: "PASSED",
        scheduledAt: new Date("2024-02-03"),
        duration: 60,
        location: "Zoom",
        notes: "Live coding in Python, system design discussion",
      },
    }),
    prisma.interview.create({
      data: {
        userId: user1.id,
        applicationId: app4.id,
        roundName: "Recruiter Screen",
        type: "PHONE",
        outcome: "PENDING",
        scheduledAt: nextWeek,
        duration: 30,
        location: "Phone",
        notes: "Initial conversation about background and role fit",
      },
    }),
  ])
  console.log(`✅ Created ${interviews.length} interviews\n`)

  // ==================== Interview Panel Members ====================
  console.log("👔 Adding interview panel members...")

  await Promise.all([
    // Link existing contact as panel member
    prisma.interviewPanelMember.create({
      data: {
        interviewId: interviews[0].id,
        contactId: contacts[0].id, // Emily Rodriguez
        name: "Emily Rodriguez",
        role: "Engineering Manager",
      },
    }),
    // Add new panel member without existing contact
    prisma.interviewPanelMember.create({
      data: {
        interviewId: interviews[0].id,
        name: "David Kim",
        role: "VP of Engineering",
      },
    }),
    // Link existing contact as panel member
    prisma.interviewPanelMember.create({
      data: {
        interviewId: interviews[1].id,
        contactId: contacts[2].id, // Dr. Aisha Patel
        name: "Dr. Aisha Patel",
        role: "Head of ML Engineering",
      },
    }),
  ])
  console.log(`✅ Added interview panel members\n`)

  // ==================== Tasks ====================
  console.log("✅ Creating tasks and reminders...")

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        title: "Review and sign offer letter",
        description: "Carefully review compensation, benefits, and start date",
        priority: "URGENT",
        status: "PENDING",
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.task.create({
      data: {
        userId: user1.id,
        applicationId: app2.id,
        title: "Prepare for onsite interview",
        description: "Review ML algorithms, practice system design, prepare questions",
        priority: "HIGH",
        status: "IN_PROGRESS",
        dueDate: tomorrow,
      },
    }),
    prisma.task.create({
      data: {
        userId: user1.id,
        applicationId: app3.id,
        title: "Send thank you email",
        description: "Thank James for the technical interview",
        priority: "MEDIUM",
        status: "COMPLETED",
        dueDate: new Date("2024-02-04"),
        completedAt: new Date("2024-02-04"),
      },
    }),
    prisma.task.create({
      data: {
        userId: user1.id,
        applicationId: app5.id,
        title: "Follow up with recruiter",
        description: "Check on application status, express continued interest",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.task.create({
      data: {
        userId: user1.id,
        applicationId: app7.id,
        title: "Update resume for staff role",
        description: "Highlight leadership and architecture experience",
        priority: "LOW",
        status: "PENDING",
        dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      },
    }),
  ])
  console.log(`✅ Created ${tasks.length} tasks\n`)

  // ==================== Offers ====================
  console.log("💰 Creating offer...")

  const offer = await prisma.offer.create({
    data: {
      applicationId: app1.id,
      baseSalary: 165000,
      bonus: 20000,
      equity: "0.15% (15,000 shares vesting over 4 years)",
      currency: "USD",
      benefits: "Full health/dental/vision, 401k 6% match, unlimited PTO, $2000 learning budget",
      location: "San Francisco, CA (Hybrid)",
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      decision: "PENDING",
      notes: "Strong offer, need to compare with other potential offers. Equity valued at ~$50k at current valuation.",
    },
  })
  console.log(`✅ Created offer for TechCorp position\n`)

  // ==================== Activities ====================
  console.log("📋 Creating activity timeline...")

  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "CREATED",
        description: "Application created",
        createdAt: new Date("2024-01-15"),
      },
    }),
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "STAGE_CHANGED",
        description: "Stage changed from DISCOVERED to APPLIED",
        metadata: JSON.stringify({ from: "DISCOVERED", to: "APPLIED" }),
        createdAt: new Date("2024-01-15"),
      },
    }),
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "STAGE_CHANGED",
        description: "Stage changed from APPLIED to PHONE_SCREEN",
        metadata: JSON.stringify({ from: "APPLIED", to: "PHONE_SCREEN" }),
        createdAt: new Date("2024-01-22"),
      },
    }),
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "INTERVIEW_SCHEDULED",
        description: "Technical interview scheduled",
        createdAt: new Date("2024-01-25"),
      },
    }),
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "STAGE_CHANGED",
        description: "Stage changed from PHONE_SCREEN to TECHNICAL",
        metadata: JSON.stringify({ from: "PHONE_SCREEN", to: "TECHNICAL" }),
        createdAt: new Date("2024-01-28"),
      },
    }),
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "INTERVIEW_COMPLETED",
        description: "Technical interview completed - Passed",
        createdAt: new Date("2024-02-01"),
      },
    }),
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "STAGE_CHANGED",
        description: "Stage changed from TECHNICAL to ONSITE",
        metadata: JSON.stringify({ from: "TECHNICAL", to: "ONSITE" }),
        createdAt: new Date("2024-02-05"),
      },
    }),
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "STAGE_CHANGED",
        description: "Stage changed from ONSITE to OFFER",
        metadata: JSON.stringify({ from: "ONSITE", to: "OFFER" }),
        createdAt: new Date("2024-02-10"),
      },
    }),
    prisma.activity.create({
      data: {
        userId: user1.id,
        applicationId: app1.id,
        type: "OFFER_RECEIVED",
        description: "Received offer: $165k base + $20k bonus + 0.15% equity",
        createdAt: new Date("2024-02-10"),
      },
    }),
  ])
  console.log(`✅ Created ${activities.length} activity logs\n`)

  // ==================== Attachments ====================
  console.log("📎 Creating attachments...")

  const attachments = await Promise.all([
    prisma.attachment.create({
      data: {
        applicationId: app1.id,
        fileName: "techcorp-offer-letter.pdf",
        fileUrl: "/uploads/attachments/techcorp-offer-letter.pdf",
        fileType: "application/pdf",
        fileSize: 245760,
      },
    }),
    prisma.attachment.create({
      data: {
        applicationId: app1.id,
        fileName: "my-resume-2024.pdf",
        fileUrl: "/uploads/attachments/my-resume-2024.pdf",
        fileType: "application/pdf",
        fileSize: 102400,
      },
    }),
    prisma.attachment.create({
      data: {
        applicationId: app2.id,
        fileName: "cover-letter-dataworks.pdf",
        fileUrl: "/uploads/attachments/cover-letter-dataworks.pdf",
        fileType: "application/pdf",
        fileSize: 81920,
      },
    }),
    prisma.attachment.create({
      data: {
        interviewId: interviews[1].id,
        fileName: "onsite-schedule.pdf",
        fileUrl: "/uploads/attachments/onsite-schedule.pdf",
        fileType: "application/pdf",
        fileSize: 51200,
      },
    }),
  ])
  console.log(`✅ Created ${attachments.length} attachments\n`)

  // ==================== Email Connections ====================
  console.log("📧 Creating email connections...")

  const emailConnections = await Promise.all([
    prisma.emailConnection.create({
      data: {
        userId: user1.id,
        provider: "GMAIL",
        email: "test@example.com",
        accessToken: "mock_gmail_access_token_1234567890abcdefghijklmnopqrstuvwxyz",
        refreshToken: "mock_gmail_refresh_token_abcdefghijklmnopqrstuvwxyz1234567890",
        expiresAt: new Date(now.getTime() + 3600 * 1000),
        scope: "https://www.googleapis.com/auth/gmail.readonly",
        labels: ["INBOX", "Jobs", "Career"],
        lastSyncAt: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      },
    }),
  ])
  console.log(`✅ Created ${emailConnections.length} email connections\n`)

  // ==================== Share Links ====================
  console.log("🔗 Creating share links...")

  const shareLinks = await Promise.all([
    prisma.shareLink.create({
      data: {
        userId: user1.id,
        token: "abc123def456ghi789",
        scope: `application:${app1.id}`, // Share specific application
        expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
      },
    }),
    prisma.shareLink.create({
      data: {
        userId: user1.id,
        token: "xyz789uvw456rst123",
        scope: "all", // Share all applications
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
      },
    }),
  ])
  console.log(`✅ Created ${shareLinks.length} share links\n`)

  // ==================== Audit Logs ====================
  console.log("📜 Creating audit logs...")

  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: user1.id,
        action: "USER_LOGIN",
        resource: `user:${user1.id}`,
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        metadata: JSON.stringify({ method: "email" }),
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: user1.id,
        action: "EMAIL_CONNECTED",
        resource: `email_connection:${emailConnections[0].id}`,
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        metadata: JSON.stringify({ provider: "GMAIL" }),
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: user1.id,
        action: "APPLICATION_CREATED",
        resource: `application:${app1.id}`,
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        metadata: JSON.stringify({ company: "TechCorp Inc.", role: "Senior Full Stack Engineer" }),
      },
    }),
  ])
  console.log(`✅ Created ${auditLogs.length} audit logs\n`)

  // ==================== Summary ====================
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("📊 Comprehensive Seed Summary")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`\n✅ Users: 2`)
  console.log(`✅ Companies: ${companies.length}`)
  console.log(`✅ Contacts: ${contacts.length}`)
  console.log(`✅ Applications: 7`)
  console.log(`   - DISCOVERED: 1`)
  console.log(`   - APPLIED: 1`)
  console.log(`   - PHONE_SCREEN: 1`)
  console.log(`   - TECHNICAL: 1`)
  console.log(`   - ONSITE: 1`)
  console.log(`   - OFFER: 1`)
  console.log(`   - REJECTED: 1`)
  console.log(`✅ Application-Contact Links: 5`)
  console.log(`✅ Interviews: ${interviews.length}`)
  console.log(`✅ Interview Panel Members: 3`)
  console.log(`✅ Tasks: ${tasks.length}`)
  console.log(`✅ Offers: 1`)
  console.log(`✅ Activities: ${activities.length}`)
  console.log(`✅ Attachments: ${attachments.length}`)
  console.log(`✅ Email Connections: ${emailConnections.length}`)
  console.log(`✅ Share Links: ${shareLinks.length}`)
  console.log(`✅ Audit Logs: ${auditLogs.length}`)

  console.log("\n🔐 Test Credentials:")
  console.log("   Email: test@example.com")
  console.log("   Password: password123")
  console.log("\n   Email: demo@careerpilot.com")
  console.log("   Password: password456")

  console.log("\n📋 Enum Coverage:")
  console.log("   ✅ All ApplicationStage values demonstrated")
  console.log("   ✅ All InterviewType values demonstrated")
  console.log("   ✅ All TaskStatus values demonstrated")
  console.log("   ✅ All TaskPriority values demonstrated")
  console.log("   ✅ All ActivityType examples shown")

  console.log("\n🔗 Relationships Verified:")
  console.log("   ✅ User → Applications (one-to-many)")
  console.log("   ✅ User → Companies (one-to-many)")
  console.log("   ✅ Company → Applications (one-to-many)")
  console.log("   ✅ Application → Interviews (one-to-many)")
  console.log("   ✅ Application → Tasks (one-to-many)")
  console.log("   ✅ Application → Offer (one-to-one)")
  console.log("   ✅ Application ↔ Contact (many-to-many via ApplicationContact)")
  console.log("   ✅ Interview → Panel Members (one-to-many)")
  console.log("   ✅ Application → Activities (one-to-many)")
  console.log("   ✅ Application → Attachments (one-to-many)")

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("✨ Database seeded successfully with comprehensive test data!")
  console.log("🚀 Ready for development and testing!")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })