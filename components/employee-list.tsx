"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getEmployees } from "@/lib/data"
import EmployeeCard from "./employee-card"
import type { Employee } from "@/lib/types"
import { useToast } from "./ui/use-toast"

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const searchTerm = searchParams.get("search") || ""
  const departmentFilter = searchParams.get("departments")?.split(",") || []
  const ratingFilter = searchParams.get("ratings")?.split(",").map(Number) || []

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const data = await getEmployees()
        setEmployees(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load employees. Please try again.",
          variant: "destructive",
        })
        console.error("Failed to fetch employees:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [toast])

  const filteredEmployees = employees.filter((employee) => {
    // Search filter
    const matchesSearch = searchTerm
      ? `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      : true

    // Department filter
    const matchesDepartment = departmentFilter.length > 0 ? departmentFilter.includes(employee.department) : true

    // Rating filter
    const matchesRating = ratingFilter.length > 0 ? ratingFilter.includes(employee.performanceRating) : true

    return matchesSearch && matchesDepartment && matchesRating
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {[...Array(6)].map((_, i) => (
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

  if (filteredEmployees.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No employees found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {filteredEmployees.map((employee, index) => (
        <div key={employee.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
          <EmployeeCard employee={employee} />
        </div>
      ))}
    </div>
  )
}
