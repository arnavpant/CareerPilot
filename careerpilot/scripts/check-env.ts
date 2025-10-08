/**
 * Environment validation script
 * Checks if all required environment variables are set
 */

const required = [
  { key: "DATABASE_URL", description: "PostgreSQL connection string (from Neon or local)" },
  { key: "NEXTAUTH_URL", description: "App URL (http://localhost:3000 for dev)" },
  { key: "NEXTAUTH_SECRET", description: "Random secret (generate with: openssl rand -base64 32)" },
]

const optional = [
  { key: "GOOGLE_CLIENT_ID", description: "Google OAuth client ID (optional)" },
  { key: "GOOGLE_CLIENT_SECRET", description: "Google OAuth client secret (optional)" },
]

console.log("🔍 Checking environment variables...\n")

let hasErrors = false

// Check required
console.log("📋 Required Variables:")
required.forEach(({ key, description }) => {
  const value = process.env[key]
  if (!value) {
    console.log(`❌ ${key} - MISSING`)
    console.log(`   ${description}`)
    hasErrors = true
  } else {
    // Mask sensitive values
    const display = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}`
      : value
    console.log(`✅ ${key} - SET (${display})`)
  }
})

// Check optional
console.log("\n🔧 Optional Variables:")
optional.forEach(({ key, description }) => {
  const value = process.env[key]
  if (!value) {
    console.log(`⚠️  ${key} - NOT SET (${description})`)
  } else {
    const display = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 5)}`
      : value
    console.log(`✅ ${key} - SET (${display})`)
  }
})

if (hasErrors) {
  console.log("\n❌ Missing required environment variables!")
  console.log("\n📝 Quick Setup:")
  console.log("1. Copy .env.example to .env:")
  console.log("   cp .env.example .env")
  console.log("\n2. Get a free database from Neon:")
  console.log("   https://neon.tech")
  console.log("\n3. Generate NEXTAUTH_SECRET:")
  console.log("   openssl rand -base64 32")
  console.log("\n4. Update .env with your values")
  process.exit(1)
}

console.log("\n✅ All required environment variables are set!")
console.log("🚀 Ready to run tests and start the app!")

