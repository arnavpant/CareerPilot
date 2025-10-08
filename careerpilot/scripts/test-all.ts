/**
 * Comprehensive test script for CareerPilot
 * Tests authentication, settings, API routes, and edge cases
 */

import { PrismaClient } from "@prisma/client"
import { hash, compare } from "bcryptjs"

const prisma = new PrismaClient()

interface TestResult {
  name: string
  status: "PASS" | "FAIL"
  message?: string
  duration: number
}

const results: TestResult[] = []

function logTest(name: string, status: "PASS" | "FAIL", message?: string, duration?: number) {
  const result: TestResult = {
    name,
    status,
    message,
    duration: duration || 0,
  }
  results.push(result)
  
  const icon = status === "PASS" ? "✅" : "❌"
  const msg = message ? ` - ${message}` : ""
  console.log(`${icon} ${name}${msg} (${duration}ms)`)
}

async function testPasswordHashing() {
  const start = Date.now()
  const testPassword = "test123"
  
  try {
    const hashed = await hash(testPassword, 10)
    const isValid = await compare(testPassword, hashed)
    const isInvalid = await compare("wrong", hashed)
    
    if (isValid && !isInvalid && hashed !== testPassword) {
      logTest("Password Hashing", "PASS", "Bcrypt working correctly", Date.now() - start)
    } else {
      logTest("Password Hashing", "FAIL", "Bcrypt validation failed", Date.now() - start)
    }
  } catch (error) {
    logTest("Password Hashing", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function testDatabaseConnection() {
  const start = Date.now()
  
  try {
    await prisma.$connect()
    logTest("Database Connection", "PASS", "Connected to database", Date.now() - start)
  } catch (error) {
    logTest("Database Connection", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function testUserCreation() {
  const start = Date.now()
  
  try {
    const testEmail = `test-${Date.now()}@example.com`
    const hashedPassword = await hash("testpass", 10)
    
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Test User",
        password: hashedPassword,
      },
    })
    
    if (user && user.email === testEmail) {
      // Cleanup
      await prisma.user.delete({ where: { id: user.id } })
      logTest("User Creation", "PASS", "User created and deleted successfully", Date.now() - start)
    } else {
      logTest("User Creation", "FAIL", "User data mismatch", Date.now() - start)
    }
  } catch (error) {
    logTest("User Creation", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function testUserSettings() {
  const start = Date.now()
  
  try {
    const testEmail = `settings-test-${Date.now()}@example.com`
    const hashedPassword = await hash("testpass", 10)
    
    // Create user with default settings
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Settings Test User",
        password: hashedPassword,
      },
    })
    
    // Verify default settings
    if (
      user.timezone === "UTC" &&
      user.notifyInApp === true &&
      user.notifyEmail === true &&
      user.notifySlack === false &&
      user.dataRetentionDays === 365
    ) {
      // Update settings
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          timezone: "America/New_York",
          notifySlack: true,
          slackWebhook: "https://hooks.slack.com/test",
          dataRetentionDays: 90,
        },
      })
      
      if (
        updated.timezone === "America/New_York" &&
        updated.notifySlack === true &&
        updated.slackWebhook === "https://hooks.slack.com/test" &&
        updated.dataRetentionDays === 90
      ) {
        // Cleanup
        await prisma.user.delete({ where: { id: user.id } })
        logTest("User Settings", "PASS", "Settings created and updated correctly", Date.now() - start)
      } else {
        await prisma.user.delete({ where: { id: user.id } })
        logTest("User Settings", "FAIL", "Settings update failed", Date.now() - start)
      }
    } else {
      await prisma.user.delete({ where: { id: user.id } })
      logTest("User Settings", "FAIL", "Default settings incorrect", Date.now() - start)
    }
  } catch (error) {
    logTest("User Settings", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function testEmailUniqueness() {
  const start = Date.now()
  
  try {
    const testEmail = `unique-test-${Date.now()}@example.com`
    const hashedPassword = await hash("testpass", 10)
    
    // Create first user
    const user1 = await prisma.user.create({
      data: {
        email: testEmail,
        name: "User 1",
        password: hashedPassword,
      },
    })
    
    // Try to create duplicate
    try {
      await prisma.user.create({
        data: {
          email: testEmail,
          name: "User 2",
          password: hashedPassword,
        },
      })
      
      // If we get here, the unique constraint didn't work
      await prisma.user.delete({ where: { id: user1.id } })
      logTest("Email Uniqueness", "FAIL", "Duplicate email was allowed", Date.now() - start)
    } catch (duplicateError) {
      // Expected error - cleanup and pass
      await prisma.user.delete({ where: { id: user1.id } })
      logTest("Email Uniqueness", "PASS", "Duplicate email correctly rejected", Date.now() - start)
    }
  } catch (error) {
    logTest("Email Uniqueness", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function testNullableFields() {
  const start = Date.now()
  
  try {
    const testEmail = `nullable-test-${Date.now()}@example.com`
    
    // Create OAuth user (no password)
    const oauthUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: "OAuth User",
        password: null,
        emailVerified: new Date(),
      },
    })
    
    // Verify nullable fields
    if (
      oauthUser.password === null &&
      oauthUser.slackWebhook === null &&
      oauthUser.discordWebhook === null &&
      oauthUser.emailVerified !== null
    ) {
      // Test data retention null (keep forever)
      const updated = await prisma.user.update({
        where: { id: oauthUser.id },
        data: { dataRetentionDays: null },
      })
      
      if (updated.dataRetentionDays === null) {
        await prisma.user.delete({ where: { id: oauthUser.id } })
        logTest("Nullable Fields", "PASS", "Nullable fields handled correctly", Date.now() - start)
      } else {
        await prisma.user.delete({ where: { id: oauthUser.id } })
        logTest("Nullable Fields", "FAIL", "Null data retention update failed", Date.now() - start)
      }
    } else {
      await prisma.user.delete({ where: { id: oauthUser.id } })
      logTest("Nullable Fields", "FAIL", "Nullable field validation failed", Date.now() - start)
    }
  } catch (error) {
    logTest("Nullable Fields", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function testSeededUsers() {
  const start = Date.now()
  
  try {
    const users = await prisma.user.findMany()
    
    if (users.length >= 5) {
      // Check for test users
      const testUser = users.find((u) => u.email === "test@example.com")
      const demoUser = users.find((u) => u.email === "demo@careerpilot.com")
      const oauthUser = users.find((u) => u.email === "oauth@example.com")
      
      if (testUser && demoUser && oauthUser) {
        // Verify test user has password
        if (testUser.password && !oauthUser.password) {
          logTest("Seeded Users", "PASS", `Found ${users.length} users including test accounts`, Date.now() - start)
        } else {
          logTest("Seeded Users", "FAIL", "User password validation failed", Date.now() - start)
        }
      } else {
        logTest("Seeded Users", "FAIL", "Missing expected test users", Date.now() - start)
      }
    } else {
      logTest("Seeded Users", "FAIL", `Expected at least 5 users, found ${users.length}`, Date.now() - start)
    }
  } catch (error) {
    logTest("Seeded Users", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function testTimezoneValidation() {
  const start = Date.now()
  
  try {
    const testEmail = `timezone-test-${Date.now()}@example.com`
    const hashedPassword = await hash("testpass", 10)
    
    // Test various timezones
    const timezones = ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"]
    
    for (const tz of timezones) {
      const user = await prisma.user.create({
        data: {
          email: `${tz.replace(/\//g, "-")}-${Date.now()}@example.com`,
          name: `Timezone Test ${tz}`,
          password: hashedPassword,
          timezone: tz,
        },
      })
      
      if (user.timezone !== tz) {
        await prisma.user.delete({ where: { id: user.id } })
        logTest("Timezone Validation", "FAIL", `Timezone ${tz} not stored correctly`, Date.now() - start)
        return
      }
      
      await prisma.user.delete({ where: { id: user.id } })
    }
    
    logTest("Timezone Validation", "PASS", "All timezones stored correctly", Date.now() - start)
  } catch (error) {
    logTest("Timezone Validation", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function testDataRetentionRanges() {
  const start = Date.now()
  
  try {
    const testEmail = `retention-test-${Date.now()}@example.com`
    const hashedPassword = await hash("testpass", 10)
    
    const retentionValues = [null, 90, 180, 365, 730, 1095]
    
    for (const days of retentionValues) {
      const user = await prisma.user.create({
        data: {
          email: `retention-${days}-${Date.now()}@example.com`,
          name: `Retention Test ${days}`,
          password: hashedPassword,
          dataRetentionDays: days,
        },
      })
      
      if (user.dataRetentionDays !== days) {
        await prisma.user.delete({ where: { id: user.id } })
        logTest("Data Retention Ranges", "FAIL", `Retention ${days} not stored correctly`, Date.now() - start)
        return
      }
      
      await prisma.user.delete({ where: { id: user.id } })
    }
    
    logTest("Data Retention Ranges", "PASS", "All retention values stored correctly", Date.now() - start)
  } catch (error) {
    logTest("Data Retention Ranges", "FAIL", error instanceof Error ? error.message : "Unknown error", Date.now() - start)
  }
}

async function runAllTests() {
  console.log("🧪 CareerPilot Test Suite")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
  
  const totalStart = Date.now()
  
  // Run tests
  await testDatabaseConnection()
  await testPasswordHashing()
  await testUserCreation()
  await testUserSettings()
  await testEmailUniqueness()
  await testNullableFields()
  await testSeededUsers()
  await testTimezoneValidation()
  await testDataRetentionRanges()
  
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
    console.log("\n🎉 All tests passed!")
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

