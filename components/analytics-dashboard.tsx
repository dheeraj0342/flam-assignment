"use client"

import { ChartTooltip } from "@/components/ui/chart"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { getEmployees } from "@/lib/data"
import type { Employee } from "@/lib/types"
import { useBookmarks } from "@/lib/bookmarks-context"
import { useToast } from "./ui/use-toast"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "./ui/chart"
import { TrendingUp, Users, Star, Bookmark } from "lucide-react"
import { BarChart3 } from "lucide-react" 

export default function AnalyticsDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const { bookmarks } = useBookmarks()
  const { toast } = useToast()

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const data = await getEmployees()
        setEmployees(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load analytics data.",
          variant: "destructive",
        })
        console.error("Failed to fetch employees for analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [toast])

  const totalEmployees = employees.length
  const averageRating = employees.reduce((sum, emp) => sum + emp.performanceRating, 0) / totalEmployees || 0
  const topPerformers = employees.filter((emp) => emp.performanceRating >= 4).length
  const bookmarkedCount = bookmarks.length

  const departmentRatings = employees.reduce(
    (acc, employee) => {
      if (!acc[employee.department]) {
        acc[employee.department] = {
          count: 0,
          total: 0,
        }
      }

      acc[employee.department].count += 1
      acc[employee.department].total += employee.performanceRating

      return acc
    },
    {} as Record<string, { count: number; total: number }>,
  )

  const departmentRatingsData = Object.entries(departmentRatings).map(([department, data]) => ({
    department,
    averageRating: data.total / data.count,
    employeeCount: data.count,
  }))

  const bookmarkTrendData = [
    { month: "Jan", bookmarks: 12 },
    { month: "Feb", bookmarks: 19 },
    { month: "Mar", bookmarks: 15 },
    { month: "Apr", bookmarks: 27 },
    { month: "May", bookmarks: 24 },
    { month: "Jun", bookmarks: 32 },
    { month: "Jul", bookmarks: bookmarks.length },
  ]

  const performanceDistribution = employees.reduce(
    (acc, employee) => {
      const rating = employee.performanceRating
      if (!acc[rating]) {
        acc[rating] = 0
      }
      acc[rating] += 1
      return acc
    },
    {} as Record<number, number>,
  )

  const performanceDistributionData = Object.entries(performanceDistribution).map(([rating, count]) => ({
    rating: `${rating} Star${Number(rating) !== 1 ? "s" : ""}`,
    count,
  }))
  const departmentSizeData = Object.entries(departmentRatings).map(([department, data]) => ({
    department,
    employees: data.count,
  }))

  if (loading) {
    return (
      <div className="space-y-6">
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="min-h-[400px]">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="animate-fade-in transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in animation-delay-100 transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <Progress value={(averageRating / 5) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="animate-fade-in animation-delay-200 transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topPerformers}</div>
            <p className="text-xs text-muted-foreground">
              {((topPerformers / totalEmployees) * 100).toFixed(1)}% of workforce
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in animation-delay-300 transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookmarked</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookmarkedCount}</div>
            <p className="text-xs text-muted-foreground">Saved employees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-fade-in animation-delay-100">
          <Card className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Department Performance
              </CardTitle>
              <CardDescription>Average performance rating by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  averageRating: {
                    label: "Average Rating",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentRatingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageRating" name="Average Rating" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in animation-delay-200">
          <Card className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Bookmark Trends
              </CardTitle>
              <CardDescription>Employee bookmarks over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  bookmarks: {
                    label: "Bookmarks",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookmarkTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bookmarks"
                      name="Bookmarks"
                      stroke="hsl(var(--chart-2))"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in animation-delay-300">
          <Card className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Performance Distribution
              </CardTitle>
              <CardDescription>Number of employees by rating</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: {
                    label: "Employees",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" name="Employees" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in animation-delay-400">
          <Card className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Department Size
              </CardTitle>
              <CardDescription>Number of employees by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  employees: {
                    label: "Employees",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentSizeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="employees" name="Employees" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
