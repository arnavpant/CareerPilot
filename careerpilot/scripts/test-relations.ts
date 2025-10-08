/**
 * Test Relations and Cascading Rules
 * Verifies that all database relations work correctly
 */

import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

interface TestResult {
  name: string
  status: "PASS" | "FAIL"
  message?: string
}

const results: TestResult[] = []

function logTest(name: string, status: "PASS" | "FAIL", message?: string) {
  results.push({ name, status, message })
  const icon = status === "PASS" ? "✅" : "❌"
  const msg = message ? ` - ${message}` : ""
  console.log(`${icon} ${name}${msg}`)
}

async function testUserCascade() {
  console.log("\n📋 Testing User Cascade Delete...")
  
  try {
    const password = await hash("test123", 10)
    
    // Create user with related data
    const user = await prisma.user.create({
      data: {
        email: `cascade-test-${Date.now()}@example.com`,
        name: "Cascade Test User",
        password,
      },
    })
    
    // Create company
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: "Test Company",
      },
    })
    
    // Create application
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        companyId: company.id,
        roleTitle: "Software Engineer",
        stage: "APPLIED",
      },
    })
    
    // Create contact
    const contact = await prisma.contact.create({
      data: {
        userId: user.id,
        companyId: company.id,
        name: "Test Recruiter",
        email: `recruiter-${Date.now()}@example.com`,
      },
    })
    
    // Create interview
    const interview = await prisma.interview.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        roundName: "Phone Screen",
        type: "PHONE",
        scheduledAt: new Date(),
      },
    })
    
    // Create task
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        title: "Follow up",
        priority: "MEDIUM",
      },
    })
    
    // Delete user - should cascade delete everything
    await prisma.user.delete({ where: { id: user.id } })
    
    // Verify all related records are deleted
    const companyExists = await prisma.company.findUnique({ where: { id: company.id } })
    const applicationExists = await prisma.application.findUnique({ where: { id: application.id } })
    const contactExists = await prisma.contact.findUnique({ where: { id: contact.id } })
    const interviewExists = await prisma.interview.findUnique({ where: { id: interview.id } })
    const taskExists = await prisma.task.findUnique({ where: { id: task.id } })
    
    if (!companyExists && !applicationExists && !contactExists && !interviewExists && !taskExists) {
      logTest("User Cascade Delete", "PASS", "All related records deleted")
    } else {
      logTest("User Cascade Delete", "FAIL", "Some records not deleted")
    }
  } catch (error) {
    logTest("User Cascade Delete", "FAIL", error instanceof Error ? error.message : "Unknown error")
  }
}

async function testApplicationCascade() {
  console.log("\n📋 Testing Application Cascade Delete...")
  
  try {
    const password = await hash("test123", 10)
    
    // Create user and company
    const user = await prisma.user.create({
      data: {
        email: `app-cascade-${Date.now()}@example.com`,
        name: "App Cascade Test",
        password,
      },
    })
    
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: "Test Company 2",
      },
    })
    
    // Create application with related data
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        companyId: company.id,
        roleTitle: "Backend Engineer",
        stage: "TECHNICAL",
      },
    })
    
    // Create interview linked to application
    const interview = await prisma.interview.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        roundName: "Technical Round",
        type: "TECHNICAL",
        scheduledAt: new Date(),
      },
    })
    
    // Create task linked to application
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        title: "Prepare for interview",
        priority: "HIGH",
      },
    })
    
    // Create offer linked to application
    const offer = await prisma.offer.create({
      data: {
        applicationId: application.id,
        baseSalary: 120000,
        decision: "PENDING",
      },
    })
    
    // Create activity linked to application
    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        type: "STAGE_CHANGED",
        description: "Moved to technical interview",
      },
    })
    
    // Delete application - should cascade delete interview, task, offer, activity
    await prisma.application.delete({ where: { id: application.id } })
    
    // Verify related records are deleted
    const interviewExists = await prisma.interview.findUnique({ where: { id: interview.id } })
    const taskExists = await prisma.task.findUnique({ where: { id: task.id } })
    const offerExists = await prisma.offer.findUnique({ where: { id: offer.id } })
    const activityExists = await prisma.activity.findUnique({ where: { id: activity.id } })
    
    // User and company should still exist
    const userExists = await prisma.user.findUnique({ where: { id: user.id } })
    const companyExists = await prisma.company.findUnique({ where: { id: company.id } })
    
    // Cleanup
    await prisma.user.delete({ where: { id: user.id } })
    
    if (!interviewExists && !taskExists && !offerExists && !activityExists && userExists && companyExists) {
      logTest("Application Cascade Delete", "PASS", "Related records deleted, user/company preserved")
    } else {
      logTest("Application Cascade Delete", "FAIL", "Cascade rules not working correctly")
    }
  } catch (error) {
    logTest("Application Cascade Delete", "FAIL", error instanceof Error ? error.message : "Unknown error")
  }
}

