"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MoreHorizontal, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "completed" | "on-hold"
  priority: "low" | "medium" | "high"
  startDate: string
  endDate: string
  teamMembers: string[]
  progress: number
  tasksTotal: number
  tasksCompleted: number
  createdAt: string
}

interface ProjectTimelineViewProps {
  projects: Project[]
  onProjectDetails: (projectId: string) => void
}

export function ProjectTimelineView({ projects, onProjectDetails }: ProjectTimelineViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "active":
        return "bg-blue-500"
      case "planning":
        return "bg-yellow-500"
      case "on-hold":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getProjectPosition = (project: Project) => {
    const startDate = new Date(project.startDate)
    const endDate = new Date(project.endDate)
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Calculate position within the month
    const totalDays = getDaysInMonth(currentMonth)
    const projectStart = Math.max(1, startDate.getDate())
    const projectEnd = Math.min(totalDays, endDate.getDate())

    // If project doesn't overlap with current month, return null
    if (endDate < monthStart || startDate > monthEnd) {
      return null
    }

    const startPercent = ((projectStart - 1) / totalDays) * 100
    const widthPercent = ((projectEnd - projectStart + 1) / totalDays) * 100

    return {
      left: `${startPercent}%`,
      width: `${Math.max(widthPercent, 5)}%`, // Minimum 5% width for visibility
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + (direction === "next" ? 1 : -1), 1))
  }

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Generate days for the current month
  const daysInMonth = getDaysInMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Filter projects that are visible in current month
  const visibleProjects = projects.filter((project) => {
    const startDate = new Date(project.startDate)
    const endDate = new Date(project.endDate)
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    return !(endDate < monthStart || startDate > monthEnd)
  })

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Project Timeline
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[140px] text-center">{monthName}</span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-4 text-xs text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="relative">
            <div className="grid grid-cols-7 gap-1 mb-6">
              {/* Empty cells for days before month start */}
              {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map(
                (_, i) => (
                  <div key={`empty-${i}`} className="h-8"></div>
                ),
              )}
              {/* Days of the month */}
              {days.map((day) => (
                <div key={day} className="h-8 flex items-center justify-center text-sm border rounded">
                  {day}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Timeline */}
      <div className="space-y-4">
        {visibleProjects.map((project) => {
          const position = getProjectPosition(project)
          if (!position) return null

          return (
            <Card key={project.id} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}></div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {project.status}
                    </Badge>
                    <Badge variant={getPriorityColor(project.priority) as any} className="text-xs">
                      {project.priority}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onProjectDetails(project.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Progress</div>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Duration</div>
                    <div className="text-sm">
                      {new Date(project.startDate).toLocaleDateString()} -{" "}
                      {new Date(project.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Team</div>
                    <div className="flex items-center gap-1">
                      {project.teamMembers.slice(0, 3).map((memberName, index) => (
                        <Avatar key={index} className="w-6 h-6">
                          <AvatarFallback className="text-xs">{getInitials(memberName)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.teamMembers.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 h-full ${getStatusColor(project.status)} rounded-full opacity-80`}
                    style={position}
                  >
                    <div className="h-full bg-gradient-to-r from-transparent to-white/20"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-xs font-medium text-white mix-blend-difference">{project.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {visibleProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects in {monthName}</h3>
            <p className="text-muted-foreground">Navigate to different months to see other projects.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
