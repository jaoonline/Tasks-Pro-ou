"use client"

import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  Paperclip,
  Tag,
  Flag,
  CheckCircle2,
  Circle,
  AlertCircle,
  Save,
  X,
  Edit,
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
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setStatus(task.status || "todo")
      setPriority(task.priority || "medium")
      setAssignee(task.assignee || "")
      setDueDate(task.dueDate || "")
      setProjectId(task.projectId || "")
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
    setIsEditing(false)
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
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getInitials = (name: string) => {
    if (!name || typeof name !== "string") return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleAddComment = () => {
    if (newComment.trim() && task) {
      const comment = {
        id: Date.now().toString(),
        author: "Current User",
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
        avatar: "CU",
      }

      const updatedTask = {
        ...task,
        comments: [...(task.comments || []), comment],
      }

      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))
      setNewComment("")
    }
  }

  if (!task) return null

  const selectedProject = projects.find((p) => p.id === projectId)
  const comments = task.comments || []
  const attachments = task.attachments || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full max-h-[95vh]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <DialogHeader className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <DialogTitle className="text-xl sm:text-2xl font-bold truncate pr-2">
                  {isEditing ? (
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-xl sm:text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0"
                      placeholder="Task title..."
                    />
                  ) : (
                    title || "Untitled Task"
                  )}
                </DialogTitle>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" className={cn("px-3 py-1", getPriorityColor(priority))}>
                    <Flag className="w-3 h-3 mr-1" />
                    {priority}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getStatusIcon(status)}
                    {status.replace("-", " ")}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)} className="ml-2">
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Task Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  {isEditing ? (
                    <Select value={projectId} onValueChange={setProjectId}>
                      <SelectTrigger>
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
                  ) : (
                    <Input id="project" value={selectedProject?.name || "No project"} readOnly className="truncate" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  {isEditing ? (
                    <Select value={assignee} onValueChange={setAssignee}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
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
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>{getInitials(assignee)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">{assignee || "Unassigned"}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    readOnly={!isEditing}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={status.replace("-", " ")} readOnly className="capitalize" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  {isEditing ? (
                    <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={priority} readOnly className="capitalize" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress</Label>
                  {isEditing ? (
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  readOnly={!isEditing}
                  className="min-h-[100px] resize-none"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add task description..."
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {tags.length === 0 && <span className="text-sm text-muted-foreground">No tags</span>}
                </div>
              </div>

              {/* Time Tracking */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time-spent">Time Spent</Label>
                  <Input
                    id="time-spent"
                    value={timeSpent}
                    readOnly={!isEditing}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    placeholder="e.g., 2h 30m"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated-time">Estimated Time</Label>
                  <Input
                    id="estimated-time"
                    value={estimatedTime}
                    readOnly={!isEditing}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="e.g., 4h"
                  />
                </div>
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <Paperclip className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm flex-1 truncate">{attachment.name}</span>
                        <span className="text-xs text-muted-foreground">{attachment.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1 sm:flex-none">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-muted/30">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Task Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Task Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due:</span>
                      <span>{dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Assignee:</span>
                      <span className="truncate">{assignee || "Unassigned"}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Comments Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Comments ({comments.length})
                  </h3>

                  {/* Add Comment */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none text-sm"
                    />
                    <Button size="sm" className="w-full" onClick={handleAddComment} disabled={!newComment.trim()}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>

                  <Separator />

                  {/* Comments List */}
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">{getInitials(comment.author)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate">{comment.author || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground pl-8 leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
