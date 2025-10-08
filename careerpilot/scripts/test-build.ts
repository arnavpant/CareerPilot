/**
 * Test the build process
 * This can run without a database
 */

import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function testBuild() {
  console.log("🏗️  Testing Build Process")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
  
  const start = Date.now()
  
  try {
    console.log("📦 Running: npm run build")
    console.log("This may take 15-30 seconds...\n")
    
    const { stdout, stderr } = await execAsync("npm run build")
    
    const duration = Date.now() - start
    
    console.log(stdout)
    
    if (stderr && !stderr.includes("webpack.cache")) {
      console.log("Warnings:", stderr)
    }
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("📊 Build Test Results")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log(`\n✅ Build successful!`)
    console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`)
    console.log("\n🎉 Your app is ready to deploy!")
    
  } catch (error: any) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("📊 Build Test Results")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("\n❌ Build failed!")
    console.log("\nError output:")
    console.log(error.stdout || error.message)
    process.exit(1)
  }
}

testBuild()

