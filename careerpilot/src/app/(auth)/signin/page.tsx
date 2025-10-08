import { Suspense } from "react"
import { SignInForm } from "@/components/auth/SignInForm"

function SignInFormWrapper() {
  return <SignInForm />
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="glass-card p-8 w-full max-w-md animate-scale-in">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      }>
        <SignInFormWrapper />
      </Suspense>
    </div>
  )
}

