// Server-side exports
export { authOptions } from "./options"
export { getCurrentUser, requireAuth } from "./session"
export { hashPassword, verifyPassword } from "./hash"
export { requireAuth as requireApiAuth, getUserFromRequest } from "./apiAuth"

// Client-side exports (re-export from next-auth/react)
export { useSession } from "next-auth/react"
export { SessionProvider } from "next-auth/react"

