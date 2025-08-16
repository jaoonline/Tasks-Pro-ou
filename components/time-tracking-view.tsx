"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Play, Square, Clock, Plus, Calendar, BarChart3, Timer, Edit, Trash2, Download } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface TimeEntry {
  id: string
  taskId: string
  taskName: string
  projectName: string
  startTime: Date
  endTime?: Date
  duration: number // in minutes
  description: string
  isActive: boolean
}

interface Task {
  id: string
  name: string
  projectName: string
  estimatedHours: number
}

const mockTasks: Task[] = [
  { id: "1", name: "UI Design", projectName: "Website Redesign", estimatedHours: 20 },
  { id: "2", name: "Frontend Development", projectName: "Website Redesign", estimatedHours: 40 },
  { id: "3", name: "API Integration", projectName: "Mobile App", estimatedHours: 16 },
  { id: "4", name: "Database Migration", projectName: "Backend Upgrade", estimatedHours: 12 },
  { id: "5", name: "Testing", projectName: "Website Redesign", estimatedHours: 24 },
]

const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    taskId: "1",
    taskName: "UI Design",
    projectName: "Website Redesign",
    startTime: new Date(2024, 0, 15, 9, 0),
    endTime: new Date(2024, 0, 15, 12, 30),
    duration: 210,
    description: "Working on homepage layout",
    isActive: false,
  },
  {
    id: "2",
    taskId: "2",
    taskName: "Frontend Development",
    projectName: "Website Redesign",
    startTime: new Date(2024, 0, 15, 14, 0),
    endTime: new Date(2024, 0, 15, 17, 45),
    duration: 225,
    description: "Implementing responsive design",
    isActive: false,
  },
  {
    id: "3",
    taskId: "3",
    taskName: "API Integration",
    projectName: "Mobile App",
    startTime: new Date(2024, 0, 16, 10, 0),
    endTime: new Date(2024, 0, 16, 13, 0),
    duration: 180,
    description: "Connecting user authentication API",
    isActive: false,
  },
]