async function testContactSetNull() {
  console.log("\n📋 Testing Contact SetNull on Company Delete...")
  
  try {
    const password = await hash("test123", 10)
    
    // Create user and company
    const user = await prisma.user.create({
      data: {
        email: `setnull-test-${Date.now()}@example.com`,
        name: "SetNull Test User",
        password,
      },
    })
    
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: "Test Company SetNull",
      },
    })
    
    // Create contact linked to company
    const contact = await prisma.contact.create({
      data: {
        userId: user.id,
        companyId: company.id,
        name: "Test Contact",
        email: `contact-${Date.now()}@example.com`,
      },
    })
    
    // Delete company - contact should have companyId set to null
    await prisma.company.delete({ where: { id: company.id } })
    
    // Check contact still exists with null companyId
    const updatedContact = await prisma.contact.findUnique({ where: { id: contact.id } })
    
    // Cleanup
    await prisma.user.delete({ where: { id: user.id } })
    
    if (updatedContact && updatedContact.companyId === null) {
      logTest("Contact SetNull", "PASS", "companyId set to null on company delete")
    } else {
      logTest("Contact SetNull", "FAIL", "SetNull not working correctly")
    }
  } catch (error) {
    logTest("Contact SetNull", "FAIL", error instanceof Error ? error.message : "Unknown error")
  }
}

async function testUniqueConstraints() {
  console.log("\n📋 Testing Unique Constraints...")
  
  try {
    const password = await hash("test123", 10)
    const email = `unique-test-${Date.now()}@example.com`
    
    // Create first user
    const user1 = await prisma.user.create({
      data: {
        email,
        name: "User 1",
        password,
      },
    })
    
    // Try to create duplicate email - should fail
    try {
      await prisma.user.create({
        data: {
          email,
          name: "User 2",
          password,
        },
      })
      
      // Cleanup
      await prisma.user.delete({ where: { id: user1.id } })
      
      logTest("Unique Email Constraint", "FAIL", "Duplicate email was allowed")
    } catch (duplicateError) {
      // Expected error
      await prisma.user.delete({ where: { id: user1.id } })
      logTest("Unique Email Constraint", "PASS", "Duplicate email correctly rejected")
    }
  } catch (error) {
    logTest("Unique Email Constraint", "FAIL", error instanceof Error ? error.message : "Unknown error")
  }
}

async function testManyToManyRelation() {
  console.log("\n📋 Testing Many-to-Many (Application-Contact)...")
  
  try {
    const password = await hash("test123", 10)
    
    // Create user, company, application, contacts
    const user = await prisma.user.create({
      data: {
        email: `m2m-test-${Date.now()}@example.com`,
        name: "M2M Test User",
        password,
      },
    })
    
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: "M2M Test Company",
      },
    })
    
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        companyId: company.id,
        roleTitle: "Full Stack Engineer",
        stage: "PHONE_SCREEN",
      },
    })
    
    const contact1 = await prisma.contact.create({
      data: {
        userId: user.id,
        companyId: company.id,
        name: "Recruiter 1",
        email: `recruiter1-${Date.now()}@example.com`,
        relationship: "Recruiter",
      },
    })
    
    const contact2 = await prisma.contact.create({
      data: {
        userId: user.id,
        companyId: company.id,
        name: "Hiring Manager",
        email: `manager-${Date.now()}@example.com`,
        relationship: "Hiring Manager",
      },
    })
    
    // Link contacts to application
    const link1 = await prisma.applicationContact.create({
      data: {
        applicationId: application.id,
        contactId: contact1.id,
        role: "Recruiter",
      },
    })
    
    const link2 = await prisma.applicationContact.create({
      data: {
        applicationId: application.id,
        contactId: contact2.id,
        role: "Hiring Manager",
      },
    })
    
    // Query application with contacts
    const appWithContacts = await prisma.application.findUnique({
      where: { id: application.id },
      include: {
        contacts: {
          include: {
            contact: true,
          },
        },
      },
    })
    
    // Cleanup
    await prisma.user.delete({ where: { id: user.id } })
    
    if (appWithContacts && appWithContacts.contacts.length === 2) {
      logTest("Many-to-Many Relation", "PASS", "Application linked to 2 contacts correctly")
    } else {
      logTest("Many-to-Many Relation", "FAIL", "Contact linking not working")
    }
  } catch (error) {
    logTest("Many-to-Many Relation", "FAIL", error instanceof Error ? error.message : "Unknown error")
  }
}

