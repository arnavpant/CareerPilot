"use client"

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from "next-auth/react"

export { useSession }

export async function signIn(email: string, password: string) {
  const result = await nextAuthSignIn("credentials", {
    email,
    password,
    redirect: false,
  })

  if (result?.error) {
    throw new Error(result.error)
  }

  return result
}

export async function signInWithGoogle() {
  return nextAuthSignIn("google", { callbackUrl: "/dashboard" })
}

export async function signOut() {
  return nextAuthSignOut({ callbackUrl: "/signin" })
}

