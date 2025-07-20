"use client"

import { useEffect, useState } from "react"
import { getEmployeesByIds } from "@/lib/data"
import type { Employee } from "@/lib/types"
import EmployeeCard from "./employee-card"
import { useToast } from "./ui/use-toast"

interface BookmarksListProps {
  bookmarkIds: number[]
}

export default function BookmarksList({ bookmarkIds }: BookmarksListProps) {
  const [bookmarkedEmployees, setBookmarkedEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBookmarkedEmployees = async () => {
      if (bookmarkIds.length === 0) {
        setBookmarkedEmployees([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const employees = await getEmployeesByIds(bookmarkIds)
        setBookmarkedEmployees(employees)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load bookmarked employees.",
          variant: "destructive",
        })
        console.error("Failed to fetch bookmarked employees:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarkedEmployees()
  }, [bookmarkIds, toast])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {[...Array(Math.min(3, bookmarkIds.length || 1))].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse min-h-[300px]">
            <div className="h-6 bg-muted rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-muted rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-muted rounded mb-4 w-2/3"></div>
            <div className="h-8 bg-muted rounded mt-4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (bookmarkIds.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No bookmarked employees</h3>
        <p className="text-muted-foreground">Bookmark employees from the dashboard to see them here</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {bookmarkedEmployees.map((employee, index) => (
        <div key={employee.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
          <EmployeeCard employee={employee} />
        </div>
      ))}
    </div>
  )
}
