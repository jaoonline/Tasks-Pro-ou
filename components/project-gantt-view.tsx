"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Calendar, Clock, Users, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GanttTask {
  id: string
  name: string
  startDate: Date
  endDate: Date
  progress: number
  assignee: string
  priority: "low" | "medium" | "high" | "urgent"
  dependencies: string[]
  color: string
}

const mockTasks: GanttTask[] = [
  {
    id: "1",
    name: "Project Planning",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 7),
    progress: 100,
    assignee: "John Doe",
    priority: "high",
    dependencies: [],
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "UI/UX Design",
    startDate: new Date(2024, 0, 8),
    endDate: new Date(2024, 0, 21),
    progress: 75,
    assignee: "Sarah Johnson",
    priority: "high",
    dependencies: ["1"],
    color: "#10b981",
  },
  {
    id: "3",
    name: "Frontend Development",
    startDate: new Date(2024, 0, 15),
    endDate: new Date(2024, 1, 15),
    progress: 45,
    assignee: "Mike Wilson",
    priority: "medium",
    dependencies: ["2"],
    color: "#f59e0b",
  },
  {
    id: "4",
    name: "Backend Development",
    startDate: new Date(2024, 0, 22),
    endDate: new Date(2024, 1, 20),
    progress: 30,
    assignee: "Emily Davis",
    priority: "medium",
    dependencies: ["1"],
    color: "#ef4444",
  },
  {
    id: "5",
    name: "Testing & QA",
    startDate: new Date(2024, 1, 16),
    endDate: new Date(2024, 2, 1),
    progress: 0,
    assignee: "Alex Brown",
    priority: "high",
    dependencies: ["3", "4"],
    color: "#8b5cf6",
  },
  {
    id: "6",
    name: "Deployment",
    startDate: new Date(2024, 2, 2),
    endDate: new Date(2024, 2, 8),
    progress: 0,
    assignee: "John Doe",
    priority: "urgent",
    dependencies: ["5"],
    color: "#06b6d4",
  },
]

type ViewMode = "days" | "weeks" | "months"

