import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata: Metadata = {
  title: "CareerPilot - Job Application Tracker",
  description: "Track your job applications with style",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: "glass-panel border-0",
            style: {
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "white",
            },
          }}
        />
      </body>
    </html>
  )
}
