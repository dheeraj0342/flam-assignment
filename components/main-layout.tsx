"use client"

import type React from "react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Sidebar from "./sidebar"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <div className="container mx-auto p-4 md:p-6 animate-fade-in">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="transition-all duration-300 hover:rotate-12"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <main className="animate-scale-in">{children}</main>
        </div>
      </div>
    </div>
  )
}