export function TimeTrackingView() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries)
  const [tasks] = useState<Task[]>(mockTasks)
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [selectedView, setSelectedView] = useState<"timer" | "entries" | "reports">("timer")
  const [newEntry, setNewEntry] = useState<Partial<TimeEntry>>({
    description: "",
  })

  // Update current time every second for active timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const startTimer = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId,
      taskName: task.name,
      projectName: task.projectName,
      startTime: new Date(),
      duration: 0,
      description: "",
      isActive: true,
    }

    setTimeEntries((prev) => [...prev, newEntry])
    setActiveTimer(newEntry.id)
  }

  const stopTimer = (entryId: string) => {
    setTimeEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === entryId && entry.isActive) {
          const endTime = new Date()
          const duration = Math.floor((endTime.getTime() - entry.startTime.getTime()) / (1000 * 60))
          return {
            ...entry,
            endTime,
            duration,
            isActive: false,
          }
        }
        return entry
      }),
    )
    setActiveTimer(null)
  }

  const addManualEntry = () => {
    if (!newEntry.taskId || !newEntry.startTime || !newEntry.endTime) return

    const task = tasks.find((t) => t.id === newEntry.taskId)
    if (!task) return

    const duration = Math.floor((newEntry.endTime.getTime() - newEntry.startTime.getTime()) / (1000 * 60))

    const entry: TimeEntry = {
      id: Date.now().toString(),
      taskId: newEntry.taskId,
      taskName: task.name,
      projectName: task.projectName,
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      duration,
      description: newEntry.description || "",
      isActive: false,
    }

    setTimeEntries((prev) => [...prev, entry])
    setNewEntry({ description: "" })
    setIsAddingEntry(false)
  }

  const deleteEntry = (entryId: string) => {
    setTimeEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    if (activeTimer === entryId) {
      setActiveTimer(null)
    }
  }

  const getActiveTimerDuration = (entry: TimeEntry) => {
    if (!entry.isActive) return entry.duration
    return Math.floor((currentTime.getTime() - entry.startTime.getTime()) / (1000 * 60))
  }

  // Calculate statistics
  const totalTimeToday = timeEntries
    .filter((entry) => {
      const today = new Date()
      return entry.startTime.toDateString() === today.toDateString()
    })
    .reduce((total, entry) => total + getActiveTimerDuration(entry), 0)

  const totalTimeThisWeek = timeEntries
    .filter((entry) => {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      return entry.startTime >= weekStart
    })
    .reduce((total, entry) => total + getActiveTimerDuration(entry), 0)

  // Prepare chart data
  const projectTimeData = tasks.map((task) => {
    const projectEntries = timeEntries.filter((entry) => entry.taskId === task.id)
    const totalTime = projectEntries.reduce((total, entry) => total + getActiveTimerDuration(entry), 0)
    const estimatedMinutes = task.estimatedHours * 60

    return {
      name: task.name,
      actual: Math.round((totalTime / 60) * 10) / 10,
      estimated: task.estimatedHours,
      efficiency: estimatedMinutes > 0 ? Math.round((totalTime / estimatedMinutes) * 100) : 0,
    }
  })

  const dailyTimeData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))

    const dayEntries = timeEntries.filter((entry) => entry.startTime.toDateString() === date.toDateString())

    const totalMinutes = dayEntries.reduce((total, entry) => total + getActiveTimerDuration(entry), 0)

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      hours: Math.round((totalMinutes / 60) * 10) / 10,
    }
  })

  const pieChartData = Object.entries(
    timeEntries.reduce(
      (acc, entry) => {
        const project = entry.projectName
        acc[project] = (acc[project] || 0) + getActiveTimerDuration(entry)
        return acc
      },
      {} as Record<string, number>,
    ),
  ).map(([project, minutes]) => ({
    name: project,
    value: Math.round((minutes / 60) * 10) / 10,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Time Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Time Entry</DialogTitle>
                  <DialogDescription>Manually add a time entry for a task.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task" className="text-right">
                      Task
                    </Label>
                    <Select
                      value={newEntry.taskId}
                      onValueChange={(value) => setNewEntry((prev) => ({ ...prev, taskId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a task" />
                      </SelectTrigger>
                      <SelectContent>
                        {tasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.name} - {task.projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="start-time" className="text-right">
                      Start Time
                    </Label>
                    <Input
                      id="start-time"
                      type="datetime-local"
                      value={newEntry.startTime?.toISOString().slice(0, 16)}
                      onChange={(e) => setNewEntry((prev) => ({ ...prev, startTime: new Date(e.target.value) }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="end-time" className="text-right">
                      End Time
                    </Label>
                    <Input
                      id="end-time"
                      type="datetime-local"
                      value={newEntry.endTime?.toISOString().slice(0, 16)}
                      onChange={(e) => setNewEntry((prev) => ({ ...prev, endTime: new Date(e.target.value) }))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newEntry.description}
                      onChange={(e) => setNewEntry((prev) => ({ ...prev, description: e.target.value }))}
                      className="col-span-3"
                      placeholder="What did you work on?"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingEntry(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addManualEntry}>Add Entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Today</p>
                  <p className="text-2xl font-bold">{formatDuration(totalTimeToday)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">{formatDuration(totalTimeThisWeek)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Timers</p>
                  <p className="text-2xl font-bold">{timeEntries.filter((e) => e.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedView} onValueChange={(value: any) => setSelectedView(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="entries" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Entries
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-4">
            <div className="grid gap-4">
              {tasks.map((task) => {
                const activeEntry = timeEntries.find((entry) => entry.taskId === task.id && entry.isActive)
                const isActive = !!activeEntry

                return (
                  <Card key={task.id} className={isActive ? "border-green-500" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.name}</h4>
                          <p className="text-sm text-muted-foreground">{task.projectName}</p>
                          {isActive && activeEntry && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-mono">
                                  {formatDuration(getActiveTimerDuration(activeEntry))}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Started at {formatTime(activeEntry.startTime)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{task.estimatedHours}h estimated</Badge>
                          {isActive ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => activeEntry && stopTimer(activeEntry.id)}
                            >
                              <Square className="h-4 w-4 mr-2" />
                              Stop
                            </Button>
                          ) : (
                            <Button variant="default" size="sm" onClick={() => startTimer(task.id)}>
                              <Play className="h-4 w-4 mr-2" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="entries" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Time Entries</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries
                    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
                    .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.taskName}</TableCell>
                        <TableCell>{entry.projectName}</TableCell>
                        <TableCell>{formatTime(entry.startTime)}</TableCell>
                        <TableCell>
                          {entry.isActive ? (
                            <Badge variant="secondary" className="animate-pulse">
                              Running
                            </Badge>
                          ) : entry.endTime ? (
                            formatTime(entry.endTime)
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="font-mono">{formatDuration(getActiveTimerDuration(entry))}</TableCell>
                        <TableCell className="max-w-xs truncate">{entry.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Time Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      hours: {
                        label: "Hours",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="hours" fill="var(--color-hours)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Time by Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Hours",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}h`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Task Efficiency Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Estimated Hours</TableHead>
                        <TableHead>Actual Hours</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectTimeData.map((data, index) => {
                        const task = tasks[index]
                        const efficiency = data.efficiency
                        const status = efficiency <= 100 ? "On Track" : efficiency <= 150 ? "Over Budget" : "Critical"
                        const statusColor =
                          efficiency <= 100
                            ? "bg-green-100 text-green-800"
                            : efficiency <= 150
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"

                        return (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.name}</TableCell>
                            <TableCell>{task.projectName}</TableCell>
                            <TableCell>{data.estimated}h</TableCell>
                            <TableCell>{data.actual}h</TableCell>
                            <TableCell>{efficiency}%</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColor}>
                                {status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