export function ProjectGanttView() {
  const [tasks, setTasks] = useState<GanttTask[]>(mockTasks)
  const [viewMode, setViewMode] = useState<ViewMode>("weeks")
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))
  const [zoom, setZoom] = useState(1)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const getDaysInView = () => {
    switch (viewMode) {
      case "days":
        return 30
      case "weeks":
        return 84 // 12 weeks
      case "months":
        return 365 // 12 months
      default:
        return 84
    }
  }

  const getTimeUnit = () => {
    switch (viewMode) {
      case "days":
        return "day"
      case "weeks":
        return "week"
      case "months":
        return "month"
      default:
        return "week"
    }
  }

  const generateTimeHeaders = () => {
    const headers = []
    const daysInView = getDaysInView()
    const startDate = new Date(currentDate)

    for (let i = 0; i < daysInView; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      if (viewMode === "days") {
        headers.push({
          date: new Date(date),
          label: date.getDate().toString(),
          isWeekend: date.getDay() === 0 || date.getDay() === 6,
        })
      } else if (viewMode === "weeks" && date.getDay() === 1) {
        headers.push({
          date: new Date(date),
          label: `W${Math.ceil(date.getDate() / 7)}`,
          isWeekend: false,
        })
      } else if (viewMode === "months" && date.getDate() === 1) {
        headers.push({
          date: new Date(date),
          label: date.toLocaleDateString("en-US", { month: "short" }),
          isWeekend: false,
        })
      }
    }

    return headers
  }

  const getTaskPosition = (task: GanttTask) => {
    const startDate = new Date(currentDate)
    const taskStart = new Date(task.startDate)
    const taskEnd = new Date(task.endDate)

    const daysDiff = Math.floor((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const duration = Math.floor((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24))

    const unitWidth = viewMode === "days" ? 40 : viewMode === "weeks" ? 80 : 120
    const left = Math.max(0, daysDiff * (unitWidth / (viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30)))
    const width = Math.max(20, duration * (unitWidth / (viewMode === "days" ? 1 : viewMode === "weeks" ? 7 : 30)))

    return { left: left * zoom, width: width * zoom }
  }

  const handleTaskDrag = (taskId: string, newStartDate: Date) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const duration = task.endDate.getTime() - task.startDate.getTime()
          const newEndDate = new Date(newStartDate.getTime() + duration)
          return { ...task, startDate: newStartDate, endDate: newEndDate }
        }
        return task
      }),
    )
  }

  const navigateTime = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    const amount = viewMode === "days" ? 7 : viewMode === "weeks" ? 28 : 90

    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - amount)
    } else {
      newDate.setDate(newDate.getDate() + amount)
    }

    setCurrentDate(newDate)
  }

  const getPriorityColor = (priority: GanttTask["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const timeHeaders = generateTimeHeaders()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Gantt Chart
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => navigateTime("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateTime("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex">
          {/* Task List */}
          <div className="w-80 border-r bg-muted/30">
            <div className="h-12 border-b bg-background px-4 flex items-center font-medium">Task Name</div>
            <ScrollArea className="h-96">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`h-12 border-b px-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer ${
                    selectedTask === task.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedTask(task.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: task.color }} />
                    <span className="text-sm font-medium truncate">{task.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Add Dependency</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Timeline */}
          <div className="flex-1">
            {/* Time Headers */}
            <div className="h-12 border-b bg-background overflow-x-auto" ref={scrollRef}>
              <div className="flex" style={{ minWidth: `${timeHeaders.length * 80 * zoom}px` }}>
                {timeHeaders.map((header, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 border-r px-2 flex items-center justify-center text-sm font-medium ${
                      header.isWeekend ? "bg-muted/50" : ""
                    }`}
                    style={{ width: `${80 * zoom}px` }}
                  >
                    {header.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt Bars */}
            <ScrollArea className="h-96">
              <div className="relative" style={{ minWidth: `${timeHeaders.length * 80 * zoom}px` }}>
                {/* Grid Lines */}
                {timeHeaders.map((_, index) => (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 border-r border-muted"
                    style={{ left: `${index * 80 * zoom}px` }}
                  />
                ))}

                {/* Task Bars */}
                {tasks.map((task, taskIndex) => {
                  const position = getTaskPosition(task)
                  return (
                    <div
                      key={task.id}
                      className="absolute h-12 border-b flex items-center"
                      style={{ top: `${taskIndex * 48}px`, left: 0, right: 0 }}
                    >
                      <div
                        className={`relative h-6 rounded cursor-pointer transition-all hover:opacity-80 ${
                          selectedTask === task.id ? "ring-2 ring-primary" : ""
                        }`}
                        style={{
                          left: `${position.left}px`,
                          width: `${position.width}px`,
                          backgroundColor: task.color,
                        }}
                        onClick={() => setSelectedTask(task.id)}
                        draggable
                        onDragStart={() => setDraggedTask(task.id)}
                        onDragEnd={() => setDraggedTask(null)}
                      >
                        {/* Progress Bar */}
                        <div
                          className="absolute top-0 left-0 h-full bg-white/30 rounded"
                          style={{ width: `${task.progress}%` }}
                        />

                        {/* Task Info */}
                        <div className="absolute left-2 top-0 h-full flex items-center">
                          <span className="text-xs text-white font-medium truncate">{task.progress}%</span>
                        </div>

                        {/* Assignee */}
                        <div className="absolute right-2 top-0 h-full flex items-center">
                          <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {task.assignee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dependencies */}
                      {task.dependencies.map((depId) => {
                        const depTask = tasks.find((t) => t.id === depId)
                        if (!depTask) return null

                        const depPosition = getTaskPosition(depTask)
                        const currentPosition = getTaskPosition(task)

                        return (
                          <svg
                            key={depId}
                            className="absolute pointer-events-none"
                            style={{
                              left: `${depPosition.left + depPosition.width}px`,
                              top: `-${(taskIndex - tasks.findIndex((t) => t.id === depId)) * 48 - 24}px`,
                              width: `${currentPosition.left - (depPosition.left + depPosition.width)}px`,
                              height: `${Math.abs(taskIndex - tasks.findIndex((t) => t.id === depId)) * 48 + 48}px`,
                            }}
                          >
                            <path
                              d={`M 0 24 L ${currentPosition.left - (depPosition.left + depPosition.width) - 10} 24 L ${currentPosition.left - (depPosition.left + depPosition.width) - 10} ${Math.abs(taskIndex - tasks.findIndex((t) => t.id === depId)) * 48} L ${currentPosition.left - (depPosition.left + depPosition.width)} ${Math.abs(taskIndex - tasks.findIndex((t) => t.id === depId)) * 48}`}
                              stroke="#6b7280"
                              strokeWidth="2"
                              fill="none"
                              markerEnd="url(#arrowhead)"
                            />
                            <defs>
                              <marker
                                id="arrowhead"
                                markerWidth="10"
                                markerHeight="7"
                                refX="9"
                                refY="3.5"
                                orient="auto"
                              >
                                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                              </marker>
                            </defs>
                          </svg>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Task Details Panel */}
        {selectedTask && (
          <div className="border-t p-4 bg-muted/30">
            {(() => {
              const task = tasks.find((t) => t.id === selectedTask)
              if (!task) return null

              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: task.color }} />
                    <div>
                      <h4 className="font-medium">{task.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.startDate.toLocaleDateString()} - {task.endDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.progress}% Complete
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit Task
                    </Button>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
