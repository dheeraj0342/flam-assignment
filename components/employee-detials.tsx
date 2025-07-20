"use client"

import type { Employee, PerformanceHistory, Project } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Progress } from "./ui/progress"
import { ScrollArea } from "./ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Bookmark, Mail, MapPin, Phone, Star, TrendingUp, Calendar, User, Briefcase } from "lucide-react"
import { useBookmarks } from "@/lib/bookmarks-context"
import { useToast } from "./ui/use-toast"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { generatePerformanceHistory, generateProjects } from "@/lib/mock-data"

interface EmployeeDetailsProps {
  employee: Employee
}

export default function EmployeeDetails({ employee }: EmployeeDetailsProps) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks()
  const { toast } = useToast()
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceHistory[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const isBookmarked = bookmarks.includes(employee.id)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        setPerformanceHistory(generatePerformanceHistory(employee.id))
        setProjects(generateProjects(employee.id))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [employee.id])

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

  const getPerformanceLevel = (rating: number) => {
    if (rating >= 4) return { label: "Excellent Performer", variant: "default" as const, color: "bg-green-500" }
    if (rating >= 3) return { label: "Good Performer", variant: "secondary" as const, color: "bg-blue-500" }
    if (rating >= 2) return { label: "Average Performer", variant: "outline" as const, color: "bg-yellow-500" }
    return { label: "Needs Improvement", variant: "destructive" as const, color: "bg-red-500" }
  }

  const performanceLevel = getPerformanceLevel(employee.performanceRating)

  return (
    <TooltipProvider>
      <div className="grid gap-6">
        <Card className="animate-fade-in transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex flex-col items-center lg:items-start gap-4">
                <Avatar className="h-32 w-32 transition-all duration-300 hover:scale-105">
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${employee.id}`}
                    alt={`${employee.firstName} ${employee.lastName}`}
                  />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {employee.firstName[0]}
                    {employee.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isBookmarked ? "default" : "outline"}
                        onClick={handleBookmarkToggle}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        <Bookmark className={cn("mr-2 h-4 w-4", isBookmarked && "fill-current")} />
                        {isBookmarked ? "Bookmarked" : "Bookmark"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handlePromote} className="transition-all duration-300 hover:scale-105">
                        <TrendingUp className="mr-2 h-4 w-4" /> Promote
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Promote this employee</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <p className="text-xl text-muted-foreground">{employee.department}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={performanceLevel.variant} className="text-sm px-3 py-1">
                    {performanceLevel.label}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    ID: #{employee.id}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Performance Rating</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-5 h-5 transition-all duration-300",
                            i < employee.performanceRating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-muted-foreground",
                          )}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">{employee.performanceRating}/5</span>
                    </div>
                  </div>
                  <Progress value={(employee.performanceRating / 5) * 100} className="h-3" />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{employee.phone || "+1 (555) 123-4567"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {employee.address?.city || "New York"}, {employee.address?.state || "NY"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{employee.age} years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="animate-fade-in animation-delay-200">
          <TabsList className="grid grid-cols-3 mb-6 h-12">
            <TabsTrigger value="overview" className="transition-all duration-300 data-[state=active]:shadow-md">
              <User className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="transition-all duration-300 data-[state=active]:shadow-md">
              <Briefcase className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="feedback" className="transition-all duration-300 data-[state=active]:shadow-md">
              <Star className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-fade-in space-y-6">
            <Card className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
              <CardHeader>
                <CardTitle>Professional Background</CardTitle>
                <CardDescription>Skills, experience, and career highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="mb-4 leading-relaxed">
                    {employee.firstName} {employee.lastName} is a dedicated professional with{" "}
                    {Math.floor(Math.random() * 10) + 2} years of experience in the {employee.department} department.
                    They have consistently demonstrated strong skills in team collaboration, problem-solving, and
                    leadership.
                  </p>
                  <p className="leading-relaxed">
                    Their expertise includes project management, strategic planning, and cross-functional team
                    coordination.
                    {employee.firstName} has been recognized for their contributions to key company initiatives and
                    their commitment to excellence.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Key Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Leadership", "Communication", "Problem Solving", "Team Building", "Strategic Planning"].map(
                      (skill, index) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="transition-all duration-300 hover:scale-105 px-3 py-1"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {skill}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Performance History
                </CardTitle>
                <CardDescription>Past performance evaluations and reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse space-y-2">
                        <div className="h-5 bg-muted rounded w-1/4"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-80">
                    <div className="space-y-4">
                      {performanceHistory.map((item, index) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg border bg-card transition-all duration-300 hover:bg-muted/50 animate-fade-in"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold">{item.reviewPeriod}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Reviewer: {item.reviewer}</p>
                          <p className="text-sm leading-relaxed">{item.comments}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="animate-fade-in">
            <Card className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Projects Portfolio
                </CardTitle>
                <CardDescription>Current and completed project assignments</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse space-y-3">
                        <div className="h-5 bg-muted rounded w-1/3"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="flex gap-2">
                          <div className="h-6 bg-muted rounded w-16"></div>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-80">
                    <div className="space-y-6">
                      {projects.map((project, index) => (
                        <div
                          key={project.id}
                          className="p-4 rounded-lg border bg-card transition-all duration-300 hover:bg-muted/50 animate-fade-in"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="space-y-3">
                            <h4 className="font-semibold text-lg">{project.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {project.startDate} - {project.endDate || "Present"}
                            </p>
                            <p className="leading-relaxed">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant={
                                  project.status === "Completed"
                                    ? "default"
                                    : project.status === "In Progress"
                                      ? "secondary"
                                      : "outline"
                                }
                                className="transition-all duration-300 hover:scale-105"
                              >
                                {project.status}
                              </Badge>
                              {project.role && (
                                <Badge variant="outline" className="transition-all duration-300 hover:scale-105">
                                  {project.role}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="animate-fade-in">
            <Card className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Feedback & Reviews
                </CardTitle>
                <CardDescription>Peer and manager feedback from performance reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex gap-3 mb-3">
                          <div className="h-10 w-10 bg-muted rounded-full"></div>
                          <div className="space-y-1">
                            <div className="h-4 bg-muted rounded w-32"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="h-4 bg-muted rounded w-full"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-80">
                    <div className="space-y-6">
                      {performanceHistory.map((item, index) => (
                        <div
                          key={`feedback-${item.id}`}
                          className="p-4 rounded-lg border bg-card transition-all duration-300 hover:bg-muted/50 animate-fade-in"
                          style={{ animationDelay: `${index * 150}ms` }}
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${item.id + 100}`} alt={item.reviewer} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {item.reviewer.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.reviewer}</h4>
                              <p className="text-sm text-muted-foreground">{item.reviewPeriod}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < item.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="leading-relaxed">{item.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
