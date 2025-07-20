"use client"

import { cn } from "@/lib/utils"
import { BarChart3, Bookmark, Home, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { useBookmarks } from "@/lib/bookmarks-context"

const navItems = [
  { name: "Employees", href: "/", icon: Users },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark, showBadge: true },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { bookmarks } = useBookmarks()

  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r border-border transition-all duration-300">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          HR Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Performance Management</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <Button
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-300",
                    isActive ? "shadow-md" : "hover:translate-x-1",
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {item.showBadge && bookmarks.length > 0 && (
                      <Badge variant="secondary" className="ml-auto h-5 w-5 p-0 text-xs">
                        {bookmarks.length}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>

      <Separator />

      <div className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          <p className="font-medium">HR Performance Dashboard</p>
          <p>Version 1.0</p>
        </div>
      </div>
    </div>
  )
}
