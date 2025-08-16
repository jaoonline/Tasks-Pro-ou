"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TaskDetailDialog } from "@/components/task-detail-dialog"
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
  createdAt: string
  projectId: string
  projectName: string
  updatedAt?: string
  tags?: string[]
  comments?: any[]
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  tasks: Task[]
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [viewMode, setViewMode] = useState<"month" | "week">("month")

  // Sample tasks data
  const tasks: Task[] = [
    {
      id: "1",
      title: "Design System Updates",
      description: "Update the design system components and documentation",
      status: "in-progress",
      priority: "high",
      assignee: "John Doe",
      dueDate: "2024-01-25",
      createdAt: "2024-01-20T10:00:00Z",
      projectId: "1",
      projectName: "Website Redesign",
      tags: ["design", "ui"],
    },
    {
      id: "2",
      title: "API Integration",
      description: "Integrate the new payment API",
      status: "todo",
      priority: "medium",
      assignee: "Jane Smith",
      dueDate: "2024-01-28",
      createdAt: "2024-01-22T14:30:00Z",
      projectId: "2",
      projectName: "Mobile App Development",
      tags: ["backend", "api"],
    },
    {
      id: "3",
      title: "User Testing",
      description: "Conduct user testing sessions for the new features",
      status: "completed",
      priority: "high",
      assignee: "Mike Johnson",
      dueDate: "2024-01-24",
      createdAt: "2024-01-18T09:15:00Z",
      projectId: "1",
      projectName: "Website Redesign",
      tags: ["testing", "ux"],
    },
    {
      id: "4",
      title: "Database Migration",
      description: "Migrate user data to the new database schema",
      status: "in-progress",
      priority: "high",
      assignee: "Sarah Wilson",
      dueDate: "2024-01-30",
      createdAt: "2024-01-23T11:45:00Z",
      projectId: "3",
      projectName: "Infrastructure Update",
      tags: ["database", "migration"],
    },
    {
      id: "5",
      title: "Marketing Campaign",
      description: "Launch the Q1 marketing campaign",
      status: "todo",
      priority: "medium",
      assignee: "Alex Chen",
      dueDate: "2024-02-01",
      createdAt: "2024-01-24T16:20:00Z",
      projectId: "4",
      projectName: "Marketing Initiative",
      tags: ["marketing", "campaign"],
    },
  ]

  useEffect(() => {
    generateCalendarDays()
  }, [currentDate, viewMode])

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const today = new Date()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const days: CalendarDay[] = []

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        tasks: getTasksForDate(date),
      })
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        tasks: getTasksForDate(date),
      })
    }

    // Add days from next month
    const remainingDays = 42 - days.length // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        tasks: getTasksForDate(date),
      })
    }

    setCalendarDays(days)
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDialogOpen(true)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    // In a real app, this would update the task in the backend
    console.log("Task updated:", updatedTask)
    generateCalendarDays() // Refresh calendar
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "in-progress":
        return "text-blue-600 bg-blue-50"
      case "todo":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-6 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your tasks and deadlines</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="h-8"
            >
              Month
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="h-8"
            >
              Week
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-t">
            {/* Week day headers */}
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 border-r border-b">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] p-2 border-r border-b relative",
                  !day.isCurrentMonth && "bg-gray-50",
                  day.isToday && "bg-blue-50 border-blue-200",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      !day.isCurrentMonth && "text-gray-400",
                      day.isToday && "text-blue-600 font-bold",
                    )}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.tasks.length > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {day.tasks.length}
                    </Badge>
                  )}
                </div>

                {/* Tasks for this day */}
                <div className="space-y-1">
                  {day.tasks.slice(0, 2).map((task) => (
                    <div key={task.id} onClick={() => handleTaskClick(task)} className="cursor-pointer group">
                      <div className="flex items-center gap-1 p-1 rounded text-xs hover:bg-white hover:shadow-sm transition-all duration-200">
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getPriorityColor(task.priority))} />
                        <span className="truncate font-medium text-gray-700 group-hover:text-gray-900">
                          {task.title}
                        </span>
                      </div>
                    </div>
                  ))}
                  {day.tasks.length > 2 && (
                    <div className="text-xs text-gray-500 pl-3">+{day.tasks.length - 2} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 scrollbar-hide">
          {tasks
            .filter((task) => new Date(task.dueDate) >= new Date())
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="flex items-center gap-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <div className={cn("w-3 h-3 rounded-full flex-shrink-0", getPriorityColor(task.priority))} />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <Badge variant="secondary" className={getStatusColor(task.status)}>
                      {task.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {task.assignee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{task.projectName}</span>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTask}
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false)
          setSelectedTask(null)
        }}
        onUpdate={handleTaskUpdate}
      />
    </div>
  )
}
