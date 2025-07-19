import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { BookmarksProvider } from "@/lib/bookmarks-context"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "HR Performance Dashboard",
  description: "Track employee performance and manage bookmarks",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <BookmarksProvider>
            {children}
            <Toaster />
          </BookmarksProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
