"use client"

import { useState } from "react"
import { useAtom } from "jotai"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd-next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, CalendarIcon, Filter, Search, CheckSquare, X, GripVertical, LayoutGrid, Kanban } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { tasksAtom, projectsAtom, teamMembersAtom, type Task, type SubTask } from "@/lib/atoms"
import { TaskDetailDialog } from "./task-detail-dialog"
import { useToast } from "@/hooks/use-toast"

const COLUMN_IDS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  TEST_UNDER_REVIEW: "test-under-review",
  DONE: "done",
} as const

const COLUMN_TITLES = {
  [COLUMN_IDS.TODO]: "To Do",
  [COLUMN_IDS.IN_PROGRESS]: "In Progress",
  [COLUMN_IDS.TEST_UNDER_REVIEW]: "Test Under Review",
  [COLUMN_IDS.DONE]: "Done",
}

const COLUMN_COLORS = {
  [COLUMN_IDS.TODO]: "bg-gray-100 dark:bg-gray-800",
  [COLUMN_IDS.IN_PROGRESS]: "bg-blue-50 dark:bg-blue-950",
  [COLUMN_IDS.TEST_UNDER_REVIEW]: "bg-yellow-50 dark:bg-yellow-950",
  [COLUMN_IDS.DONE]: "bg-green-50 dark:bg-green-950",
}

