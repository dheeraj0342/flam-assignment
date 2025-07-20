"use client"

import type { Employee } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Separator } from "./ui/separator"
import { Progress } from "./ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Bookmark, Eye, Star, TrendingUp, Mail } from "lucide-react"
import Link from "next/link"
import { useBookmarks } from "@/lib/bookmarks-context"
import { useToast } from "./ui/use-toast"
import { cn } from "@/lib/utils"

interface EmployeeCardProps {
  employee: Employee
}

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks()
  const { toast } = useToast()

  const isBookmarked = bookmarks.includes(employee.id)

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmark(employee.id)
      toast({
        description: `${employee.firstName} ${employee.lastName} removed from bookmarks`,
      })
    } else {
      addBookmark(employee.id)
      toast({
        description: `${employee.firstName} ${employee.lastName} added to bookmarks`,
      })
    }
  }

  const handlePromote = () => {
    toast({
      title: "Employee Promoted",
      description: `${employee.firstName} ${employee.lastName} has been promoted!`,
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500"
    if (rating >= 3) return "bg-blue-500"
    if (rating >= 2) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4) return { label: "Excellent", variant: "default" as const }
    if (rating >= 3) return { label: "Good", variant: "secondary" as const }
    if (rating >= 2) return { label: "Average", variant: "outline" as const }
    return { label: "Needs Improvement", variant: "destructive" as const }
  }

  const performanceLevel = getPerformanceLevel(employee.performanceRating)

  return (
    <TooltipProvider>
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20 group overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 transition-all duration-300 group-hover:scale-105">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${employee.id}`}
                alt={`${employee.firstName} ${employee.lastName}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">
                {employee.firstName} {employee.lastName}
              </CardTitle>
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span className="truncate">{employee.email}</span>
              </div>
            </div>
            <Badge variant="outline" className="transition-all duration-300 group-hover:scale-110">
              {employee.department}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Age</span>
              <p className="font-medium">{employee.age}</p>
            </div>
            <div>
              <span className="text-muted-foreground">ID</span>
              <p className="font-medium">#{employee.id}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Performance Rating</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4 transition-all duration-300",
                      i < employee.performanceRating
                        ? "text-yellow-500 fill-yellow-500 group-hover:scale-110"
                        : "text-muted-foreground",
                    )}
                  />
                ))}
              </div>
            </div>

            <Progress value={(employee.performanceRating / 5) * 100} className="h-2" />

            <div className="flex items-center justify-between">
              <Badge variant={performanceLevel.variant} className="text-xs">
                {performanceLevel.label}
              </Badge>
              <span className="text-sm text-muted-foreground">{employee.performanceRating}/5</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="grid grid-cols-3 gap-2 pt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <Link href={`/employee/${employee.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                className={cn("transition-all duration-300 hover:scale-105", isBookmarked && "animate-pulse-green")}
                onClick={handleBookmarkToggle}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isBookmarked ? "Remove Bookmark" : "Add Bookmark"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:scale-105 bg-transparent"
                onClick={handlePromote}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Promote Employee</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
