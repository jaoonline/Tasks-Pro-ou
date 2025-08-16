"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, User, X } from "lucide-react"
import { TaskDetailDialog } from "./task-detail-dialog"
import toast from "react-hot-toast"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
  projectId: string
  projectName: string
  createdAt: string
}

interface TasksViewProps {
  selectedProject?: string | null
}

export function TasksView({ selectedProject }: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as const,
    priority: "medium" as const,
    assignee: "",
    dueDate: "",
    projectId: "",
    projectName: "",
  })

  // Demo team members
  const teamMembers = [
    { id: "1", name: "John Doe", email: "john.doe@company.com" },
    { id: "2", name: "Jane Smith", email: "jane.smith@company.com" },
    { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com" },
    { id: "4", name: "Sarah Wilson", email: "sarah.wilson@company.com" },
    { id: "5", name: "Alex Chen", email: "alex.chen@company.com" },
  ]

  // Demo projects
  const projects = [
    { id: "1", name: "Website Redesign" },
    { id: "2", name: "Mobile App Development" },
    { id: "3", name: "Marketing Campaign" },
    { id: "4", name: "API Integration" },
    { id: "5", name: "Security Audit" },
  ]

  useEffect(() => {
    // Load demo tasks with proper project relationships
    const demoTasks: Task[] = [
      {
        id: "1",
        title: "Design Homepage Layout",
        description: "Create wireframes and mockups for the new homepage design",
        status: "in-progress",
        priority: "high",
        assignee: "Jane Smith",
        dueDate: "2024-01-15",
        projectId: "1",
        projectName: "Website Redesign",
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        title: "Implement User Authentication",
        description: "Set up login and registration functionality",
        status: "todo",
        priority: "high",
        assignee: "John Doe",
        dueDate: "2024-01-20",
        projectId: "2",
        projectName: "Mobile App Development",
        createdAt: "2024-01-02",
      },
      {
        id: "3",
        title: "Create Social Media Content",
        description: "Develop content calendar and create posts for Q1",
        status: "completed",
        priority: "medium",
        assignee: "Mike Johnson",
        dueDate: "2024-01-10",
        projectId: "3",
        projectName: "Marketing Campaign",
        createdAt: "2024-01-03",
      },
      {
        id: "4",
        title: "Database Schema Design",
        description: "Design and implement the database structure",
        status: "in-progress",
        priority: "high",
        assignee: "Sarah Wilson",
        dueDate: "2024-01-25",
        projectId: "4",
        projectName: "API Integration",
        createdAt: "2024-01-04",
      },
      {
        id: "5",
        title: "Security Vulnerability Assessment",
        description: "Conduct comprehensive security audit",
        status: "todo",
        priority: "high",
        assignee: "Alex Chen",
        dueDate: "2024-02-01",
        projectId: "5",
        projectName: "Security Audit",
        createdAt: "2024-01-05",
      },
      {
        id: "6",
        title: "Mobile UI Components",
        description: "Build reusable UI components for mobile app",
        status: "todo",
        priority: "medium",
        assignee: "Jane Smith",
        dueDate: "2024-01-30",
        projectId: "2",
        projectName: "Mobile App Development",
        createdAt: "2024-01-06",
      },
      {
        id: "7",
        title: "Content Management System",
        description: "Implement CMS for website content updates",
        status: "todo",
        priority: "medium",
        assignee: "John Doe",
        dueDate: "2024-02-05",
        projectId: "1",
        projectName: "Website Redesign",
        createdAt: "2024-01-07",
      },
    ]
    setTasks(demoTasks)
  }, [])

  useEffect(() => {
    // Filter tasks based on selected project
    if (selectedProject) {
      const filtered = tasks.filter((task) => task.projectId === selectedProject)
      setFilteredTasks(filtered)
    } else {
      setFilteredTasks(tasks)
    }
  }, [tasks, selectedProject])

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required")
      return
    }

    if (!newTask.description.trim()) {
      toast.error("Task description is required")
      return
    }

    if (!newTask.dueDate) {
      toast.error("Due date is required")
      return
    }

    if (!newTask.assignee) {
      toast.error("Please assign the task to a team member")
      return
    }

    if (!newTask.projectId) {
      toast.error("Please select a project")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedProjectData = projects.find((p) => p.id === newTask.projectId)

      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        projectId: newTask.projectId,
        projectName: selectedProjectData?.name || "",
        createdAt: new Date().toISOString(),
      }

      setTasks([...tasks, task])
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignee: "",
        dueDate: "",
        projectId: "",
        projectName: "",
      })
      setIsCreateDialogOpen(false)
      toast.success("Task created successfully!")
    } catch (error) {
      toast.error("Failed to create task. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-500"
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

  const selectedProjectName = selectedProject ? projects.find((p) => p.id === selectedProject)?.name : null

  const stats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter((t) => t.status === "todo").length,
    inProgress: filteredTasks.filter((t) => t.status === "in-progress").length,
    completed: filteredTasks.filter((t) => t.status === "completed").length,
  }

  return (
    <div className="space-y-6 scrollbar-hide">
      {/* Project Context Header */}
      {selectedProject && (
        <div className="bg-muted/50 rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Project: {selectedProjectName}</h3>
              <p className="text-sm text-muted-foreground">Showing {filteredTasks.length} tasks for this project</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <X className="h-4 w-4 mr-2" />
              View All Tasks
            </Button>
          </div>
        </div>
      )}

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.todo}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] scrollbar-hide overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your project.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 scrollbar-hide">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                  disabled={isLoading}
                  className="scrollbar-hide"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value: any) => setNewTask({ ...newTask, status: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent className="scrollbar-hide">
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project">Project</Label>
                  <Select
                    value={newTask.projectId}
                    onValueChange={(value) => {
                      const project = projects.find((p) => p.id === value)
                      setNewTask({
                        ...newTask,
                        projectId: value,
                        projectName: project?.name || "",
                      })
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent className="scrollbar-hide">
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleCreateTask} className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 hover-scrollbar overflow-y-auto max-h-[70vh]">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
        ))}
      </div>

      {/* Task Detail Dialog */}
      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)))
            setSelectedTask(null)
          }}
        />
      )}
    </div>
  )
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "todo":
        return "bg-gray-500"
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

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
              <Badge variant="outline" className="text-xs">
                {task.status.replace("-", " ")}
              </Badge>
              <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                {task.priority}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">{task.description}</p>

        {/* Project Badge */}
        <div className="mb-4">
          <Badge variant="secondary" className="text-xs">
            {task.projectName}
          </Badge>
        </div>

        {/* Task Details */}
        <div className="space-y-2">
          {task.assignee && (
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">{getInitials(task.assignee)}</AvatarFallback>
              </Avatar>
              <span>{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
