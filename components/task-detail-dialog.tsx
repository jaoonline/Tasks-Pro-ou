"use client"

import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  User,
  Tag,
  MessageSquare,
  Paperclip,
  Save,
  X,
  CheckCircle2,
  Circle,
  Timer,
  Flag,
  FolderOpen,
  ExternalLink,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { type Task, tasksAtom, teamMembersAtom, projectsAtom } from "@/lib/atoms"

interface TaskDetailDialogProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: (task: Task) => void
}

export function TaskDetailDialog({ task, isOpen, onClose, onUpdate }: TaskDetailDialogProps) {
  const [tasks, setTasks] = useAtom(tasksAtom)
  const [teamMembers] = useAtom(teamMembersAtom)
  const [projects] = useAtom(projectsAtom)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"todo" | "in-progress" | "completed">("todo")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [assignee, setAssignee] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [projectId, setProjectId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
      setPriority(task.priority)
      setAssignee(task.assignee)
      setDueDate(task.dueDate)
      setProjectId(task.projectId)
      setTags(task.tags || [])
      setProgress(task.progress || 0)
      setTimeSpent(task.timeSpent || "0h")
      setEstimatedTime(task.estimatedTime || "0h")
    }
  }, [task])

  const handleSave = () => {
    if (task) {
      const selectedProject = projects.find((p) => p.id === projectId)
      const updatedTask: Task = {
        ...task,
        title,
        description,
        status,
        priority,
        assignee,
        dueDate,
        projectId,
        projectName: selectedProject?.name || task.projectName,
        tags,
        progress,
        timeSpent,
        estimatedTime,
        updatedAt: new Date().toISOString(),
      }

      // Update tasks in Jotai state
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))

      // Call onUpdate if provided
      if (onUpdate) {
        onUpdate(updatedTask)
      }
    }
    onClose()
  }

  const handleProjectClick = () => {
    if (projectId) {
      // Dispatch custom event to navigate to project details
      const event = new CustomEvent("navigateToProject", {
        detail: { projectId },
      })
      window.dispatchEvent(event)
      onClose()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Timer className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-500 bg-yellow-50 border-yellow-200"
      default:
        return "text-green-500 bg-green-50 border-green-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      case "in-progress":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!task) return null

  const selectedProject = projects.find((p) => p.id === projectId)
  const comments = task.comments || []
  const attachments = task.attachments || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden scrollbar-hide">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Task Details</DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto scrollbar-hide">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Header */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Task Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 text-lg font-medium"
                  placeholder="Enter task title..."
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={cn("px-3 py-1", getStatusColor(status))}>
                  {getStatusIcon(status)}
                  <span className="ml-2 capitalize">{status.replace("-", " ")}</span>
                </Badge>
                <Badge variant="outline" className={cn("px-3 py-1", getPriorityColor(priority))}>
                  <Flag className="h-4 w-4 mr-2" />
                  <span className="capitalize">{priority} Priority</span>
                </Badge>
                {selectedProject && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={handleProjectClick}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {selectedProject.name}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger className="scrollbar-hide">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="scrollbar-hide">
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger className="scrollbar-hide">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="scrollbar-hide">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignee" className="text-sm font-medium">
                  Assignee
                </Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger className="scrollbar-hide">
                    <SelectValue placeholder="Select assignee" />
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
                <Label htmlFor="dueDate" className="text-sm font-medium">
                  Due Date
                </Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>

            {/* Project Selection */}
            <div>
              <Label htmlFor="project" className="text-sm font-medium">
                Project
              </Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="scrollbar-hide">
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

            {/* Project Link Section */}
            {selectedProject && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">Project</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleProjectClick}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                  >
                    {selectedProject.name}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add task description..."
                className="mt-1 min-h-[120px] scrollbar-hide"
              />
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments ({comments.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-auto scrollbar-hide">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.avatar || getInitials(comment.author)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>}
              </div>

              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>YU</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[80px] scrollbar-hide"
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" disabled={!newComment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Task Metadata */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Task Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Assignee</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{assignee || "Unassigned"}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <FolderOpen className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Project</p>
                    {selectedProject ? (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={handleProjectClick}
                        className="p-0 h-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        {selectedProject.name}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">No project</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Time Tracking</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {timeSpent} / {estimatedTime}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Progress</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{progress}%</p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments ({attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Add Attachment
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="h-6 px-2 text-xs bg-transparent">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