async function testIndexes() {
  console.log("\n📋 Testing Indexes (query performance)...")
  
  try {
    // Note: We can't directly test index creation, but we can verify queries work
    const password = await hash("test123", 10)
    
    const user = await prisma.user.create({
      data: {
        email: `index-test-${Date.now()}@example.com`,
        name: "Index Test User",
        password,
      },
    })
    
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: "Index Test Company",
      },
    })
    
    // Create multiple applications
    for (let i = 0; i < 5; i++) {
      await prisma.application.create({
        data: {
          userId: user.id,
          companyId: company.id,
          roleTitle: `Position ${i}`,
          stage: i % 2 === 0 ? "APPLIED" : "TECHNICAL",
        },
      })
    }
    
    // Test indexed queries
    const start = Date.now()
    
    // Query by userId (indexed)
    const byUser = await prisma.application.findMany({
      where: { userId: user.id },
    })
    
    // Query by stage (indexed)
    const byStage = await prisma.application.findMany({
      where: { stage: "APPLIED" },
    })
    
    const duration = Date.now() - start
    
    // Cleanup
    await prisma.user.delete({ where: { id: user.id } })
    
    if (byUser.length === 5 && byStage.length >= 3 && duration < 1000) {
      logTest("Indexed Queries", "PASS", `Queries executed in ${duration}ms`)
    } else {
      logTest("Indexed Queries", "FAIL", "Query performance issue")
    }
  } catch (error) {
    logTest("Indexed Queries", "FAIL", error instanceof Error ? error.message : "Unknown error")
  }
}

async function testEnums() {
  console.log("\n📋 Testing Enum Constraints...")
  
  try {
    const password = await hash("test123", 10)
    
    const user = await prisma.user.create({
      data: {
        email: `enum-test-${Date.now()}@example.com`,
        name: "Enum Test User",
        password,
      },
    })
    
    const company = await prisma.company.create({
      data: {
        userId: user.id,
        name: "Enum Test Company",
      },
    })
    
    // Test all enum values
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        companyId: company.id,
        roleTitle: "DevOps Engineer",
        stage: "ONSITE",
        status: "ACTIVE",
      },
    })
    
    const interview = await prisma.interview.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        roundName: "Final Round",
        type: "FINAL",
        outcome: "PASSED",
        scheduledAt: new Date(),
      },
    })
    
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        applicationId: application.id,
        title: "Send thank you",
        priority: "HIGH",
        status: "COMPLETED",
      },
    })
    
    // Verify enum values
    const verifyApp = await prisma.application.findUnique({ where: { id: application.id } })
    const verifyInterview = await prisma.interview.findUnique({ where: { id: interview.id } })
    const verifyTask = await prisma.task.findUnique({ where: { id: task.id } })
    
    // Cleanup
    await prisma.user.delete({ where: { id: user.id } })
    
    const enumsValid =
      verifyApp?.stage === "ONSITE" &&
      verifyApp?.status === "ACTIVE" &&
      verifyInterview?.type === "FINAL" &&
      verifyInterview?.outcome === "PASSED" &&
      verifyTask?.priority === "HIGH" &&
      verifyTask?.status === "COMPLETED"
    
    if (enumsValid) {
      logTest("Enum Constraints", "PASS", "All enum values stored correctly")
    } else {
      logTest("Enum Constraints", "FAIL", "Enum validation failed")
    }
  } catch (error) {
    logTest("Enum Constraints", "FAIL", error instanceof Error ? error.message : "Unknown error")
  }
}

async function runAllTests() {
  console.log("🧪 CareerPilot Relations & Cascading Test Suite")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
  
  const totalStart = Date.now()
  
  // Run tests
  await testUserCascade()
  await testApplicationCascade()
  await testContactSetNull()
  await testUniqueConstraints()
  await testManyToManyRelation()
  await testIndexes()
  await testEnums()
  
  const totalDuration = Date.now() - totalStart
  
  // Summary
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("📊 Test Results Summary")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  
  const passed = results.filter((r) => r.status === "PASS").length
  const failed = results.filter((r) => r.status === "FAIL").length
  const total = results.length
  
  console.log(`\nTotal Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏱️  Total Duration: ${totalDuration}ms`)
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`)
  
  if (failed > 0) {
    console.log("\n❌ Failed Tests:")
    results
      .filter((r) => r.status === "FAIL")
      .forEach((r) => {
        console.log(`   - ${r.name}: ${r.message || "Unknown error"}`)
      })
  }
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  
  if (failed === 0) {
    console.log("\n🎉 All relation tests passed!")
    console.log("✅ Cascade deletes working")
    console.log("✅ SetNull working")
    console.log("✅ Unique constraints enforced")
    console.log("✅ Many-to-many relations working")
    console.log("✅ Indexes functional")
    console.log("✅ Enums validated")
  } else {
    console.log(`\n⚠️  ${failed} test(s) failed. Please review.`)
    process.exit(1)
  }
}

runAllTests()
  .catch((e) => {
    console.error("❌ Test suite failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