export function TasksView() {
  const [tasks, setTasks] = useAtom(tasksAtom)
  const [projects] = useAtom(projectsAtom)
  const [teamMembers] = useAtom(teamMembersAtom)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // New task form state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"],
    assignee: "",
    dueDate: new Date(),
    projectId: "",
    tags: "",
  })

  // Subtasks state
  const [subTasks, setSubTasks] = useState<SubTask[]>([])
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("")

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDetailDialogOpen(true)
  }

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.projectId || !newTask.assignee) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const project = projects.find((p) => p.id === newTask.projectId)
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: format(newTask.dueDate, "yyyy-MM-dd"),
      projectId: newTask.projectId,
      projectName: project?.name || "",
      createdAt: new Date().toISOString(),
      tags: newTask.tags ? newTask.tags.split(",").map((tag) => tag.trim()) : [],
      progress: 0,
      timeSpent: "0h",
      estimatedTime: "0h",
      comments: [],
      attachments: [],
      subTasks: subTasks,
    }

    setTasks([...tasks, task])
    setIsCreateDialogOpen(false)
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: "",
      dueDate: new Date(),
      projectId: "",
      tags: "",
    })
    setSubTasks([])
    setNewSubTaskTitle("")

    toast({
      title: "Task Created",
      description: "Your task has been created successfully.",
    })
  }

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return

    const newSubTask: SubTask = {
      id: `st-${Date.now()}`,
      title: newSubTaskTitle,
      completed: false,
    }

    setSubTasks([...subTasks, newSubTask])
    setNewSubTaskTitle("")

    toast({
      title: "Subtask Added",
      description: "Subtask has been added successfully.",
    })
  }

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter((st) => st.id !== id))
    toast({
      title: "Subtask Removed",
      description: "Subtask has been removed.",
    })
  }

  const handleToggleSubTask = (id: string) => {
    setSubTasks(subTasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st)))
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const taskToMove = tasks.find((task) => task.id === draggableId)
    if (!taskToMove) return

    const updatedTask = {
      ...taskToMove,
      status: destination.droppableId as Task["status"],
      updatedAt: new Date().toISOString(),
    }

    const updatedTasks = tasks.map((task) => (task.id === draggableId ? updatedTask : task))

    setTasks(updatedTasks)

    toast({
      title: "Task Moved",
      description: `Task moved to ${COLUMN_TITLES[destination.droppableId as keyof typeof COLUMN_TITLES]}`,
    })
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const groupedTasksForBoard = {
    [COLUMN_IDS.TODO]: filteredTasks.filter((task) => task.status === COLUMN_IDS.TODO),
    [COLUMN_IDS.IN_PROGRESS]: filteredTasks.filter((task) => task.status === COLUMN_IDS.IN_PROGRESS),
    [COLUMN_IDS.TEST_UNDER_REVIEW]: filteredTasks.filter((task) => task.status === COLUMN_IDS.TEST_UNDER_REVIEW),
    [COLUMN_IDS.DONE]: filteredTasks.filter((task) => task.status === COLUMN_IDS.DONE),
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-gray-500"
      case "in-progress":
        return "bg-blue-500"
      case "test-under-review":
        return "bg-yellow-500"
      case "done":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return "border-l-green-500"
      case "medium":
        return "border-l-yellow-500"
      case "high":
        return "border-l-red-500"
      default:
        return "border-l-gray-500"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getSubTaskProgress = (task: Task) => {
    if (!task.subTasks || task.subTasks.length === 0) return null
    const completed = task.subTasks.filter((st) => st.completed).length
    const total = task.subTasks.length
    const percentage = (completed / total) * 100
    return { completed, total, percentage }
  }

  const stats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter((t) => t.status === "todo").length,
    inProgress: filteredTasks.filter((t) => t.status === "in-progress").length,
    testUnderReview: filteredTasks.filter((t) => t.status === "test-under-review").length,
    done: filteredTasks.filter((t) => t.status === "done").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage and track all your tasks</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your project</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select
                    value={newTask.projectId}
                    onValueChange={(value) => setNewTask({ ...newTask, projectId: value })}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee *</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value: Task["status"]) => setNewTask({ ...newTask, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="test-under-review">Test Under Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: Task["priority"]) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !newTask.dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.dueDate ? format(newTask.dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newTask.dueDate}
                        onSelect={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                  placeholder="e.g., design, frontend, urgent"
                />
              </div>

              {/* Subtasks Section */}
              <div className="grid gap-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Subtasks</Label>
                  {subTasks.length > 0 && <Badge variant="secondary">{subTasks.length}</Badge>}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSubTaskTitle}
                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddSubTask()
                      }
                    }}
                    placeholder="Add a subtask..."
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={handleAddSubTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {subTasks.length > 0 && (
                  <ScrollArea className="h-[200px] rounded-md border p-3">
                    <div className="space-y-2">
                      {subTasks.map((subTask) => (
                        <div
                          key={subTask.id}
                          className="flex items-center justify-between gap-2 rounded-md p-2 hover:bg-muted"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Checkbox
                              checked={subTask.completed}
                              onCheckedChange={() => handleToggleSubTask(subTask.id)}
                            />
                            <span className={cn("text-sm", subTask.completed && "line-through text-muted-foreground")}>
                              {subTask.title}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSubTask(subTask.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
                {subTasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No subtasks added yet. Add subtasks to break down this task into smaller steps.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testUnderReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.done}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="test-under-review">Test Under Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for List and Board Views */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Task List
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Tasks Board
          </TabsTrigger>
        </TabsList>

        {/* Task List View */}
        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => {
              const subTaskProgress = getSubTaskProgress(task)
              return (
                <Card
                  key={task.id}
                  className={cn(
                    "cursor-pointer border-l-4 transition-all hover:shadow-md",
                    getPriorityColor(task.priority),
                  )}
                  onClick={() => handleTaskClick(task)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-2">{task.title}</CardTitle>
                      <Badge className={cn("shrink-0 text-white", getStatusColor(task.status))}>
                        {task.status === "in-progress"
                          ? "In Progress"
                          : task.status === "todo"
                            ? "To Do"
                            : task.status === "test-under-review"
                              ? "Under Review"
                              : "Done"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>

                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {task.projectName}
                      </Badge>
                    </div>

                    {subTaskProgress && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CheckSquare className="h-3 w-3" />
                            <span>
                              {subTaskProgress.completed}/{subTaskProgress.total} subtasks
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${subTaskProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm pt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{getInitials(task.assignee)}</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{task.assignee}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{format(new Date(task.dueDate), "MMM d")}</span>
                      </div>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {task.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{task.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or create a new task</p>
            </div>
          )}
        </TabsContent>

        {/* Tasks Board View with Drag and Drop */}
        <TabsContent value="board">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(COLUMN_IDS).map(([key, columnId]) => (
                <Card key={columnId} className={cn("flex flex-col", COLUMN_COLORS[columnId])}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">{COLUMN_TITLES[columnId]}</CardTitle>
                      <Badge variant="secondary">{groupedTasksForBoard[columnId].length}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-3">
                    <Droppable droppableId={columnId}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "space-y-2 min-h-[500px] rounded-md p-2 transition-colors",
                            snapshot.isDraggingOver && "bg-muted/50",
                          )}
                        >
                          {groupedTasksForBoard[columnId].map((task, index) => {
                            const subTaskProgress = getSubTaskProgress(task)
                            return (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={cn(
                                      "cursor-pointer border-l-4 transition-all hover:shadow-md bg-white",
                                      getPriorityColor(task.priority),
                                      snapshot.isDragging && "shadow-lg rotate-2",
                                    )}
                                    onClick={() => handleTaskClick(task)}
                                  >
                                    <CardContent className="p-3 space-y-2">
                                      <div className="flex items-start gap-2">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="mt-1 cursor-grab active:cursor-grabbing"
                                        >
                                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                          <h4 className="text-sm font-semibold line-clamp-2">{task.title}</h4>
                                          <p className="text-xs text-muted-foreground line-clamp-2">
                                            {task.description}
                                          </p>
                                        </div>
                                      </div>

                                      {subTaskProgress && (
                                        <div className="space-y-1">
                                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                              <CheckSquare className="h-3 w-3" />
                                              <span>
                                                {subTaskProgress.completed}/{subTaskProgress.total}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                            <div
                                              className="h-full bg-blue-500 transition-all"
                                              style={{ width: `${subTaskProgress.percentage}%` }}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1">
                                          <Avatar className="h-5 w-5">
                                            <AvatarFallback className="text-[10px]">
                                              {getInitials(task.assignee)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <span className="text-muted-foreground truncate max-w-[80px]">
                                            {task.assignee}
                                          </span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px]">
                                          {task.priority}
                                        </Badge>
                                      </div>

                                      {task.tags && task.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {task.tags.slice(0, 2).map((tag, index) => (
                                            <Badge key={index} variant="secondary" className="text-[10px]">
                                              {tag}
                                            </Badge>
                                          ))}
                                          {task.tags.length > 2 && (
                                            <Badge variant="secondary" className="text-[10px]">
                                              +{task.tags.length - 2}
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                          {groupedTasksForBoard[columnId].length === 0 && (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                              <p className="text-sm">No tasks</p>
                              <p className="text-xs">Drag tasks here</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>
      </Tabs>

      <TaskDetailDialog task={selectedTask} open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} />
    </div>
  )
}
