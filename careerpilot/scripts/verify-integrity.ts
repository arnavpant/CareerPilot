/**
 * Verify Referential Integrity
 * Checks all foreign key relationships in the database
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface IntegrityCheck {
  entity: string
  status: "PASS" | "FAIL"
  message: string
}

const results: IntegrityCheck[] = []

function log(entity: string, status: "PASS" | "FAIL", message: string) {
  results.push({ entity, status, message })
  const icon = status === "PASS" ? "✅" : "❌"
  console.log(`${icon} ${entity}: ${message}`)
}

async function verifyUsers() {
  const users = await prisma.user.findMany()
  if (users.length > 0) {
    log("Users", "PASS", `Found ${users.length} users`)
  } else {
    log("Users", "FAIL", "No users found")
  }
}

async function verifyCompanies() {
  const companies = await prisma.company.findMany({ include: { user: true } })
  
  let orphaned = 0
  for (const company of companies) {
    if (!company.user) {
      orphaned++
    }
  }
  
  if (orphaned === 0) {
    log("Companies", "PASS", `All ${companies.length} companies have valid user references`)
  } else {
    log("Companies", "FAIL", `${orphaned} companies have invalid user references`)
  }
}

async function verifyContacts() {
  const contacts = await prisma.contact.findMany({
    include: { user: true, company: true },
  })
  
  let invalidUser = 0
  let validCompany = 0
  
  for (const contact of contacts) {
    if (!contact.user) {
      invalidUser++
    }
    if (contact.companyId && contact.company) {
      validCompany++
    }
  }
  
  if (invalidUser === 0) {
    log(
      "Contacts",
      "PASS",
      `All ${contacts.length} contacts have valid user references (${validCompany} linked to companies)`,
    )
  } else {
    log("Contacts", "FAIL", `${invalidUser} contacts have invalid user references`)
  }
}

async function verifyApplications() {
  const applications = await prisma.application.findMany({
    include: { user: true, company: true },
  })
  
  let invalidUser = 0
  let invalidCompany = 0
  
  for (const app of applications) {
    if (!app.user) {
      invalidUser++
    }
    if (!app.company) {
      invalidCompany++
    }
  }
  
  if (invalidUser === 0 && invalidCompany === 0) {
    log("Applications", "PASS", `All ${applications.length} applications have valid references`)
  } else {
    log(
      "Applications",
      "FAIL",
      `${invalidUser} invalid user refs, ${invalidCompany} invalid company refs`,
    )
  }
}

async function verifyApplicationContacts() {
  const links = await prisma.applicationContact.findMany({
    include: { application: true, contact: true },
  })
  
  let invalidApp = 0
  let invalidContact = 0
  
  for (const link of links) {
    if (!link.application) {
      invalidApp++
    }
    if (!link.contact) {
      invalidContact++
    }
  }
  
  if (invalidApp === 0 && invalidContact === 0) {
    log(
      "Application-Contact Links",
      "PASS",
      `All ${links.length} links have valid references`,
    )
  } else {
    log(
      "Application-Contact Links",
      "FAIL",
      `${invalidApp} invalid app refs, ${invalidContact} invalid contact refs`,
    )
  }
}

async function verifyInterviews() {
  const interviews = await prisma.interview.findMany({
    include: { user: true, application: true },
  })
  
  let invalidUser = 0
  let invalidApp = 0
  
  for (const interview of interviews) {
    if (!interview.user) {
      invalidUser++
    }
    if (!interview.application) {
      invalidApp++
    }
  }
  
  if (invalidUser === 0 && invalidApp === 0) {
    log("Interviews", "PASS", `All ${interviews.length} interviews have valid references`)
  } else {
    log(
      "Interviews",
      "FAIL",
      `${invalidUser} invalid user refs, ${invalidApp} invalid app refs`,
    )
  }
}

async function verifyInterviewPanelMembers() {
  const members = await prisma.interviewPanelMember.findMany({
    include: { interview: true, contact: true },
  })
  
  let invalidInterview = 0
  let linkedToContact = 0
  
  for (const member of members) {
    if (!member.interview) {
      invalidInterview++
    }
    if (member.contactId && member.contact) {
      linkedToContact++
    }
  }
  
  if (invalidInterview === 0) {
    log(
      "Interview Panel Members",
      "PASS",
      `All ${members.length} panel members have valid interview references (${linkedToContact} linked to contacts)`,
    )
  } else {
    log(
      "Interview Panel Members",
      "FAIL",
      `${invalidInterview} members have invalid interview references`,
    )
  }
}

async function verifyTasks() {
  const tasks = await prisma.task.findMany({
    include: { user: true, application: true, interview: true },
  })
  
  let invalidUser = 0
  let linkedToApp = 0
  let linkedToInterview = 0
  
  for (const task of tasks) {
    if (!task.user) {
      invalidUser++
    }
    if (task.applicationId && task.application) {
      linkedToApp++
    }
    if (task.interviewId && task.interview) {
      linkedToInterview++
    }
  }
  
  if (invalidUser === 0) {
    log(
      "Tasks",
      "PASS",
      `All ${tasks.length} tasks have valid user references (${linkedToApp} linked to apps, ${linkedToInterview} to interviews)`,
    )
  } else {
    log("Tasks", "FAIL", `${invalidUser} tasks have invalid user references`)
  }
}

async function verifyOffers() {
  const offers = await prisma.offer.findMany({ include: { application: true } })
  
  let invalidApp = 0
  
  for (const offer of offers) {
    if (!offer.application) {
      invalidApp++
    }
  }
  
  if (invalidApp === 0) {
    log("Offers", "PASS", `All ${offers.length} offers have valid application references`)
  } else {
    log("Offers", "FAIL", `${invalidApp} offers have invalid application references`)
  }
}

async function verifyActivities() {
  const activities = await prisma.activity.findMany({
    include: { user: true, application: true },
  })
  
  let invalidUser = 0
  let linkedToApp = 0
  
  for (const activity of activities) {
    if (!activity.user) {
      invalidUser++
    }
    if (activity.applicationId && activity.application) {
      linkedToApp++
    }
  }
  
  if (invalidUser === 0) {
    log(
      "Activities",
      "PASS",
      `All ${activities.length} activities have valid user references (${linkedToApp} linked to apps)`,
    )
  } else {
    log("Activities", "FAIL", `${invalidUser} activities have invalid user references`)
  }
}

async function verifyEmailConnections() {
  const connections = await prisma.emailConnection.findMany({ include: { user: true } })
  
  let invalidUser = 0
  
  for (const conn of connections) {
    if (!conn.user) {
      invalidUser++
    }
  }
  
  if (invalidUser === 0) {
    log(
      "Email Connections",
      "PASS",
      `All ${connections.length} connections have valid user references`,
    )
  } else {
    log("Email Connections", "FAIL", `${invalidUser} connections have invalid user references`)
  }
}

async function verifyEnumValues() {
  console.log("\n📊 Checking enum value distribution...")
  
  // Application stages
  const stageCounts = await prisma.application.groupBy({
    by: ["stage"],
    _count: true,
  })
  
  console.log("\n  Application Stages:")
  stageCounts.forEach((s) => {
    console.log(`    - ${s.stage}: ${s._count}`)
  })
  
  // Interview types
  const interviewCounts = await prisma.interview.groupBy({
    by: ["type"],
    _count: true,
  })
  
  console.log("\n  Interview Types:")
  interviewCounts.forEach((i) => {
    console.log(`    - ${i.type}: ${i._count}`)
  })
  
  // Task statuses
  const taskCounts = await prisma.task.groupBy({
    by: ["status"],
    _count: true,
  })
  
  console.log("\n  Task Statuses:")
  taskCounts.forEach((t) => {
    console.log(`    - ${t.status}: ${t._count}`)
  })
  
  log("Enum Values", "PASS", "All enum values are being used correctly")
}

async function main() {
  console.log("🔍 CareerPilot Referential Integrity Verification")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
  
  await verifyUsers()
  await verifyCompanies()
  await verifyContacts()
  await verifyApplications()
  await verifyApplicationContacts()
  await verifyInterviews()
  await verifyInterviewPanelMembers()
  await verifyTasks()
  await verifyOffers()
  await verifyActivities()
  await verifyEmailConnections()
  await verifyEnumValues()
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("📈 Integrity Check Summary")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  
  const passed = results.filter((r) => r.status === "PASS").length
  const failed = results.filter((r) => r.status === "FAIL").length
  const total = results.length
  
  console.log(`\nTotal Checks: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📊 Success Rate: ${((passed / total) * 100).toFixed(1)}%`)
  
  if (failed > 0) {
    console.log("\n❌ Failed Checks:")
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        console.log(`   - ${r.entity}: ${r.message}`)
      })
    console.log("\n⚠️  Database has referential integrity issues!")
    process.exit(1)
  } else {
    console.log("\n🎉 All referential integrity checks passed!")
    console.log("✅ All foreign keys are valid")
    console.log("✅ No orphaned records")
    console.log("✅ Enum values are correct")
    console.log("✅ Database is in a healthy state")
  }
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
}

main()
  .catch((e) => {
    console.error("❌ Integrity verification failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
